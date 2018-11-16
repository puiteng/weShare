import * as actionTypes from "./actionTypes";
import axios from "axios";

export const addBill = (data, history) => {
  return dispatch => {
    dispatch({ type: actionTypes.CLEAR_ERRORS });
    dispatch({ type: actionTypes.LOADING_START });
    //todo: should be use default header
    const auth = {
      headers: { Authorization: localStorage.getItem("jwtToken") }
    };
    axios
      .post("/api/bill", data, auth)
      .then(res => {
        dispatch({ type: actionTypes.LOADING_END });
        history.push("/event/" + res.data.event);
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: actionTypes.LOADING_END });
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data
        });
      });
  };
};

export const editBill = (id, data, history) => {
  return dispatch => {
    dispatch({ type: actionTypes.CLEAR_ERRORS });
    dispatch({ type: actionTypes.LOADING_START });
    //todo: should be use default header
    const auth = {
      headers: { Authorization: localStorage.getItem("jwtToken") }
    };
    axios
      .post("/api/bill/" + id, data, auth)
      .then(res => {
        dispatch({ type: actionTypes.LOADING_END });
        history.push("/event/" + res.data.event);
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: actionTypes.LOADING_END });
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data
        });
      });
  };
};

export const getBill = id => {
  return dispatch => {
    dispatch({ type: actionTypes.CLEAR_ERRORS });
    dispatch({ type: actionTypes.LOADING_START });
    axios
      .get("/api/bill/" + id)
      .then(res => {
        dispatch({ type: actionTypes.LOADING_END });
        dispatch({ type: actionTypes.SET_CURRENT_BILL, payload: res.data });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: actionTypes.LOADING_END });
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data
        });
      });
  };
};

export const getBillsByEvent = event => {
  return dispatch => {
    dispatch({ type: actionTypes.CLEAR_ERRORS });
    dispatch({ type: actionTypes.LOADING_START });
    axios
      .get("/api/bill/byevent/" + event)
      .then(bills => {
        const result = [];
        const friends = [];
        bills.forEach(bill => {
          let total = 0;
          const sharedByFriends = bills.sharedBy.map(x => x.friendId);
          const paidByFriends = bills.paidBy.map(x => x.friendId);
          const friendIds = sharedByFriends.concat(paidByFriends);
          bill.items.forEach(
            item => (total = total + item.amount * item.quantity)
          );
          friendIds.forEach(x => {
            let amount = 0;
            const paid = bills.paidBy.find(p => p.friendId == x);
            const shared = bills.sharedBy.find(p => p.friendId == x);
            if (paid) {
              if (paid.percentage) {
                amount = amount + total * paid.percentage;
              } else {
                amount = amount + paid.actualAmount;
              }
            }
            if (shared) {
              if (shared.percentage) {
                amount = amount - total * shared.percentage;
              } else {
                amount = amount - shared.actualAmount;
              }
            }
            friends.push({ friendId: x, amount: amount });
          });
        });
        dispatch({ type: actionTypes.LOADING_END });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: actionTypes.LOADING_END });
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data
        });
      });
  };
};

export const deleteBill = id => {
  return dispatch => {
    dispatch({ type: actionTypes.CLEAR_ERRORS });
    dispatch({ type: actionTypes.LOADING_START });
    //todo: should be use default header
    const auth = {
      headers: { Authorization: localStorage.getItem("jwtToken") }
    };
    axios
      .delete(`/api/bill/${id}`, auth)
      .then(res => {
        dispatch({ type: actionTypes.DELETE_BILL, payload: id });
        dispatch({ type: actionTypes.LOADING_END });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: actionTypes.LOADING_END });
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data
        });
      });
  };
};
