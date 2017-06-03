import { v4 } from 'uuid';

import colors from 'colors'; // eslint-disable-line no-unused-vars
import isArray from 'lodash/isArray';

const USER_CONNECTED = v4();
const telnet = require('telnet');

const port = 1337;
console.log('starting server on port:', port);

telnet.createServer(client => {
  console.log('new client');

  // make unicode characters work properly
  client.do.transmit_binary();

  // make the client emit 'window size' events
  client.do.window_size();

  // listen for the window size events from the client
  client.on('window size', e => {
    if (e.command === 'sb') {
      console.log('telnet window resized to %d x %d', e.width, e.height);
    }
  });

  const l = (message = '') => client.write(`${message}\n`);
  const prompt = () => client.write('\n> '.yellow.bold);

  const processCommand = getCommandProcessor({ l, prompt, client });

  // listen for the actual data from the client
  client.on('data', command => processCommand(command.toString().trim()));

  processCommand(USER_CONNECTED);
}).listen(port);

const getCommandProcessor = middlewareProps => command => {
  let middlewareExecuted = false;
  const commands = command.split(' ');
  console.log('command:' + command);
  const executeMiddleware = response => {
    middlewareExecuted = true;
    response({
      commands,
      ...middlewareProps,
    });
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
  use,
  USER_CONNECTED,
};
