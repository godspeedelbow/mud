import without from 'lodash/without';
import { EventEmitter } from 'events';

import store from '../store';

export const roomEmitter = new EventEmitter();

const world = {
  1: {
    name: 'Limbo',
    description: 'You are in a void where nothing is everything and everything is nothing.',
    players: [],
    directions: {
      north: 2,
    },
  },
  2: {
    name: 'The Neighboring Room',
    description: 'It worked!',
    players: [],
    directions: {
      south: 1,
      west: 3,
      east: 4,
    },
  },
  3: {
    name: '3rd Room',
    description: 'this is nice',
    players: [],
    directions: {
      east: 2,
    },
  },
  4: {
    name: '4rd Room',
    description: 'this is less nice',
    players: [],
    directions: {
      west: 2,
    },
  },
};
export default function reduceRooms(state = world, action) {
  switch (action.type) {
    case 'PLAYER_ENTERS':
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          players: [...state[action.roomId].players, action.playerId],
        },
      };
    case 'PLAYER_LEAVES':
      return {
        ...state,
        [action.roomId]: {
          ...state[action.roomId],
          players: without(state[action.roomId].players, action.playerId),
        },
      };
    default:
      return state;
  }
}

export const playerEnters = (roomId, playerId) => {
  const { players: { [playerId]: { name } } } = store.getState();

  store.dispatch({
    type: 'PLAYER_ENTERS',
    roomId,
    playerId,
  });
  roomEmitter.emit(roomId, `${'TADA! '.green.bold}${`${name}`.white.bold} ${'appears magically out of thin air.'.green}`);
};

export const playerLeaves = (roomId, playerId) => {
  const { players: { [playerId]: { name } } } = store.getState();

  store.dispatch({
    type: 'PLAYER_LEAVES',
    roomId,
    playerId,
  });
  roomEmitter.emit(roomId, `POOOFF! ${name} dissolves into thin air.`.red);
};

export const playerMoves = (direction, playerId) => {
  const { players, rooms } = store.getState();
  const { [playerId]: { roomId, name } } = players;
  const room = rooms[roomId];

  const newRoomId = room.directions[direction];
  if (!newRoomId) {
    return false;
  }
  store.dispatch({
    type: 'PLAYER_ENTERS',
    roomId: newRoomId,
    playerId,
  });
  roomEmitter.emit(roomId, `${name} walks ${direction}.`);
  roomEmitter.emit(newRoomId, `${name} walks in from the ${oppossite(direction)}.`);
  return newRoomId;
};

function oppossite(direction) {
  const oppossites = {
    north: 'south',
    east: 'west',
    south: 'north',
    west: 'east',
  };
  return oppossites[direction];
}

Object.keys(world).forEach(roomId => roomEmitter.on(roomId, str => console.log(roomId, str)));
