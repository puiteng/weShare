import React, { Component } from "react";
import Select from "@material-ui/core/Select";
import Avatar from "../Avatar/Avatar";
import MenuItem from "@material-ui/core/MenuItem";
import * as avatarUtil from "../../../utils/avatar";

class AvatarCustomizer extends Component {
  /*state = {
    selectedColor: "red",
    selectedNumber: 500
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };*/

  render() {
    const colorsArr = avatarUtil.colorsArr;
    let numberArr = avatarUtil.numberArr;
    const colorOptions = colorsArr.map(color => (
      <MenuItem key={color} value={color}>
        {color.toString().toUpperCase()}
      </MenuItem>
    ));
    const numberOptions = numberArr.map(num => (
      <MenuItem key={num} value={num}>
        {num.toString()}
      </MenuItem>
    ));
    const avatarSetting = this.props.avatarSetting;
    console.log(this.props);
    return (
      <div style={{ display: "flex", margin: "20px" }}>
        <Select
          name="backgroundColor"
          onChange={this.props.avatarChange}
          value={avatarSetting.backgroundColor}
        >
          {colorOptions}
        </Select>
        <Select
          name="colorNumber"
          onChange={this.props.avatarChange}
          value={avatarSetting.colorNumber}
        >
          {numberOptions}
        </Select>
        <Avatar
          backgroundColor={avatarSetting.backgroundColor}
          colorNumber={avatarSetting.colorNumber}
        >
          {avatarSetting.text}
        </Avatar>
      </div>
    );
  }
}

export default AvatarCustomizer;
