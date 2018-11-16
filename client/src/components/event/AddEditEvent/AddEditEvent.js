import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, matchPath } from "react-router-dom";

import styles from "./AddEditEventStyle";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import Card from "material-kit-react/components/Card/Card";
import CardHeader from "material-kit-react/components/Card/CardHeader";
import CardBody from "material-kit-react/components/Card/CardBody";
import { Button, Toolbar, IconButton, LinearProgress } from "@material-ui/core";
import BackIcon from "@material-ui/icons/KeyboardBackspace";

import Friends from "./EventFriends/EventFriends";
import * as actions from "../../../actions/index";
import isEmpty from "../../../validation/is_empty";

class AddEditEvent extends Component {
  state = {
    form: {
      name: "",
      startDate: new Date(),
      endDate: new Date(),
      friends: [],
      friendIDs: []
    },
    isAddingFriend: false,
    friends: [],
    isAdd: true,
    editingEvent: null,
    error: null
  };

  componentDidMount() {
    ValidatorForm.addValidationRule("isStartDateLaterThanEndDate", value => {
      if (this.state.form.endDate < this.state.form.startDate) {
        return false;
      }
      return true;
    });
    if (isEmpty(this.props.fullFriendList)) {
      this.props.onLoadFriendList();
    } else {
      const currentUser = this.props.fullFriendList.find(
        friend => friend.isCurrentUser
      );
      const newForm = {
        name: "",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        friends: [currentUser]
      };
      this.setState({ form: newForm });
    }
    const match = matchPath(this.props.location.pathname, {
      path: "/AddEvent"
    });
    if (match === null) {
      if (isEmpty(this.props.currentEvent)) {
        //todo error handle
        this.props.history.push("/");
      } else {
        this.bindEvent(this.props.currentEvent);
      }
    }
    this.setState({ isAdd: match !== null });
  }

  bindEvent = event => {
    const newForm = {
      name: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      friends: event.friends
    };
    this.setState({ editingEvent: event, form: newForm });
  };

  handleChange = event => {
    const { form } = this.state;
    if (event.target.name === "startDate" || event.target.name === "endDate") {
      form[event.target.name] = new Date(event.target.value).toISOString();
    } else {
      form[event.target.name] = event.target.value;
    }
    this.setState({ form });
  };

  importFriendHandler = checked => {
    const newForm = {
      ...this.state.form,
      friends: checked
    };
    this.setState({ form: newForm });
  };

  openDialogHandler = () => {
    this.setState({ isAddingFriend: true });
  };

  closeDialogHandler = () => {
    this.setState({ isAddingFriend: false });
  };

  EditFriendHandler = () => {
    this.setState({ isAddingFriend: false });
  };

  handleToggle = value => () => {
    const { friends } = this.state.form;
    const friendIDs = friends.map(friend => friend._id);
    const currentIndex = friendIDs.indexOf(value._id);
    const newFriends = [...friends];

    if (currentIndex === -1) {
      newFriends.push(value);
    } else {
      newFriends.splice(currentIndex, 1);
    }

    const newForm = {
      ...this.state.form,
      friends: newFriends
    };
    this.setState({
      form: newForm
    });
  };

  isValidEvent = event => {
    if (this.state.isAdd) {
      if (!event.friends || event.friends.length == 0) {
        this.setState({
          error: "An event must contain at least one friend."
        });
        return false;
      }
      this.setState({
        error: null
      });
    }
    return true;
  };

  submitHandler = () => {
    if (!this.isValidEvent(this.state.form)) {
      return;
    }
    const newEvent = {
      name: this.state.form.name,
      startDate: this.state.form.startDate,
      endDate: this.state.form.endDate,
      friends: this.state.form.friends
    };
    if (this.state.isAdd) {
      this.props.onAddEvent(newEvent, this.props.history);
    } else {
      this.props.onEditEvent(
        this.state.editingEvent._id,
        newEvent,
        this.props.history
      );
    }
  };

