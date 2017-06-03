import expect from 'expect';

import store from '../store';
import { playerEnters, playerLeaves } from './rooms';

// store.subscribe(() =>
//   console.log('state updated to', store.getState().rooms)
// );

playerEnters(1, 2);
expect(store.getState().rooms[1].players).toEqual([2]);

playerLeaves(1, 2);
expect(store.getState().players).toEqual({});
