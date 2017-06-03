import expect from 'expect';

import store from '../store';
import { playerJoins, playerQuits } from './players';

// store.subscribe(() =>
//   console.log('state updated to', store.getState().players)
// );

const playerId = playerJoins('elbow');

expect(store.getState().players).toEqual({
  [playerId]: {
    name: 'elbow',
  },
});

playerQuits(playerId);
expect(store.getState().players).toEqual({});
