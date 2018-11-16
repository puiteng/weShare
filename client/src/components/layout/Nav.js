import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import withStyles from "@material-ui/core/styles/withStyles";
import Header from "material-kit-react/components/Header/Header";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "material-kit-react/components/CustomButtons/Button";
import navbarsStyle from "material-kit-react/assets/jss/material-kit-react/views/componentsSections/navbarsStyle.js";

const Nav = props => {
  const classes = props.classes;
  const handleRedirect = link => {
    props.history.push(link);
  };
  let rightLinks = (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Button
          className={classes.navLink + " " + classes.navLinkActive}
          color="transparent"
          onClick={() => handleRedirect("/login")}
        >
          Login
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          className={classes.navLink}
          onClick={() => handleRedirect("/register")}
          color="transparent"
        >
          Sign Up
        </Button>
      </ListItem>
    </List>
  );
  if (props.isAuthenticated) {
    rightLinks = (
      <List className={classes.list}>
        <ListItem className={classes.listItem}>
          <Button
            className={classes.navLink + " " + classes.navLinkActive}
            onClick={() => handleRedirect("/")}
            color="transparent"
          >
            Dashboard
          </Button>
        </ListItem>
        <ListItem className={classes.listItem}>
          <Button
            className={classes.navLink}
            onClick={() => handleRedirect("/profile")}
            color="transparent"
          >
            Profile
          </Button>
        </ListItem>
        <ListItem className={classes.listItem}>
          <Button
            className={classes.navLink}
            onClick={props.onLogout}
            color="transparent"
          >
            Logout
          </Button>
        </ListItem>
      </List>
    );
  }
  return <Header brand="WeShare" color="info" rightLinks={rightLinks} />;
};

Nav.propTypes = {
  classes: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default withRouter(withStyles(navbarsStyle)(Nav));
