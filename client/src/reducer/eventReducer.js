import * as actionTypes from "../actions/actionTypes";

const initialState = {
  events: [],
  currentEvent: {},
  loading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_EVENT:
      return {
        ...state,
        events: state.events.concat(action.payload)
      };
    case actionTypes.DELETE_EVENT:
      const updatedEvents = [...state.events];
      const index = updatedEvents.findIndex(
        event => event._id == action.payload
      );
      updatedEvents.splice(index, 1);
      return {
        ...state,
        events: updatedEvents
      };
    case actionTypes.SET_CURRENT_EVENT:
      return {
        ...state,
        currentEvent: action.payload
      };
    case actionTypes.SET_EVENT_LIST:
      return {
        ...state,
        events: action.payload
      };
    case actionTypes.DELETE_BILL:
      const bills = [...state.currentEvent.bills];
      const billTransactions = [...state.currentEvent.billTransactions];
      const billIndex = bills.findIndex(bill => bill._id == action.payload);
      const billTransactionIndex = billTransactions.findIndex(
        billTransaction => billTransaction.billId == action.payload
      );
      bills.splice(billIndex, 1);
      billTransactions.splice(billTransactionIndex, 1);

      const event = {
        ...state.currentEvent,
        bills: bills,
        billTransactions: billTransactions
      };
      return { ...state, currentEvent: event };
    case actionTypes.LOAD_EVENT_START:
      return {
        ...state,
        loading: true
      };
    case actionTypes.LOAD_EVENT_END:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};

export default reducer;
