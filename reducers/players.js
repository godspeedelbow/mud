import omit from 'lodash/omit';

// reducer
export default function players(state = {}, action) {
  switch (action.type) {
    case 'PLAYER_JOIN':
      return Object.assign({}, state, {
          [action.id]: action.name,
      });
    case 'PLAYER_QUIT':
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

export const playerQuits = dispatch => id => {
  dispatch({
      type: 'PLAYER_QUIT',
      id,
  });
};
