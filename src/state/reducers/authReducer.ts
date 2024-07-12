import { APPROVE_USER, LOGOUT_USER } from '../actions';

const initialState = {
  isAuthenticated: false,
};

const authReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case APPROVE_USER:
      return {
        ...state,
        isAuthenticated: true,
      };
    case LOGOUT_USER:
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default authReducer;
