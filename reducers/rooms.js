import without from 'lodash/without';

const world = {
  1: {
    name: 'Limbo',
    description: 'You are in void where nothing is everything and everything is nothing.',
    players: [],
  },
};
export default function rooms(state = world, action) {
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

export const playerEnters = dispatch => (roomId, playerId) => {
  dispatch({
      type: 'PLAYER_ENTERS',
      roomId,
      playerId,
  });
};

export const playerLeaves = dispatch => (roomId, playerId) => {
  dispatch({
      type: 'PLAYER_LEAVES',
      roomId,
      playerId,
  });
};
