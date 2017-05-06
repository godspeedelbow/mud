import { createStore, combineReducers } from 'redux';

import players from './reducers/players';
import rooms from './reducers/rooms';

const reducers = combineReducers({ players, rooms });
export default createStore(reducers);
