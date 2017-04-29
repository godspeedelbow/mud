import { createStore } from 'redux';
import omit from 'lodash/omit';

// reducer
function player(state = {}, action) {
  switch (action.type) {
    case 'PLAYER_JOIN':
      return Object.assign({}, state, {
          [action.id]: action.name,
      });
    case 'PLAYER_LEAVE':
      return omit(state, action.id);
    default:
      return state;
  }
}

let playerCount = 0;
export const playerJoins = dispatch => name => {
  dispatch({
      type: 'PLAYER_JOIN',
      id: playerCount++,
      name,
  });
  return playerCount;
}

export const playerLeaves = dispatch => id => {
  dispatch({
      type: 'PLAYER_LEAVE',
      id,
  });
};

export default createStore(player);
