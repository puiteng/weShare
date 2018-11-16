import React, { Component } from "react";
import { connect } from "react-redux";

import styles from "../../styles/commonStyle";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import * as actions from "../../actions/index";
import isEmpty from "../../validation/is_empty";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import Card from "material-kit-react/components/Card/Card";
import CardHeader from "material-kit-react/components/Card/CardHeader";
import CardBody from "material-kit-react/components/Card/CardBody";
import { Button, Toolbar, IconButton } from "@material-ui/core";
import Avatar from "../layout/Avatar/Avatar";
import AvatarCustomizer from "../layout/AvatarCustomizer/AvatarCustomizer";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";

class Profile extends Component {
  state = {
    editableFields: {
      name: {
        isEditing: false,
        value: ""
      },
      avatar: {
        isEditing: false,
        value: ""
      }
    },
    passwordForm: {
      password: "",
      password2: ""
    }
  };

  componentDidMount() {
    if (isEmpty(this.props.friends)) {
      this.props.onLoadFriendList();
    }
  }

  componentWillReceiveProps(nextProps, prevProps) {
    if (
      nextProps.auth &&
      nextProps.auth !== prevProps.auth &&
      this.state.editableFields.name.isEditing
    ) {
      const updatedName = {
        ...this.state.editableFields.name,
        isEditing: false
      };
      const updatedFiels = {
        ...this.state.editableFields,
        name: updatedName
      };
      this.setState({ editableFields: updatedFiels });
    }
  }

  handleEditModeChanged = field => {
    let updated = null;
    if (field === "name") {
      updated = {
        ...this.state.editableFields,
        name: {
          isEditing: true,
          value: this.props.auth.user.name
        }
      };
    } else {
      updated = {
        ...this.state.editableFields,
        avatar: {
          isEditing: true,
          value: this.props.friends.find(friend => friend.isCurrentUser).avatar
        }
      };
    }
    this.setState({ editableFields: updated });
  };
  handleNameChange = event => {
    const { form } = this.state;
    const updatedFields = {
      ...this.state.editableFields,
      name: {
        isEditing: true,
        value: event.target.value
      }
    };
    this.setState({ editableFields: updatedFields });
  };
  onSubmitName = () => {
    this.props.onUpdateName({ name: this.state.editableFields.name.value });
  };
  handleAvatarChange = () => {};
  render() {
    const classes = this.props.classes;
    const userAvatar = this.props.friends
      ? this.props.friends.find(friend => friend.isCurrentUser)
      : null;
    return (
      <div className={classes.section}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={8} md={4}>
              <Card>
                <CardHeader color="primary" className={classes.cardHeader}>
                  <h4>My Profile</h4>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      {this.state.editableFields.name.isEditing ? (
                        <ValidatorForm>
                          <Toolbar className={classes.toolbar}>
                            <TextValidator
                              className={classes.textField}
                              label="Name"
                              onChange={this.handleNameChange}
                              name="name"
                              fullWidth
                              validators={[
                                "required",
                                "minStringLength:3",
                                "maxStringLength:30"
                              ]}
                              errorMessages={[
                                "this field is required",
                                "must be within 3 and 30 characters.",
                                "must be within 3 and 30 characters."
                              ]}
                              value={this.state.editableFields.name.value}
                            />
                            <IconButton onClick={this.onSubmitName}>
                              <DoneIcon />
                            </IconButton>
                          </Toolbar>
                        </ValidatorForm>
                      ) : (
                        <Toolbar className={classes.toolbar}>
                          <div>Name: {this.props.auth.user.name}</div>
                          <IconButton
                            onClick={() => this.handleEditModeChanged("name")}
                          >
                            <EditIcon />
                          </IconButton>
                        </Toolbar>
                      )}
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                      <Toolbar>
                        <div>Email: {this.props.auth.user.email}</div>
                      </Toolbar>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                      {this.state.editableFields.avatar.isEditing ? (
                        <Toolbar className={classes.toolbar}>
                          <AvatarCustomizer
                            avatarSetting={
                              this.state.editableFields.avatar.value
                            }
                            avatarChange={this.handleAvatarChange}
                          />
                          <IconButton>
                            <DoneIcon />
                          </IconButton>
                        </Toolbar>
                      ) : (
                        <Toolbar>
                          <Avatar
                            size="large"
                            backgroundColor={userAvatar.avatar.backgroundColor}
                            colorNumber={userAvatar.avatar.colorNumber}
                          >
                            {userAvatar.avatar.text}
                          </Avatar>
                          <IconButton
                            onClick={() => this.handleEditModeChanged("avatar")}
                          >
                            <EditIcon />
                          </IconButton>
                        </Toolbar>
                      )}
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={8} md={4}>
              <Card>
                <CardHeader color="primary" className={classes.cardHeader}>
                  <h4>Update Password</h4>
                </CardHeader>
                <CardBody>
                  <ValidatorForm>
                    <TextValidator
                      className={classes.textField}
                      label="Password"
                      onChange={this.handleChange}
                      name="password"
                      type="password"
                      fullWidth
                      validators={[
                        "required",
                        "minStringLength:6",
                        "maxStringLength:20"
                      ]}
                      errorMessages={[
                        "this field is required",
                        "must be within 6 and 20 characters.",
                        "must be within 6 and 20 characters."
                      ]}
                      value={this.state.passwordForm.password}
                    />
                    <TextValidator
                      className={classes.textField}
                      label="Confirm Password"
                      onChange={this.handleChange}
                      name="password2"
                      type="password"
                      fullWidth
                      validators={["isPasswordMatch", "required"]}
                      errorMessages={[
                        "password mismatch",
                        "this field is required"
                      ]}
                      value={this.state.passwordForm.password2}
                    />
                    <Toolbar className={classes.toolbar}>
                      <div />
                      <Button>UPDATE</Button>
                    </Toolbar>
                  </ValidatorForm>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    friends: state.friend.friends
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadFriendList: () => dispatch(actions.getFriendList()),
    onUpdateName: data => dispatch(actions.updateName(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Profile));
