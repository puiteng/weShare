import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import Avatar from "../../layout/Avatar/Avatar";
import styles from "./gridStyle";

const Friends = props => {
  const { classes } = props;
  const content = props.friendList.map(friend => (
    <GridListTile
      key={friend._id}
      classes={{ tile: classes.gridListTile }}
      onClick={() => props.onAddBillFriend(friend._id, props.isSharedBy)}
    >
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
  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={3} cellHeight={100}>
        {content}
      </GridList>
    </div>
  );
};

Friends.propTypes = {
  friendList: PropTypes.arrayOf(PropTypes.object).isRequired,
  classes: PropTypes.object.isRequired,
  onAdd: PropTypes.func,
  onAddBillFriend: PropTypes.func,
  isSharedBy: PropTypes.bool
};

export default withStyles(styles)(Friends);
