import omit from 'lodash/omit';

import store from '../store';

// reducer
export default function players(state = {}, action) {
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

  //Checks if username is available
  if(!Object.keys(players).map(id => players[id].name).join(',').includes(name)) {
      playerCount++;
      store.dispatch({
          type: 'PLAYER_JOIN',
          id: playerCount,
          name,
      });
      return playerCount;
  } else {
      console.log("username taken");
      return false;
  }
};

export const playerQuits = id => {
  store.dispatch({
    type: 'PLAYER_QUIT',
    id,
  });
};
