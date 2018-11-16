import React from "react";
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Checkbox,
  Button
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "../../../layout/Avatar/Avatar";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  button: {
    margin: theme.spacing.unit
  }
});

const AddFriendFromFriendList = props => {
  let editableFriends = props.friendList.map(friend => friend._id);
  if (props.bills) {
    for (var i = 0; i < props.bills.length; i++) {
      for (var j = 0; j < props.bills[i].sharedBy.length; j++) {
        const index = editableFriends.indexOf(
          props.bills[i].sharedBy[j].friend._id
        );
        if (index !== -1) {
          editableFriends.splice(index, 1);
        }
        if (editableFriends.length === 0) break;
      }
      for (var j = 0; j < props.bills[i].paidBy.length; j++) {
        const index = editableFriends.indexOf(
          props.bills[i].paidBy[j].friend._id
        );
        if (index !== -1) {
          editableFriends.splice(index, 1);
        }
        if (editableFriends.length === 0) break;
      }
    }
  }
  const { classes } = props;
  let listContent = null;
  if (props.friendList) {
    listContent = (
      <React.Fragment>
        <List>
          {props.friendList.map(friend => (
            <ListItem key={friend._id} dense button>
              <Avatar
                backgroundColor={friend.avatar.backgroundColor}
                colorNumber={friend.avatar.colorNumber}
              >
                {friend.avatar.text}
              </Avatar>
              <ListItemText primary={friend.name} />
              <ListItemSecondaryAction>
                <Checkbox
                  onChange={props.handleToggle(friend)}
                  checked={props.checked.indexOf(friend._id) !== -1}
                  disabled={editableFriends.indexOf(friend._id) === -1}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <div>
          <Button
            className={classes.dense}
            onClick={() => props.EditFriendHandler(props.friendList)}
          >
            Done
          </Button>
        </div>
      </React.Fragment>
    );
  }
  return <div>{listContent}</div>;
};

export default withStyles(styles)(AddFriendFromFriendList);
