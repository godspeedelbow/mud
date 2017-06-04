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
    name: 'Caved in corridor',
    description: 'So old the roof fell in, noone gets through here',
    players: [],
    directions: {
      east: 2,
    },
  },
  4: {
    name: 'Intersection',
    description: '',
    players: [],
    directions: {
      west: 2,
      north: 6,
      east: 5,
    },
  },
  5: {
    name: 'Hallway',
    description: 'Cobwebs gallore!',
    players: [],
    directions: {
      west: 4,
      east: 7,
    },
  },
  6: {
    name: 'old storage room', // looty place?
    description: 'Something smells funny in here',
    players: [],
    directions: {
      south: 4,
    },
  },
  7: {
    name: 'dimly lit intersection',
    description: 'How did i even get here?',
    players: [],
    directions: {
      west: 5,
      north: 8,
      east: 9,
    },
  },
  8: {
    name: 'dark corridor',
    description: 'Hey, who turned out the lights?',
    players: [],
    directions: {
      north: 11,
      south: 7,
    },
  },
  9: {
    name: 'Small crack in the wall',
    description: 'Why did i even go here?',
    players: [],
    directions: {
      west: 7,
      south: 10,
    },
  },
  10: {
    name: 'Lost laboratory', // Looty?
    description: 'Whatever was going on here, it was probably illegal',
    players: [],
    directions: {
      north: 9,
    },
  },
  11: {
    name: '4-way intersection',
    description: 'Someone, or something walks past here frequently',
    players: [],
    directions: {
      north: 12,
      west: 13,
      south: 8,
      east: 14,
    },
  },
  12: {
    name: 'Corner',
    description: 'The only way forward is to the west',
    players: [],
    directions: {
      west: 15,
      south: 11,
      east: 7,
    },
  },
  13: {
    name: 'Storage room',
    description: 'a long time ago some of this stuff probably was edible',
    players: [],
    directions: {
      west: 17,
      east: 11,
    },
  },
  14: {
    name: 'Collapsed Roof',
    description: 'The roof has fallen in here',
    players: [],
    directions: {
      west: 11,
    },
  },
  15: {
    name: 'Pitch black hallway',
    description: 'You cant see anything here',
    players: [],
    directions: {
      west: 16,
      east: 12,
    },
  },
  16: {
    name: 'Camp', // safe area?
    description: 'Something about this place feels like home',
    players: [],
    directions: {
      north: 18,
      west: 19,
      south: 17,
      east: 15,
    },
  },
  17: {
    name: 'Empty room',
    description: 'The only thing in here is dust',
    players: [],
    directions: {
      north: 16,
      east: 13,
    },
  },
  18: {
    name: 'Bottomless pit',
    description: 'This place has no floor, and seemingly no bottom either. Better watch your step!',
    players: [],
    directions: {
      south: 16,
    },
  },
  19: {
    name: 'Dank corridor',
    description: 'you can hear water running here',
    players: [],
    directions: {
      west: 20,
      east: 16,
    },
  },
  20: {
    name: 'Chilly intersection',
    description: 'Its cold here',
    players: [],
    directions: {
      north: 21,
      south: 22,
      east: 19,
    },
  },
  21: {
    name: 'Strange hallway',
    description: 'Something about this hallway feels wrong',
    players: [],
    directions: {
      north: 4,
      south: 20,
    },
  },
  22: {
    name: 'Doorway',
    description: 'The door to the south sure looks like it has trouble on the other side',
    players: [],
    directions: {
      north: 20,
      west: 23,
      south: 24,
    },
  },
  23: {
    name: 'Vault',  // Looty for sure
    description: 'Someone have been polishing the stuff in here',
    players: [],
    directions: {
      east: 22,
    },
  },
  24: {
    name: 'Boss room', // LOOTZ!
    description: 'There should be a boss here, IF WE HAD ONE',
    players: [],
    directions: {
      north: 22,
      south: 25,
    },
  },
  25: {
    name: 'Stairs',
    description: 'Yeah, like we are gonna do a second level...',
    players: [],
    directions: {
      west: 2,
      down: 26,
    },
  },
  26: {
    name: 'candyland',
    description: 'the walls are made out of candy, ants sure must be a problem here',
    players: [],
    directions: {
      up: 25,
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
