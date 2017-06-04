import colors from 'colors'; // eslint-disable-line no-unused-vars

import store from './store';

import { playerJoins, playerQuits, burnWitch } from './reducers/players';
import { playerEnters, playerMoves } from './reducers/rooms';

import { roomEmitter, playerEmitter } from './eventEmitters';

import { createTellnetServer, use, USER_CONNECTED } from './server';

import { ps } from './art';

const roomListeners = {
  // userId: { roomId, listener }
};

const roomListener = ({ client, l, prompt }, roomId) => {
  const listener = msg => {
    l(`${msg}`);
    prompt();
  };

  roomUnlistener(client.userId);

  roomEmitter.on(roomId, listener);
  roomListeners[client.userId] = {
    roomId,
    listener,
  };
};

const roomUnlistener = userId => {
  console.log('***** roomListeners', roomListeners)
  console.log('***** roomListeners[userId]', roomListeners[userId])
  const { listener, roomId } = roomListeners[userId] || {};
  if (roomId) {
    console.log('***** unlisten roomId')
    roomEmitter.removeListener(roomId, listener); // eslint-disable-line no-unused-expressions
    roomListeners[userId] = undefined;
  }
};

createTellnetServer(err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});

use(USER_CONNECTED, ({ l }) => {
  ps.rainbow.split('\n').forEach(a => l(a));
  l();
  l(`${'Connected to'.white.bold} ${'Purple MUD!'.blue.bold}`);
  l(`Type ${'join'.underline.bold.white} ${'<username>'.underline.bold.white} to join.\n`);
});

use(/join/, middlewareProps => {
  const { l, client, commands, prompt } = middlewareProps;
  if (client.userId) {
    l('You are already in the game');
    return;
  }
  const name = commands[1];
  if (!name || name === 'username') {
    return l('Please choose a username');
  }
  const player = playerJoins(name); // this is so hacky
  if (!player) {
    return l('Username Taken, try again:');
  }

  l('You open your eyes, look around you and see that you are in....');
  l();
  client.userId = player;
  const roomId = 1;
  playerEnters(roomId, client.userId);
  renderRoom(middlewareProps);
  roomListener(middlewareProps, roomId);
  playerEmitter.on(client.userId, msg => {
    l(`${msg}`);
    prompt();
  });
});

use(['quit', 'exit'], ({ l, client }) => {
  l('Bye bye!');
  client.destroyable = true;
  client.setRawMode(false);
  playerQuits(client.userId);
  setTimeout(() => client.destroySoon(), 2000);
});


const moveToDirection = direction => middlewareProps => {
  const { l, client } = middlewareProps;
  const { players: { [client.userId]: player } } = store.getState();
  if (!player) return;

  if (player.hp <= 0) {
    return l(`${'You cannot move.'.bold.white} Your soul is tainted by the blasphimous judgment of the Edinburgh mob.`);
  }
  const newRoomId = playerMoves(direction, client.userId);
  if (!newRoomId) {
    return l(`You cannot go ${direction}`);
  }
  roomUnlistener(client.userId);
  // TODO: fix double movement text
  // if (direction === 'down') {
  //   l('You descend.');
  // } else if (direction === 'up') {
  //   l('You ascend.');
  // } else {
  //   l(`You walk ${direction}.\n`);
  // }
  renderRoom(middlewareProps);
  roomListener(middlewareProps, newRoomId);
};

// Direction commands
use(['north', 'n'], moveToDirection('north'));
use(['south', 's'], moveToDirection('south'));
use(['east', 'e'], moveToDirection('east'));
use(['west', 'w'], moveToDirection('west'));
use(['up', 'u'], moveToDirection('up'));
use(['down', 'd'], moveToDirection('down'));

use(({ l, command }) => {
  console.log('unknown command:'.bold, command);
  if (!command) {
    return;
  }
  l(`unknown command: ${command}`);
});

const renderRoom = ({ l, client }) => {
  const state = store.getState();
  const { players: { [client.userId]: { roomId } } } = state;
  const {
    rooms: { [roomId]: room },
    players,
  } = state;
  l(room.name.bold);
  l(room.description);

  const userDirectionOptions = ({ directions }) => Object
    .keys(directions)
    .join(', ')
    .bold.green;

  l();
  l(`Directions: ${userDirectionOptions(room)}`);

  const playerNames = room.players
    .filter(playerId => playerId !== client.userId)
    .map(playerId => players[playerId].name).join(', ');
  if (playerNames.length) {
    l(`${'Players in the room:'} ${playerNames.blue.bold}`);
  }
};

use(['look', 'l'], renderRoom);

use(/burn/, middlewareProps => {
  const { l, client, commands } = middlewareProps;
  const { players, rooms } = store.getState();
  const { [client.userId]: player } = players;
  if (!player) return;

  const { [player.roomId]: { peace, name: roomName } } = rooms;
  if (peace) {
    return l(`${roomName} is a peaceful place`);
  }
  const name = commands[1];
  if (!name) {
    return l('Who do you want to burn?');
  }

  const burned = burnWitch(name, player.roomId, client.userId); // this is so hacky
  if (!burned) {
    l(`${name} is not here...`);
  }
});
