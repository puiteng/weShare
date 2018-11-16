import React from "react";
import {
  Dialog as MUDialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button
} from "@material-ui/core";

const Dialog = props => {
  let actions = null;
  if (props.actions) {
    let buttonCancel = null;
    let buttonSuccess = null;
    if (props.actions.cancel) {
      buttonCancel = (
        <Button onClick={props.actions.cancel.handler} color="primary">
          {props.actions.cancel.title}
        </Button>
      );
    }
    if (props.actions.success) {
      buttonSuccess = (
        <Button onClick={props.actions.success.handler} color="primary">
          {props.actions.success.title}
        </Button>
      );
    }
    actions = (
      <DialogActions>
        {buttonCancel} {buttonSuccess}
      </DialogActions>
    );
  }
  return (
    <MUDialog
      open={props.open}
      onClose={props.closeDialogHandler}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
      <DialogContent>{props.children}</DialogContent>
      {actions}
    </MUDialog>
  );
};

export default Dialog;
