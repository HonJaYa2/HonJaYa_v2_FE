'use client'

export const APPROVE_USER = 'APPROVE_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

export const approve = () => ({
    type: APPROVE_USER,
});

export const deny = () => ({
    type: 'DENY_USER',
});

export const init = () => ({
    type: 'INIT',
});

export const setTeamMode = () => ({
    type: 'SET_TEAM_MODE',
});

export const setSingleMode = () => ({
    type: 'SET_SINGLE_MODE',
});

export const setMatchingModalOpen = () => ({
    type: 'SHOW_MODAL',
});

export const setMatchingModalClose = () => ({
    type: 'CLOSE_MODAL',
});

export const joinGroup = () => ({
    type: 'JOIN_GROUP',
});

export const exitGroup = () => ({
    type: 'EXIT_GROUP',
});

export const logout = () => ({
    type: LOGOUT_USER,
});
