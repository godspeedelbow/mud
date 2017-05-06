import expect from 'expect';

import store from '../store';
import { playerJoins, playerQuits } from './players';

// store.subscribe(() =>
//   console.log('state updated to', store.getState().players)
// );

playerJoins(store.dispatch)('elbow');

expect(store.getState().players).toEqual({
  0: 'elbow',
});

playerQuits(store.dispatch)(0);
expect(store.getState().players).toEqual({});
