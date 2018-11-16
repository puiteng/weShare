import * as actionTypes from "../actions/actionTypes";
import isEmpty from "../validation/is_empty";

const initialState = {
  isAuthenticated: false,
  user: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case actionTypes.UPDATE_USER_NAME:
      const updatedUser = { ...state.user, name: action.payload };
      return {
        ...state,
        user: updatedUser
      };
    case actionTypes.LOGOUT_USER:
      return {
        ...state,
        isAuthenticated: false,
        user: {}
      };
    default:
      return state;
  }
};

export default reducer;
