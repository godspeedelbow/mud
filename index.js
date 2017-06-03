import store from './store';

import { playerJoins, playerQuits } from './reducers/players';
import { playerEnters, playerMoves } from './reducers/rooms';

import { use, USER_CONNECTED } from './server';

use(USER_CONNECTED, ({ l, prompt }) => {
  l('Connected to MUD!'.red.bold);
  l(`Type ${'join'.underline} to join.\n`);
  prompt();
});

use(/join/, ({ l, prompt, client }) => {
  if (client.userId) {
    l('You are already in the game');
    return prompt();
  }
  const name = 'elbow';
  l('You open your eyes, look around you and see that you are in....');
  l();
  client.userId = playerJoins(name);
  const roomId = 1;
  playerEnters(roomId, client.userId);
  renderRoom(l, roomId);
  prompt();
});

use(/quit/, ({ l, client }) => {
  l('Bye bye!');
  playerQuits(client.userId);
  client.end();
});

use(/north/, ({ l, prompt, client }) => {
  const newRoomId = playerMoves('north', client.userId);
  if (!newRoomId) {
    l('not allowed');
  } else {
    l('you go north');
    renderRoom(l, newRoomId);
  }
  prompt();
});

use(({ l, prompt, command }) => {
  l(`unknown command: ${command}`);
  prompt();
});

const renderRoom = (l, roomId) => {
  const room = store.getState().rooms[roomId];
  l(room.name.bold);
  l(room.description);
  l();
  l(`The only thing you can do here, is wait. Type ${'quit'.underline} to leave.`);
};
