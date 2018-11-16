import * as actionTypes from "./actionTypes";
import axios from "axios";

export const addEvent = (data, history) => {
  return dispatch => {
    dispatch({ type: actionTypes.CLEAR_ERRORS });
    dispatch({ type: actionTypes.LOAD_EVENT_START });
    //todo: should be use default header
    const auth = {
      headers: { Authorization: localStorage.getItem("jwtToken") }
    };
    axios
      .post("/api/event", data, auth)
      .then(res => {
        history.push("/event/" + res.data._id);
        dispatch({ type: actionTypes.LOAD_EVENT_END });
        dispatch({ type: actionTypes.ADD_EVENT, payload: res.data });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: actionTypes.LOAD_EVENT_END });
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data
        });
      });
  };
};

export const editEvent = (id, data, history) => {
  return dispatch => {
    dispatch({ type: actionTypes.CLEAR_ERRORS });
    dispatch({ type: actionTypes.LOAD_EVENT_START });
    //todo: should be use default header
    const auth = {
      headers: { Authorization: localStorage.getItem("jwtToken") }
    };
    axios
      .post("/api/event/" + id, data, auth)
      .then(res => {
        history.push("/event/" + res.data._id);
        dispatch({ type: actionTypes.LOAD_EVENT_END });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: actionTypes.LOAD_EVENT_END });
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data
        });
      });
  };
};

export const getEventByUser = () => {
  return dispatch => {
    dispatch({ type: actionTypes.CLEAR_ERRORS });
    dispatch({ type: actionTypes.LOAD_EVENT_START });
    //todo: should be use default header
    const auth = {
      headers: { Authorization: localStorage.getItem("jwtToken") }
    };
    axios
      .get("/api/event/", auth)
      .then(res => {
        dispatch({ type: actionTypes.LOAD_EVENT_END });
        dispatch({ type: actionTypes.SET_EVENT_LIST, payload: res.data });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: actionTypes.LOAD_EVENT_END });
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data
        });
      });
  };
};

export const getEvent = id => {
  return dispatch => {
    dispatch({ type: actionTypes.CLEAR_ERRORS });
    dispatch({ type: actionTypes.LOAD_EVENT_START });
    //todo: should be use default header
    const auth = {
      headers: { Authorization: localStorage.getItem("jwtToken") }
    };
    axios
      .get(`/api/event/${id}`, auth)
      .then(res => {
        const result = {
          ...res.data,
          billTransactions: computeTransaction(res.data.bills)
        };
        dispatch({ type: actionTypes.LOAD_EVENT_END });
        dispatch({ type: actionTypes.SET_CURRENT_EVENT, payload: result });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: actionTypes.LOAD_EVENT_END });
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data
        });
      });
  };
};

export const setCurrentEvent = event => {
  return dispatch => {
    dispatch({ type: actionTypes.CLEAR_ERRORS });
    dispatch({ type: actionTypes.SET_CURRENT_EVENT, payload: event });
  };
};

export const computeTransaction = bills => {
  const result = [];
  bills.forEach(bill => {
    const transactions = [];
    let total = 0;
    const sharedByFriends = bill.sharedBy.map(x => x.friend);
    const paidByFriends = bill.paidBy.map(x => x.friend);
    let friends = sharedByFriends.slice();
    paidByFriends.forEach(item => {
      if (!friends.find(x => x._id == item._id)) {
        friends.push(item);
      }
    });
    bill.items.forEach(item =>
      (total = Number(total + item.amount * item.quantity)).toFixed(2)
    );
    friends.forEach(x => {
      let amount = 0;
      const paid = bill.paidBy.find(p => p.friend._id == x._id);
      const shared = bill.sharedBy.find(p => p.friend._id == x._id);
      if (paid) {
        if (paid.percentage) {
          amount = Number(
            (amount + (total * paid.percentage) / 100).toFixed(2)
          );
        } else {
          amount = Number((amount + paid.actualAmount).toFixed(2));
        }
      }
      if (shared) {
        if (shared.percentage) {
          amount = Number(
            (amount - (total * shared.percentage) / 100).toFixed(2)
          );
        } else {
          amount = Number((amount - shared.actualAmount).toFixed(2));
        }
      }
      transactions.push({ friend: x, amount: amount });
    });
    transactions.sort((a, b) => {
      if (a.amount > b.amount) return -1;
      if (a.amount < b.amount) return 1;
      return 0;
    });
    result.push({
      billId: bill._id,
      description: bill.description,
      items: bill.items,
      totalAmount: total,
      transactions: transactions
    });
  });
  console.log(result);
  return result;
};

export const deleteEvent = id => {
  return dispatch => {
    dispatch({ type: actionTypes.CLEAR_ERRORS });
    dispatch({ type: actionTypes.LOAD_EVENT_START });
    //todo: should be use default header
    const auth = {
      headers: { Authorization: localStorage.getItem("jwtToken") }
    };
    axios
      .delete(`/api/event/${id}`, auth)
      .then(res => {
        dispatch({ type: actionTypes.DELETE_EVENT, payload: id });
        dispatch({ type: actionTypes.LOAD_EVENT_END });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: actionTypes.LOAD_EVENT_END });
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data
        });
      });
  };
};
