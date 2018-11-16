import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import progressReducer from "./progressReducer";
import friendReducer from "./friendReducer";
import eventReducer from "./eventReducer";
import billReducer from "./billReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  progress: progressReducer,
  friend: friendReducer,
  event: eventReducer,
  bill: billReducer
});
