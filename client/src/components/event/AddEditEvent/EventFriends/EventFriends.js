import React from "react";

import styles from "./EventFriendsStyle";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import Card from "material-kit-react/components/Card/Card";
import CardHeader from "material-kit-react/components/Card/CardHeader";
import CardBody from "material-kit-react/components/Card/CardBody";
import {
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "../../../layout/Dialog/Dialog";
import Avatar from "../../../layout/Avatar/Avatar";
import AddFriendFromFriendList from "./AddFriendFromFriendList";

const EventFriends = props => {
  const classes = props.classes;

  let friendList = props.friends.map(friend => (
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
      />
    </GridListTile>
  ));

  if (friendList) {
    const gridCol = window.innerWidth <= 800 ? 3 : 5;
    friendList = (
      <GridList className={classes.gridList} cols={gridCol} cellHeight={100}>
        {friendList}
      </GridList>
    );
  }
  return (
    <React.Fragment>
      <Dialog
        open={props.isAddingFriend}
        closeDialogHandler={() => props.EditFriendHandler(props.fullFriendList)}
        title="Import Friends"
      >
        <AddFriendFromFriendList
          checked={props.friendIDs}
          friendList={props.fullFriendList}
          bills={props.bills}
          handleToggle={props.handleToggle}
          EditFriendHandler={props.EditFriendHandler}
        />
      </Dialog>
      <div className={classes.section}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary" className={classes.cardHeader}>
                  <h4>Friends</h4>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={2} md={2}>
                      <IconButton onClick={props.openDialogHandler}>
                        <EditIcon />
                      </IconButton>
                    </GridItem>
                    <GridItem xs={12} sm={10} md={10}>
                      {friendList}
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </React.Fragment>
  );
};

EventFriends.propTypes = {
  classes: PropTypes.object.isRequired,
  fullFriendList: PropTypes.array.isRequired,
  friends: PropTypes.array.isRequired,
  isAddingFriend: PropTypes.bool.isRequired,
  closeDialogHandler: PropTypes.func.isRequired,
  openDialogHandler: PropTypes.func.isRequired,
  handleToggle: PropTypes.func.isRequired,
  EditFriendHandler: PropTypes.func.isRequired
};

export default withStyles(styles)(EventFriends);
