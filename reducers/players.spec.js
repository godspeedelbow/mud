import expect from 'expect';

import store from '../store';
import { playerJoins, playerQuits } from './players';

// store.subscribe(() =>
//   console.log('state updated to', store.getState().players)
// );

playerJoins('elbow');

expect(store.getState().players).toEqual({
  0: 'elbow',
});

playerQuits(0);
expect(store.getState().players).toEqual({});
