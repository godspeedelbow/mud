import expect from 'expect';

import store, { playerJoins, playerLeaves } from './store';

store.subscribe(() =>
  console.log('state updated to', store.getState())
)

playerJoins(store.dispatch)('elbow');

expect(store.getState()).toEqual({
  0: 'elbow',
});

playerLeaves(store.dispatch)(0);
expect(store.getState()).toEqual({});
