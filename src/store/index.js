
import * as React from "react";
import thunk from 'redux-thunk'
import rootReducer from "./reducers"
import storage from 'redux-persist/lib/storage' 
import { createStore,applyMiddleware } from "redux";
import { persistReducer } from "redux-persist";
const middleware = [thunk];
const persistConfig = {
  key: "root",
  storage
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer,  applyMiddleware(...middleware));
export default store

