import React from "react";
import { TextValidator } from "react-material-ui-form-validator";
import { TableCell, TableRow, IconButton, Toolbar } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import DoneIcon from "@material-ui/icons/Done";
import DeleteIcon from "@material-ui/icons/Delete";

const controls = [
  {
    type: "input",
    label: "Description",
    name: "description",
    validators: ["required", "minStringLength:3", "maxStringLength:200"],
    errorMessages: [
      "this field is required",
      "must be within 3 and 200 characters.",
      "must be within 3 and 200 characters."
    ]
  },
  {
    type: "number",
    label: "Quantity",
    name: "quantity",
    validators: ["required", "minNumber:1"],
    errorMessages: ["this field is required", "must be greater than 0"]
  },
  {
    type: "number",
    label: "Amount",
    name: "amount",
    validators: [
      "required",
      "minFloat:0.01",
      "matchRegexp:^[0-9]+(.[0-9]{1,2})?$"
    ],
    errorMessages: [
      "this field is required",
      "must be greater than 0",
      "invalid amount"
    ]
  }
];

const BillItemRow = props => {
  const { classes, form, isEditMode } = props;
  let content = null;
  if (isEditMode) {
    content = controls.map((control, index) => (
      <TableCell key={index}>
        <TextValidator
          className={classes.textField}
          type={control.type}
          label={control.label}
          name={control.name}
          fullWidth
          validators={control.validators}
          errorMessages={control.errorMessages}
          value={form[control.name]}
          onChange={props.onBillItemChange}
        />
      </TableCell>
    ));
  } else {
    content = Object.keys(form).map((value, index) => (
      <TableCell key={index}>{form[value]}</TableCell>
    ));
  }
  return (
    <TableRow>
      {content}
      {isEditMode ? (
        <TableCell>
          <Toolbar>
            <IconButton color="inherit" type="submit">
              <DoneIcon />
            </IconButton>
          </Toolbar>
        </TableCell>
      ) : (
        <TableCell>
          <Toolbar>
            <IconButton
              color="inherit"
              disabled={props.disabled}
              onClick={() => {
                if (!props.disabled) {
                  props.onEditingBillItemIndexChange(props.index, form);
                }
              }}
            >
              <Icon>edit_icon</Icon>
            </IconButton>
            <IconButton
              disabled={props.disabled}
              onClick={() => {
                if (!props.disabled) {
                  props.onDeleteItem(props.index);
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Toolbar>
        </TableCell>
      )}
    </TableRow>
  );
};

export default BillItemRow;
