import omit from 'lodash/omit';

import store from '../store';

import { playerEmitter, roomEmitter } from '../eventEmitters';

// reducer
export default function reducePlayers(state = {}, action) {
  switch (action.type) {
    case 'PLAYER_JOIN':
      return Object.assign({}, state, {
        [action.id]: {
          name: action.name,
        },
      });
    case 'PLAYER_QUIT':
      return omit(state, action.id);
    case 'PLAYER_ENTERS':
      return {
        ...state,
        [action.playerId]: {
          ...state[action.playerId],
          roomId: action.roomId,
        },
      };
    default:
      return state;
  }
}

let playerCount = 0;
export const playerJoins = name => {
  const { players } = store.getState();

  const usernameExists = Object
    .keys(players)
    .map(id => players[id].name)
    .join(',')
    .includes(name);

  // Checks if username is available
  if (usernameExists) {
    return false;
  }
  playerCount++;
  console.log(`${name.green.bold} ${'joined the game'.white.bold}`);
  store.dispatch({
    type: 'PLAYER_JOIN',
    id: playerCount,
    name,
  });
  return playerCount;
};

export const playerQuits = id => {
  const { players: { [id]: player } } = store.getState();
  if (!player) {
    return console.log(`${'a poor soul'.red} ${'leaved the game before even trying it'.white.bold}`);
  }
  const { name, roomId } = player;
  roomEmitter.emit(roomId, `POOOFF! ${name} dissolves into thin air.`.red);
  console.log(`${name.red.bold} ${'leaved the game'.white.bold}`);

  store.dispatch({
    type: 'PLAYER_QUIT',
    id,
  });
};

export const burnWitch = (name, roomId) => {
  const { players } = store.getState();

  const otherPlayerId = Object
    .keys(players)
    .find(id => players[id].name === name);

  // Checks if username is available
  if (!otherPlayerId) {
    return false;
  }

  const { [otherPlayerId]: { roomId: otherPlayerRoomId } } = players;
  if (otherPlayerRoomId !== roomId) {
    return false;
  }

  roomEmitter.emit(roomId, `${'F'.red.bold}${'I'.yellow.bold}${'R'.red.bold}${'E'.yellow.bold}${'!! Burn the witch!'.white.bold} ${name.red} ${'is torched by'.red.bold} ${'an agree mob of Edinburghererehrs'.white.bold}`);
  store.dispatch({
    type: 'BURN_WITCH',
    playerId: otherPlayerId,
  });

  return true;
};
