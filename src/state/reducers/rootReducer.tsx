'use client'

import { combineReducers } from '@reduxjs/toolkit';
import loginCheck from './loginCheck';
import matchingStatusModal from './matchingStatusModal';
import modeCheck from './modeCheck';
import onGroup from './onGroup';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  loginCheck,
  matchingStatusModal,
  modeCheck,
  onGroup,
  auth: authReducer, // auth 리듀서 추가
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
