import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import styles from "./BillFriendStyle";
import Friends from "./Friends";
import Avatar from "../../layout/Avatar/Avatar";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "../../layout/Dialog/Dialog";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import Card from "material-kit-react/components/Card/Card";
import CardHeader from "material-kit-react/components/Card/CardHeader";
import CardBody from "material-kit-react/components/Card/CardBody";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Select,
  MenuItem,
  Toolbar,
  IconButton
} from "@material-ui/core";

const BillFriends = props => {
  const classes = props.classes;
  const content = props.billFriendList.map((billFriend, index) => {
    const controlName =
      props.type === "Percentage" ? "percentage" : "actualAmount";
    const firstColumn = (
      <TableCell>
        <Avatar
          backgroundColor={billFriend.friend.avatar.backgroundColor}
          colorNumber={billFriend.friend.avatar.colorNumber}
        >
          {billFriend.friend.avatar.text}
        </Avatar>
        {billFriend.friend.name}
      </TableCell>
    );
    if (props.isEditingBillFriend) {
      return (
        <TableRow key={index}>
          {firstColumn}
          <TableCell>
            <TextValidator
              type="number"
              label={
                props.type === "Percentage" ? "Percentage" : "Actual Amount"
              }
              name={controlName}
              fullWidth
              validators={[
                "required",
                "minFloat:0.01",
                "matchRegexp:^[0-9]+(.[0-9]{1,2})?$"
              ]}
              errorMessages={[
                "this field is required",
                "must be greater than 0",
                "invalid amount"
              ]}
              value={billFriend[controlName]}
              onChange={event =>
                props.onValueChanged(event, index, props.isSharedBy)
              }
            />
          </TableCell>
          <TableCell />
        </TableRow>
      );
    } else {
      return (
        <TableRow key={index}>
          {firstColumn}
          <TableCell>{billFriend[controlName]}</TableCell>
          <TableCell>
            <DeleteIcon
              style={{ cursor: "pointer" }}
              onClick={() => props.onDeleteItem(index)}
            />
          </TableCell>
        </TableRow>
      );
    }
  });
  return (
    <React.Fragment>
      <Dialog
        open={props.isAddingFriend}
        closeDialogHandler={() => props.closeHandler(props.isSharedBy)}
        title="Import Friends"
      >
        <Friends
          isSharedBy={props.isSharedBy}
          friendList={props.addableFriendList}
          onAddBillFriend={props.onAddBillFriend}
        />
      </Dialog>
      <div className={classes.section}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={8}>
              <ValidatorForm onSubmit={() => props.onSubmit(props.isSharedBy)}>
                <Card>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>{props.isSharedBy ? "Shared By" : "Paid By"}</h4>
                  </CardHeader>
                  <CardBody>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <Toolbar className={classes.toolbar}>
                          <Select
                            value={props.type}
                            onChange={event =>
                              props.onBillFriendTypeChanged(
                                event,
                                props.isSharedBy
                              )
                            }
                            inputProps={{
                              name: "type"
                            }}
                          >
                            <MenuItem value="Percentage">Percentage</MenuItem>
                            <MenuItem value="ActualAmount">
                              Actual Amount
                            </MenuItem>
                          </Select>
                          <div>
                            {props.addableFriendList &&
                            props.addableFriendList.length > 0 ? (
                              <IconButton
                                color="inherit"
                                onClick={() =>
                                  props.openHandler(props.isSharedBy)
                                }
                              >
                                <AddIcon />
                              </IconButton>
                            ) : null}

                            {props.isEditingBillFriend ? (
                              <IconButton color="inherit" type="submit">
                                <DoneIcon />
                              </IconButton>
                            ) : props.billFriendList &&
                              props.billFriendList.length > 0 ? (
                              <IconButton
                                color="inherit"
                                onClick={props.onEditingBillFriend}
                              >
                                <EditIcon />
                              </IconButton>
                            ) : null}
                          </div>
                        </Toolbar>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Friend</TableCell>
                              <TableCell numeric>
                                {props.type === "Percentage"
                                  ? "Percentage"
                                  : "Actual Amount"}
                              </TableCell>
                              <TableCell />
                            </TableRow>
                          </TableHead>
                          <TableBody>{content}</TableBody>
                        </Table>
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                </Card>
              </ValidatorForm>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </React.Fragment>
  );
};

BillFriends.propTypes = {
  isSharedBy: PropTypes.bool,
  billFriendList: PropTypes.arrayOf(PropTypes.object).isRequired,
  addableFriendList: PropTypes.arrayOf(PropTypes.object).isRequired,
  isAddingFriend: PropTypes.bool.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
  onAddBillFriend: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  onBillFriendTypeChanged: PropTypes.func.isRequired,
  isEditingBillFriend: PropTypes.bool,
  onEditingBillFriend: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onValueChanged: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default withStyles(styles)(BillFriends);
