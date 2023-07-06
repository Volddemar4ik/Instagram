import { createStore, applyMiddleware } from 'redux';
import thunk from "redux-thunk";

import { totalReducer } from "./reducers";

export const store = createStore(totalReducer, applyMiddleware(thunk))
store.subscribe(() => console.log(store.getState()))