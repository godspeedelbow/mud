// TODO: rewrite this ugly ass code

const telnet = require('telnet');

import store from './store';

import { playerJoins, playerQuits } from './reducers/players';
import { playerEnters } from './reducers/rooms';

import colors from 'colors';

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

  // listen for the actual data from the client
  client.on('data', function (b) {
    if (b.toString().match(/join/)) {
      const name = 'elbow';
      l('You open your eyes, look around you and see that you are in....');
      l();
      client.userId = playerJoins('elbow');
      const roomId = 1;
      playerEnters(roomId, client.userId);
      const room = store.getState().rooms[roomId];
      l(room.name.bold);
      l(room.description);
      l();
      l(`The only thing you can do here, is wait. Type ${`quit`.underline} to leave.`);
      prompt();
    } else if (b.toString().match(/quit/)) {
      l('Bye bye!');
      playerQuits(client.userId);
      client.end();
    } else {
      l(`unknown command: ${b}`);
      prompt();
    }
  })

  l('Connected to MUD!'.red.bold);
  l(`Type ${`join`.underline} to join.\n`);
  prompt();

  function l(message = '') {
    client.write(`${message}\n`);
  };

  function prompt() {
    client.write(`\n> `.yellow.bold);
  }
}).listen(port);
