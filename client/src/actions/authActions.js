import * as actionTypes from "./actionTypes";
import axios from "axios";
import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";

export const registerUser = (userData, history) => dispatch => {
  dispatch({ type: actionTypes.CLEAR_ERRORS });
  dispatch({ type: actionTypes.LOADING_START });
  axios
    .post("/api/user/register", userData)
    .then(result => {
      dispatch({ type: actionTypes.LOADING_END });
      history.push("/login");
    })
    .catch(err => {
      dispatch({ type: actionTypes.LOADING_END });
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const loginUser = (userData, history) => dispatch => {
  dispatch({ type: actionTypes.CLEAR_ERRORS });
  dispatch({ type: actionTypes.LOADING_START });
  axios
    .post("/api/user/login", userData)
    .then(result => {
      //save to localStorage
      const { token, userId, expiresIn } = result.data;
      const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
      //set token to localStorage
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("expirationDate", expirationDate);
      //set token to authHeader
      setAuthToken(token);
      //decode token to get user data
      const decoded = jwt_decode(token);
      dispatch({ type: actionTypes.LOADING_END });
      dispatch(setCurrentUser(decoded));
      history.push("/");
    })
    .catch(err => {
      dispatch({ type: actionTypes.LOADING_END });
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const setCurrentUser = decoded => {
  return {
    type: actionTypes.SET_CURRENT_USER,
    payload: decoded
  };
};

export const logOut = () => {
  localStorage.removeItem("jwtTokens");
  localStorage.removeItem("userId");
  localStorage.removeItem("expirationDate");
  setAuthToken();
  return { type: actionTypes.LOGOUT_USER };
};

export const checkAuthTimeOut = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logOut());
    }, expirationTime * 1000);
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      dispatch(logOut());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate < new Date()) {
        dispatch(logOut());
      } else {
        setAuthToken(token);
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded));
        dispatch(
          checkAuthTimeOut(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};

export const updateName = data => {
  return dispatch => {
    dispatch({ type: actionTypes.CLEAR_ERRORS });
    dispatch({ type: actionTypes.LOADING_START });
    const auth = {
      headers: { Authorization: localStorage.getItem("jwtToken") }
    };
    axios
      .post("/api/user/updatename", data, auth)
      .then(result => {
        dispatch({ type: actionTypes.UPDATE_USER_NAME, payload: result.data });
        dispatch({ type: actionTypes.LOADING_END });
      })
      .catch(err => {
        dispatch({ type: actionTypes.LOADING_END });
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data
        });
      });
  };
};
