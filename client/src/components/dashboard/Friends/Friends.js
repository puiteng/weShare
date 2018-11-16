import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../../actions/index";
import * as avatarUtil from "../../../utils/avatar";

import AddFriend from "./AddFriend";
import Avatar from "../../layout/Avatar/Avatar";
import Dialog from "../../layout/Dialog/Dialog";

import friendStyle from "./FriendsStyle";

import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import Card from "material-kit-react/components/Card/Card";
import CardHeader from "material-kit-react/components/Card/CardHeader";
import CardBody from "material-kit-react/components/Card/CardBody";

import {
  Button,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  LinearProgress
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import isEmpty from "../../../validation/is_empty";

class Friends extends Component {
  constructor() {
    super();

    this.state = {
      friends: [],
      isAddingFriend: false,
      displayDeleteConfirmation: false,
      selectedFriendId: null,
      form: {
        name: "",
        email: "",
        isCurrentUser: false,
        avatar: {
          backgroundColor: avatarUtil.generateRandomColor(),
          colorNumber: avatarUtil.generateRandomNumber(),
          text: avatarUtil.generateAvatarDisplayText("")
        }
      }
    };
  }
  componentDidMount() {
    if (isEmpty(this.props.friends)) {
      this.props.onLoadFriendList();
    }
  }
  /*componentWillReceiveProps(nextProps) {
    if (nextProps.friend.friends) {
      this.setState({ friends: nextProps.friend.friends });
      const newAvatar = {
        ...this.state.form.avatar,
        backgroundColor: avatarUtil.generateRandomColor(
          nextProps.friend.friends
        )
      };
      const newForm = {
        ...this.state.form,
        avatar: newAvatar
      };
      this.setState({ form: newForm });
    }
  }*/

  openDialogHandler = () => {
    this.setState({ isAddingFriend: true });
  };

  closeDialogHandler = () => {
    this.setState({ isAddingFriend: false });
  };

  deleteFriendHandler = friend => {
    this.setState({
      selectedFriendId: friend._id,
      displayDeleteConfirmation: true
    });
  };

  addNewFriendHandler = {
    handleAvatarChange: event => {
      const newAvatar = {
        ...this.state.form.avatar,
        [event.target.name]: event.target.value
      };
      const newForm = {
        ...this.state.form,
        avatar: newAvatar
      };
      this.setState({ form: newForm });
    },
    handleChange: event => {
      const existingLetters = this.props.friends.map(
        friend => friend.avatar.text
      );
      let newAvatar = this.state.form.avatar;
      if (event.target.name === "name") {
        newAvatar = {
          ...this.state.form.avatar,
          text: avatarUtil.generateAvatarDisplayText(
            event.target.value,
            existingLetters
          )
        };
      }
      const newForm = {
        ...this.state.form,
        [event.target.name]: event.target.value,
        avatar: newAvatar
      };
      this.setState({ form: newForm });
    },
    handleSubmit: event => {
      event.preventDefault();
      const avatars = this.props.friends.map(friend => friend.avatar);
      const isDuplicated = avatarUtil.checkDuplicateAvatar(
        avatars,
        this.state.form.avatar
      );
      if (isDuplicated) {
        return;
      }
      const newFriend = {
        name: this.state.form.name,
        email: this.state.form.email,
        isCurrentUser: this.state.form.isCurrentUser,
        backgroundColor: this.state.form.avatar.backgroundColor,
        colorNumber: this.state.form.avatar.colorNumber.toString(),
        text: this.state.form.avatar.text
      };
      this.props.onAddFriend(newFriend);
      this.setState({
        form: {
          name: "",
          email: "",
          isCurrentUser: false,
          avatar: {
            backgroundColor: avatarUtil.generateRandomColor(),
            colorNumber: avatarUtil.generateRandomNumber(),
            text: avatarUtil.generateAvatarDisplayText("")
          }
        }
      });
      this.closeDialogHandler();
    }
  };

  closeDeleteConfirmation = () => {
    this.setState({ displayDeleteConfirmation: false, selectedFriendId: null });
  };

  confirmDeleteFriend = () => {
    const friend = this.props.friends.find(
      i => i._id == this.state.selectedFriendId
    );
    if (friend.isCurrentUser) {
      return;
    }
    this.props.onDeleteFriend(friend._id);
    this.closeDeleteConfirmation();
  };

  render() {
    const { classes } = this.props;
    if (this.props.loading) {
      return (
        <div className={classes.section}>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={8}>
                <Card>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>Friends</h4>
                  </CardHeader>
                  <CardBody>
                    <LinearProgress />
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      );
    } else {
      const gridCol = window.innerWidth <= 800 ? 3 : 5;
      let friendList = this.props.friends.map(friend => (
        <GridListTile key={friend._id} classes={{ tile: classes.gridListTile }}>
          <Avatar
            backgroundColor={friend.avatar.backgroundColor}
            colorNumber={friend.avatar.colorNumber}
          >
            {friend.avatar.text}
          </Avatar>
          <GridListTileBar
            title={friend.name}
            classes={{
              root: classes.titleBar,
              title: classes.title
            }}
            actionIcon={
              !friend.isCurrentUser ? (
                <IconButton
                  className={classes.icon}
                  onClick={() => this.deleteFriendHandler(friend)}
                >
                  <DeleteIcon />
                </IconButton>
              ) : null
            }
          />
        </GridListTile>
      ));

      if (friendList) {
        friendList = (
          <GridList
            className={classes.gridList}
            cols={gridCol}
            cellHeight={100}
          >
            {friendList}
          </GridList>
        );
      }
      const dialogActions = {
        success: {
          title: "Yes",
          handler: this.confirmDeleteFriend
        },
        cancel: {
          title: "No",
          handler: this.closeDeleteConfirmation
        }
      };
      return (
        <React.Fragment>
          <Dialog
            open={this.state.isAddingFriend}
            closeDialogHandler={this.closeDialogHandler}
            title="Add New Friend"
          >
            <AddFriend
              form={this.state.form}
              handleAvatarChange={this.addNewFriendHandler.handleAvatarChange}
              handleChange={this.addNewFriendHandler.handleChange}
              handleSubmit={this.addNewFriendHandler.handleSubmit}
              handleClose={this.closeDialogHandler}
            />
          </Dialog>
          <Dialog
            open={this.state.displayDeleteConfirmation}
            closeDialogHandler={this.closeDeleteConfirmation}
            actions={dialogActions}
            title="Delete Friend"
          >
            Are you sure you want to delete this friend?
          </Dialog>
          <div className={classes.section}>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={8}>
                  <Card>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>Friends</h4>
                    </CardHeader>
                    <CardBody>
                      <GridContainer justify="center">
                        <GridItem md={2}>
                          <Button
                            variant="fab"
                            color="primary"
                            aria-label="Add"
                            className={classes.button}
                            onClick={this.openDialogHandler}
                          >
                            <AddIcon />
                          </Button>
                        </GridItem>
                        <GridItem md={10}>{friendList}</GridItem>
                      </GridContainer>
                    </CardBody>
                  </Card>
                </GridItem>
              </GridContainer>
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    friends: state.friend.friends,
    loading: state.friend.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadFriendList: () => dispatch(actions.getFriendList()),
    onAddFriend: data => dispatch(actions.addFriend(data)),
    onDeleteFriend: id => dispatch(actions.deleteFriend(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(friendStyle)(Friends));