  render() {
    const classes = this.props.classes;
    if (this.props.loading) {
      return <LinearProgress />;
    } else {
      const friendIds = this.state.form.friends.map(friend => friend._id);
      let errorContent = null;
      if (this.state.error) {
        errorContent = <div className={classes.error}>{this.state.error}</div>;
      } else if (this.props.errors) {
        errorContent = Object.keys(this.props.errors).map(function(key, index) {
          return <div className={classes.error}>{this.props.errors[key]} </div>;
        }, this);
      }

      return (
        <div className={classes.section}>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={8}>
                <Card>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>{this.state.isAdd ? "Create Event" : "Edit Event"}</h4>
                  </CardHeader>
                  <CardBody>
                    <GridContainer justify="center">
                      <GridItem xs={12} sm={12} md={11}>
                        <ValidatorForm
                          className={classes.container}
                          onSubmit={this.submitHandler}
                        >
                          <GridContainer justify="center">
                            <GridItem xs={12} sm={12} md={12}>
                              <Toolbar className={classes.toolbar}>
                                {this.state.isAdd ? (
                                  <div />
                                ) : (
                                  <IconButton
                                    onClick={this.props.history.goBack}
                                  >
                                    <BackIcon />
                                  </IconButton>
                                )}
                                {errorContent}
                                <Button variant="text" type="submit">
                                  Submit
                                </Button>
                              </Toolbar>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12}>
                              <TextValidator
                                className={classes.textField}
                                label="Name"
                                name="name"
                                fullWidth
                                validators={[
                                  "required",
                                  "minStringLength:3",
                                  "maxStringLength:200"
                                ]}
                                errorMessages={[
                                  "this field is required",
                                  "must be within 3 and 200 characters.",
                                  "must be within 3 and 200 characters."
                                ]}
                                value={this.state.form.name}
                                onChange={this.handleChange}
                              />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                              <TextValidator
                                className={classes.textField}
                                label="Start Date"
                                name="startDate"
                                type="date"
                                fullWidth
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                                value={this.state.form.startDate
                                  .toString()
                                  .substring(0, 10)}
                                onChange={this.handleChange}
                              />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                              <TextValidator
                                className={classes.textField}
                                label="End Date"
                                name="endDate"
                                type="date"
                                fullWidth
                                validators={[
                                  "required",
                                  "isStartDateLaterThanEndDate"
                                ]}
                                errorMessages={[
                                  "this field is required",
                                  "End Date must be later than Start Date"
                                ]}
                                value={this.state.form.endDate
                                  .toString()
                                  .substring(0, 10)}
                                onChange={this.handleChange}
                              />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12}>
                              <Friends
                                fullFriendList={this.props.fullFriendList}
                                isAddingFriend={this.state.isAddingFriend}
                                friendIDs={friendIds}
                                friends={this.state.form.friends}
                                closeDialogHandler={this.closeDialogHandler}
                                openDialogHandler={this.openDialogHandler}
                                handleToggle={this.handleToggle}
                                EditFriendHandler={this.EditFriendHandler}
                                bills={
                                  this.state.editingEvent
                                    ? this.state.editingEvent.bills
                                    : null
                                }
                              />
                            </GridItem>
                          </GridContainer>
                        </ValidatorForm>
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      );
    }
  }
}

AddEditEvent.propTypes = {
  classes: PropTypes.object.isRequired,
  fullFriendList: PropTypes.array.isRequired,
  onAddEvent: PropTypes.func.isRequired,
  onLoadFriendList: PropTypes.func.isRequired,
  currentEvent: PropTypes.object
};

const mapStateToProps = state => {
  return {
    fullFriendList: state.friend.friends,
    currentEvent: state.event.currentEvent,
    errors: state.errors,
    loading: state.friend.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddEvent: (data, history) => dispatch(actions.addEvent(data, history)),
    onEditEvent: (id, data, history) =>
      dispatch(actions.editEvent(id, data, history)),
    onLoadFriendList: () => dispatch(actions.getFriendList())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(AddEditEvent)));
