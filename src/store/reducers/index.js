import React from 'react';
import { combineReducers } from "redux";
import authReducer from "../reducers/authReducer";
import auxReducer from "../reducers/auxReducer";
const rootReducer = combineReducers({
  authStorage: authReducer,
  auxStorage:auxReducer

});
export default rootReducer;
