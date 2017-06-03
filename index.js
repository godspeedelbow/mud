import store from './store';

import { playerJoins, playerQuits } from './reducers/players';
import { playerEnters } from './reducers/rooms';

import { use, USER_CONNECTED } from './server';

use(/join/, ({ l, prompt, client }) => {
  if (client.userId) {
    l('You are already in the game');
    return prompt();
  }
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
});

use(USER_CONNECTED, ({ l, prompt }) => {
  l('Connected to MUD!'.red.bold);
  l(`Type ${`join`.underline} to join.\n`);
  prompt();
});

use(/quit/, ({ l, client }) => {
  l('Bye bye!');
  playerQuits(client.userId);
  client.end();
});

use(({ l, prompt, command }) => {
  l(`unknown command: ${command}`);
  prompt();
});
