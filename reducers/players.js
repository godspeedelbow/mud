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
          hp: 100,
        },
      });
    case 'PLAYER_DIES':
      return {
        ...state,
        [action.playerId]: {
          ...state[action.playerId],
          roomId: 1,
        },
      };
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
    case 'BURN_WITCH':
      return {
        ...state,
        [action.playerId]: {
          ...state[action.playerId],
          hp: state[action.playerId].hp - action.damage,
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

export const burnWitch = (otherPlayerName, roomId, playerId) => {
  const {
    players,
    players: {
      [playerId]: {
        name,
      },
    },
  } = store.getState();

  let otherPlayerId = Object
    .keys(players)
    .find(id => players[id].name === otherPlayerName);

  // Checks if username is available
  if (!otherPlayerId) {
    return false;
  }
  otherPlayerId = parseInt(otherPlayerId, 10);
  const { [otherPlayerId]: { roomId: otherPlayerRoomId } } = players;
  if (otherPlayerRoomId !== roomId) {
    return false;
  }

  roomEmitter.emit(roomId, `${'F'.red.bold}${'I'.yellow.bold}${'R'.red.bold}${'E'.yellow.bold}${'!! Burn the witch!'.white.bold} ${otherPlayerName.red} ${'is torched by'.red.bold} ${'an agree mob of Edinburghererehrs'.white.bold}`);
  const damage = Math.ceil(Math.random() * 40);
  store.dispatch({
    type: 'BURN_WITCH',
    playerId: otherPlayerId,
    damage,
  });
  const { players: { [otherPlayerId]: { hp } } } = store.getState();

  console.log(`${name.yellow.bold} ${'instigates an angry mob to burn'.white.bold} ${name.red.bold}!`);
  playerEmitter.emit(otherPlayerId, `${'OUCH'.red.bold} ${'That hurt!'.red} ${'You lost'.white} ${damage.toString().red.bold} ${'hp. '.white} ${'New hp:'.yellow.bold} ${`${hp}/100`.white.bold}`);

  if (hp < 0) {
    console.log(`${otherPlayerName.red.bold} ${'is killed by'.white.bold} ${name.yellow.bold}`);
    roomEmitter.emit(roomId, `${otherPlayerName.red.bold} ${'dies at the hands of'.white.bold} ${name.yellow.bold} ${'and a mob of angry Edinburghererehrs'.red.bold}`);
    playerEmitter.emit(otherPlayerId, `${'Your burn wounds are fatal. You scream out your last breath in agony while you curse your fellow Edinburghererehrs.'.red} ${'You are dead.'.red.bold}`);

    store.dispatch({
      type: 'PLAYER_DIES',
      playerId: otherPlayerId,
      roomId,
    });

    roomEmitter.emit(1, `${'FLASH!!'.bold.yellow} ${'Lightning strikes.'.bold.white} ${otherPlayerName.blue.bold} is back in the warm womb of ${'Limbo'.bold.white}`);
  }

  return true;
};
