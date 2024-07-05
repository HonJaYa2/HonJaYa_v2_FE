interface LoginState {
    isLogined: string;
}

type loginAction = {type: 'APPROVE_USER'} | {type: 'DENY_USER'} | {type: 'INIT'};

const initialState: LoginState = {
    isLogined: "INIT",
}

const loginCheck = (state: LoginState = initialState, action: loginAction ): LoginState  => {
    switch (action.type) {
        case 'APPROVE_USER':
            return {...state, isLogined: "Y"};
        case 'DENY_USER':
            return {...state, isLogined: "N"};
        case "INIT":
            return {...state, isLogined: "INIT"};
        default:
            return state;
    } 
}

export default loginCheck;