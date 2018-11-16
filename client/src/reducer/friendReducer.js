import * as actionTypes from "../actions/actionTypes";

const initialState = {
  friends: [],
  loading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_FRIEND_LIST:
      return {
        ...state,
        friends: action.payload
      };
    case actionTypes.ADD_FRIEND:
      console.log(state.friends);
      console.log(action.payload);
      return {
        ...state,
        friends: state.friends.concat(action.payload)
      };
    case actionTypes.LOAD_FRIEND_START:
      return {
        ...state,
        loading: true
      };
    case actionTypes.LOAD_FRIEND_END:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};

export default reducer;
