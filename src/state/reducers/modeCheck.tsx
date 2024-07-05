interface chatMode {
    isTeam: boolean;
}

type setTeamModeAction = {type: 'SET_TEAM_MODE'} | {type: 'SET_SINGLE_MODE'};

const initialState: chatMode = {
    isTeam: false,
}

const modeCheck = (state: chatMode = initialState, action: setTeamModeAction ): chatMode  => {
    switch (action.type) {
        case 'SET_TEAM_MODE':
            return {...state, isTeam: true};
        case 'SET_SINGLE_MODE':
            return {...state, isTeam: false};
        default:
            return state;
    } 
}

export default modeCheck;