import colors from 'colors'; // eslint-disable-line no-unused-vars

import store from './store';

import { playerJoins, playerQuits } from './reducers/players';
import { playerEnters, playerMoves } from './reducers/rooms';

import { roomEmitter } from './eventEmitters';

import { createTellnetServer, use, USER_CONNECTED } from './server';

const createRoomListener = ({ client, l, prompt }) => {
  let roomId;

  const log = msg => {
    l(`${msg}`);
    prompt();
  };

  return newRoomId => {
    // console.log('***** ', client.userId, 'listens to room', newRoomId);
    roomId && roomEmitter.removeListener(roomId, log); // eslint-disable-line no-unused-expressions
    roomEmitter.on(newRoomId, log);
    roomId = newRoomId;
  };
};

let roomListener;

createTellnetServer((err, middlewareProps) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  roomListener = createRoomListener(middlewareProps);
});

use(USER_CONNECTED, ({ l }) => {
  l('Connected to MUD!'.red.bold);
  l(`Type ${'join'.underline} ${'username'.underline} to join.\n`);
});

use(/join/, middlewareProps => {
  const { l, client, commands } = middlewareProps;
  if (client.userId) {
    l('You are already in the game');
    return;
  }
  const name = commands[1];
  if (!name) {
    return l('Please choose a username');
  }
  const player = playerJoins(name); // this is so hacky
  if (player) {
    l('You open your eyes, look around you and see that you are in....');
    l();
    client.userId = player;
    const roomId = 1;
    playerEnters(roomId, client.userId);
    renderRoom(middlewareProps);
    roomListener(roomId);
  } else {
    l('Username Taken, try again:');
  }
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
  const newRoomId = playerMoves(direction, client.userId);
  if (!newRoomId) {
    return l(`you cannot go ${direction}`);
  }
  if (direction === 'down') {
    l('You descend.');
  } else if (direction === 'up') {
    l('You ascend.');
  } else {
    l(`You walk ${direction}.\n`);
  }
  renderRoom(middlewareProps);
  roomListener(newRoomId);
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
