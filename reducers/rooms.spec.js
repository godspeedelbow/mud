import expect from 'expect';

import store from '../store';
import { playerEnters, playerLeaves } from './rooms';

// store.subscribe(() =>
//   console.log('state updated to', store.getState().rooms)
// );

const roomId = 1;
const playerId = 2;

playerEnters(roomId, playerId);
expect(store.getState().rooms[roomId].players).toEqual([playerId]);

playerLeaves(roomId, playerId);
expect(store.getState().rooms[roomId].players).toEqual([]);
