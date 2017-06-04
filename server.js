import { v4 } from 'uuid';

import colors from 'colors'; // eslint-disable-line no-unused-vars
import { isBuffer, isArray } from 'lodash';

import { createServer, COMMANDS, OPTIONS } from 'telnet';

const USER_CONNECTED = v4();

const port = 1337;
console.log('starting server on port:', port);
const createTellnetServer = done => {
  createServer({ tty: true }, client => {
    console.log('client'.cyan.bold, 'connected'.bold.white);

    // make unicode characters work properly
    client.do.transmit_binary();

    // make the client emit 'window size' events
    client.do.window_size();

    // force client into character mode
    // see also: https://stackoverflow.com/questions/273261/force-telnet-client-into-character-mode
    client.setRawMode(true);

    // listen for the window size events from the client
    // client.on('window size', e => {
    //   if (e.command === 'sb') {
    //     console.log('telnet window resized to %d x %d', e.width, e.height);
    //   }
    // });

    let command = '';
    const l = (message = '') => client.write(`\n${message}`);
    const prompt = () => client.write('\n> '.yellow.bold + command);
    const sessionProps = { l, prompt, client };
    const processCommand = getCommandProcessor(sessionProps);

    // listen for the actual data from the client
    client.on('data', c => {
      if (c.toString('hex') === '0d') { // enter
        processCommand(command);
        command = '';
        prompt('');
        return;
      }
      if (c.toString('hex') === '7f') { // backspace
        // send backspace
        // from: https://stackoverflow.com/a/6078666
        client.output.write(new Buffer([
          0x08,
          0x20,
          0x08,
        ]));
        command = command.substring(0, command.length - 1);
        return;
      }
      command += c;
      client.write(c);
    });

    done(null, sessionProps); // eslint-disable-line callback-return

    processCommand(USER_CONNECTED);
    prompt('');
  }).listen(port);
};

const getCommandProcessor = middlewareProps => command => {
  let middlewareExecuted = false;
  const commands = command.split(' ');
  const executeMiddleware = response => {
    middlewareExecuted = true;
    try {
      response({
        command, // raw original command by user
        commands, // processed command
        ...middlewareProps,
      });
    } catch (e) {
      console.log('middleware crashed:'.red.bold, e);
    }
  };

  middlewares.forEach(({ matchCommand, response }) => {
    if (matchCommand === command) {
      return executeMiddleware(response);
    }
    if (matchCommand instanceof RegExp && command.match(matchCommand)) {
      return executeMiddleware(response);
    }
  });

  if (!middlewareExecuted) {
    unusableMiddlewares.forEach(response => executeMiddleware(response));
  }
};

const middlewares = [];
const unusableMiddlewares = [];
function use(matchCommand, response) {
  if (response) {
    if (!isArray(matchCommand)) {
      return middlewares.push({
        matchCommand,
        response,
      });
    } else {
      return matchCommand.forEach(_matchCommand => middlewares.push({
        matchCommand: _matchCommand,
        response,
      }));
    }
  }
  response = matchCommand;
  unusableMiddlewares.push(response);
}

module.exports = {
  createTellnetServer,
  use,
  USER_CONNECTED,
};
