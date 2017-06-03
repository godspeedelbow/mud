import colors from 'colors'; // eslint-disable-line no-unused-vars

import store from './store';

import { playerJoins, playerQuits } from './reducers/players';
import { playerEnters, playerMoves } from './reducers/rooms';

import { use, USER_CONNECTED } from './server';

use(USER_CONNECTED, ({ l, prompt }) => {
  l('Connected to MUD!'.red.bold);
  l(`Type ${'join'.underline} to join.\n`);
  prompt();
});

use(/join/, middlewareProps => {
  const { l, prompt, client } = middlewareProps;
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
  renderRoom(middlewareProps);
});

use(['quit', 'exit'], ({ l, client }) => {
  l('Bye bye!');
  playerQuits(client.userId);
  client.end();
});

const moveToDirection = direction => middlewareProps => {
  const { l, client } = middlewareProps;
  console.log(direction);
  const newRoomId = playerMoves(direction, client.userId);
  if (!newRoomId) {
    l(`you cannot go ${direction}`);
  } else {
    l(`you go ${direction}`);
    renderRoom(middlewareProps);
  }
};

use(/north/, moveToDirection('north'));
use(/^n/, moveToDirection('north'));

use(/south/, moveToDirection('south'));
use(/^s/, moveToDirection('south'));

use(/east/, moveToDirection('east'));
use(/^e/, moveToDirection('east'));

use(/west/, moveToDirection('west'));
use(/^w/, moveToDirection('west'));

use(['look', 'l'], ({ l, client }) => {
  const { players: { [client.userId]: { roomId } } } = store.getState();
  renderRoom(l, client, roomId);
});

use(({ l, prompt, command }) => {
  l(`unknown command: ${command}`);
  prompt();
});

const renderRoom = ({ l, client, prompt }) => {
  const state = store.getState();
  const { players: { [client.userId]: { roomId } } } = state;
  const {
    rooms: { [roomId]: room },
    players,
  } = state;
  l(room.name.bold);
  l(room.description);
  const playerNames = room.players
    .filter(playerId => playerId !== client.userId)
    .map(playerId => players[playerId].name).join(', ');
  l();
  l(`${'Players in the room:'.blue.bold} ${playerNames.length ? playerNames : 'none'}`);
  prompt();
};
