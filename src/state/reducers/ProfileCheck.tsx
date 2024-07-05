interface ProfileState {
    profileSet: boolean;
}

type profileAction = {type: 'SET_PROFILE'} 

const initialState: ProfileState = {
    profileSet: false,
}

const profileCheck = (state: ProfileState = initialState, action: profileAction ): ProfileState  => {
    switch (action.type) {
        case 'SET_PROFILE':
            return {...state, profileSet: true};
        default:
            return state;
    } 
}

export default profileCheck;