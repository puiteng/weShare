import React from "react";
import MUAvatar from "@material-ui/core/Avatar";
import * as colors from "@material-ui/core/colors";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const Avatar = props => {
  let avatarSize = 50;
  if (props.size) {
    if (props.size === "large") {
      avatarSize = 80;
    } else if (props.size === "medium") {
      avatarSize = 60;
    }
  }
  const styles = {
    avatar: {
      width: avatarSize,
      height: avatarSize,
      margin: 10,
      color: "#fff",
      backgroundColor: colors[props.backgroundColor][props.colorNumber]
    }
  };
  const avatar = props => (
    <MUAvatar className={props.classes.avatar}>{props.children}</MUAvatar>
  );
  const Styled = withStyles(styles)(avatar);
  return <Styled>{props.children}</Styled>;
};

Avatar.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  colorNumber: PropTypes.number.isRequired,
  size: PropTypes.string
};

export default Avatar;
