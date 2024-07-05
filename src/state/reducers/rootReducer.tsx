'use client'

import { combineReducers } from '@reduxjs/toolkit';
import loginCheck from './loginCheck';
import matchingStatusModal from './matchingStatusModal';
import modeCheck from './modeCheck';
import onGroup from './onGroup';
import profileCheck from './ProfileCheck';

const rootReducer = combineReducers({
  loginCheck,
  matchingStatusModal,
  modeCheck,
  onGroup,
  profileCheck
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
