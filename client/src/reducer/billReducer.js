import * as actionTypes from "../actions/actionTypes";

const initialState = {
  currentBill: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_BILL:
      return {
        ...state,
        currentBill: action.payload
      };
    default:
      return state;
  }
};

export default reducer;
