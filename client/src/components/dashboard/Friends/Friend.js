import React from "react";

import Avatar from "../layout/Avatar/Avatar";

import { Card, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  card: {
    width: "80%",
    margin: "10px",
    display: "flex",
    overflow: "hidden",
    padding: "5px"
  }
});

const Friend = props => {
  const { classes } = props;
  const avatarSetting = props.friend.avatar;
  return (
    <Card className={classes.card}>
      <Avatar
        backgroundColor={avatarSetting.backgroundColor}
        colorNumber={avatarSetting.colorNumber}
      >
        {avatarSetting.text}
      </Avatar>
      <Typography color="textSecondary" component="h2">
        {props.friend.name}
      </Typography>
    </Card>
  );
};
export default withStyles(styles)(Friend);
