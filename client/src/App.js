import React, { Component } from "react";
import { Route, withRouter, Switch } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "./actions/index";
import asyncComponent from "./components/hoc/asyncComponent";
import PrivateRoute from "./components/common/PrivateRoute";

import Nav from "./components/layout/Nav";

const asyncRegister = asyncComponent(() => {
  return import("./components/auth/Register/Register");
});
const asyncLogin = asyncComponent(() => {
  return import("./components/auth/Login/Login");
});
const asyncAddEvent = asyncComponent(() => {
  return import("./components/event/AddEditEvent/AddEditEvent");
});
const asyncEvent = asyncComponent(() => {
  return import("./components/event/Event");
});
const asyncCreateBill = asyncComponent(() => {
  return import("./components/CreateBill/CreateBill");
});
const asyncDashboard = asyncComponent(() => {
  return import("./components/dashboard/Dashboard");
});

const asyncProfile = asyncComponent(() => {
  return import("./components/profile/Profile");
});

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignIn();
  }

  render() {
    return (
      <div>
        <Nav
          isAuthenticated={this.props.auth.isAuthenticated}
          onLogout={this.props.onLogout}
        />
        <Route path="/register" exact component={asyncRegister} />
        <Route path="/login" exact component={asyncLogin} />
        <Switch>
          <PrivateRoute exact path="/" exact component={asyncDashboard} />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/profile" exact component={asyncProfile} />
        </Switch>
        <Switch>
          <PrivateRoute path="/AddEvent" exact component={asyncAddEvent} />
        </Switch>
        <Switch>
          <PrivateRoute path="/EditEvent" exact component={asyncAddEvent} />
        </Switch>
        <Switch>
          <PrivateRoute path="/Event/:id" exact component={asyncEvent} />
        </Switch>
        <Switch>
          <PrivateRoute path="/AddBill/:id" exact component={asyncCreateBill} />
        </Switch>
        <Switch>
          <PrivateRoute
            path="/EditBill/:id"
            exact
            component={asyncCreateBill}
          />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { auth: state.auth, friend: state.friend };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignIn: () => dispatch(actions.authCheckState()),
    onLogout: () => dispatch(actions.logOut())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
