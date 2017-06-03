import colors from 'colors'; // eslint-disable-line no-unused-vars

import store from './store';

import { playerJoins, playerQuits } from './reducers/players';
import { playerEnters, playerMoves, roomEmitter } from './reducers/rooms';

import { createTellnetServer, use, USER_CONNECTED } from './server';

const createRoomListener = ({ l, prompt }) => {
  let roomId;

  const log = msg => {
    l(`\n${msg}`);
    prompt();
  };

  return newRoomId => {
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
  l(`Type ${'join'.underline} to join.\n`);
});

use(/join/, middlewareProps => {
  const { l, client } = middlewareProps;
  if (client.userId) {
    l('You are already in the game');
    return;
  }
  const name = 'elbow';
  l('You open your eyes, look around you and see that you are in....');
  l();
  client.userId = playerJoins(name);
  const roomId = 1;
  playerEnters(roomId, client.userId);
  renderRoom(middlewareProps);
  roomListener(roomId);
});

use(['quit', 'exit'], ({ l, client }) => {
  l('Bye bye!');
  playerQuits(client.userId);
  client.end();
});


const moveToDirection = direction => middlewareProps => {
  const { l, client } = middlewareProps;
  // console.log('taken direction: ');
  // console.log(direction);
  const newRoomId = playerMoves(direction, client.userId);
  if (!newRoomId) {
    l(`you cannot go ${direction}`);
  } else {
    l(`You go ${direction}`);
    renderRoom(middlewareProps);
    roomListener(newRoomId);
  }
};

// Direction commands
use(['north', 'n'], moveToDirection('north'));
use(['south', 's'], moveToDirection('south'));
use(['east', 'e'], moveToDirection('east'));
use(['west', 'w'], moveToDirection('west'));

use(({ l, command }) => {
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
    .join(', ');

  l(`From this room you can go: ${userDirectionOptions(room)}`);

  const playerNames = room.players
    .filter(playerId => playerId !== client.userId)
    .map(playerId => players[playerId].name).join(', ');
  l();
  l(`${'Players in the room:'.blue.bold} ${playerNames.length ? playerNames : 'none'}`);
};

use(['look', 'l'], renderRoom);
