import * as actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOADING_START:
      return {
        ...state,
        loading: true
      };
    case actionTypes.LOADING_END:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};

export default reducer;
