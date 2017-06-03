const telnet = require('telnet');

import { v4 } from 'uuid';

import colors from 'colors';

const USER_CONNECTED = v4();

const port = 1337;
console.log('starting server on port:', port);

telnet.createServer(function (client) {
  console.log('new client');

  // make unicode characters work properly
  client.do.transmit_binary();

  // make the client emit 'window size' events
  client.do.window_size();

  // listen for the window size events from the client
  client.on('window size', function (e) {
    if (e.command === 'sb') {
      console.log('telnet window resized to %d x %d', e.width, e.height);
    }
  });

  const l = (message = '') => client.write(`${message}\n`);
  const prompt = () => client.write('\n> '.yellow.bold);

  const processCommand = getCommandProcessor({ l, prompt, client });

  // listen for the actual data from the client
  client.on('data', command => processCommand(command.toString()));

  processCommand(USER_CONNECTED);
}).listen(port);

const getCommandProcessor = middlewareProps => command => {
  let middlewareExecuted = false;
  const executeMiddleware = response => {
    middlewareExecuted = true;
    response({
      command,
      ...middlewareProps,
    });
  };

  middlewares.forEach(({ matchCommand, response }) => {
    if (matchCommand === command) {
      executeMiddleware(response);
      return;
    }
    if (matchCommand instanceof RegExp && command.match(matchCommand)) {
      executeMiddleware(response);
      return;
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
    return middlewares.push({
      matchCommand,
      response
    });
  }
  response = matchCommand;
  unusableMiddlewares.push(response);
}

module.exports = {
  use,
  USER_CONNECTED,
};
