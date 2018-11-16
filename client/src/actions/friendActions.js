import * as actionTypes from "./actionTypes";
import axios from "axios";

export const getFriendList = () => {
  return dispatch => {
    dispatch({ type: actionTypes.CLEAR_ERRORS });
    dispatch({ type: actionTypes.LOAD_FRIEND_START });
    //todo: should be use default header
    const auth = {
      headers: { Authorization: localStorage.getItem("jwtToken") }
    };
    axios
      .get("/api/friend", auth)
      .then(result => {
        dispatch({ type: actionTypes.LOAD_FRIEND_END });
        dispatch({ type: actionTypes.SET_FRIEND_LIST, payload: result.data });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: actionTypes.LOAD_FRIEND_END });
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data
        });
      });
  };
};

export const addFriend = data => {
  return dispatch => {
    dispatch({ type: actionTypes.CLEAR_ERRORS });
    dispatch({ type: actionTypes.LOAD_FRIEND_START });
    //todo: should be use default header
    const auth = {
      headers: { Authorization: localStorage.getItem("jwtToken") }
    };
    axios
      .post("/api/friend", data, auth)
      .then(res => {
        dispatch({ type: actionTypes.LOAD_FRIEND_END });
        dispatch({ type: actionTypes.ADD_FRIEND, payload: res.data });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: actionTypes.LOAD_FRIEND_END });
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data
        });
      });
  };
};

export const onTryGetFriendList = auth => {
  return dispatch => {
    if (auth && auth.user) {
      return dispatch(getFriendList());
    }
  };
};

export const deleteFriend = id => {
  return dispatch => {
    dispatch({ type: actionTypes.CLEAR_ERRORS });
    dispatch({ type: actionTypes.LOAD_FRIEND_START });
    //todo: should be use default header
    const auth = {
      headers: { Authorization: localStorage.getItem("jwtToken") }
    };
    axios
      .delete(`/api/friend/${id}`, auth)
      .then(res => {
        dispatch(getFriendList());
        dispatch({ type: actionTypes.LOAD_FRIEND_END });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: actionTypes.LOAD_FRIEND_END });
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data
        });
      });
  };
};

/*export const getFriendsByIDs = arr => {
  return dispatch => {
    dispatch({ type: actionTypes.CLEAR_ERRORS });
    dispatch({ type: actionTypes.LOAD_FRIEND_START });
    axios
      .get("/api/friend/multiple", arr)
      .then(res => {
        dispatch({ type: actionTypes.LOAD_FRIEND_END });
        dispatch({ type: actionTypes.GET_FRIENDS_BYIDS, payload: res.data });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: actionTypes.LOAD_FRIEND_END });
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data
        });
      });
  };
};*/
