import React from "react";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Typography from "@material-ui/core/Typography";
import styles from "../../../styles/formStyle";
import AvatarCustomizer from "../../layout/AvatarCustomizer/AvatarCustomizer";

const AddFriend = props => {
  const { classes } = props;
  const form = props.form;

  let errorMsg = null;
  if (props.errors) {
    errorMsg = Object.keys(props.errors).map(function(key, index) {
      return (
        <Typography key={key} variant="body1" color="error">
          {props.errors[key]}{" "}
        </Typography>
      );
    }, this);
  }
  return (
    <React.Fragment>
      <ValidatorForm
        className={classes.container}
        onSubmit={props.handleSubmit}
      >
        <TextValidator
          className={classes.textField}
          label="Name"
          onChange={props.handleChange}
          name="name"
          fullWidth
          validators={["required", "minStringLength:3", "maxStringLength:30"]}
          errorMessages={[
            "this field is required",
            "must be within 3 and 30 characters.",
            "must be within 3 and 30 characters."
          ]}
          value={form.name}
        />
        <TextValidator
          className={classes.textField}
          label="Email"
          onChange={props.handleChange}
          name="email"
          fullWidth
          validators={["required", "isEmail"]}
          errorMessages={["this field is required", "email is not valid"]}
          value={form.email}
        />
        <AvatarCustomizer
          avatarSetting={form.avatar}
          avatarChange={props.handleAvatarChange}
        />
        <div>
          <Button className={classes.dense} type="submit">
            SUBMIT
          </Button>
          <Button className={classes.dense} onClick={props.handleClose}>
            CANCEL
          </Button>
        </div>
        {errorMsg}
      </ValidatorForm>
    </React.Fragment>
  );
};

export default withStyles(styles)(AddFriend);
