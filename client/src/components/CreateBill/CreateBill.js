import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter, matchPath } from "react-router";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Typography, Toolbar, Button, IconButton } from "@material-ui/core";
import BillItems from "./BillItems/BillItems";
import BillFriends from "./BillFriends/BillFriends";
import Dialog from "../layout/Dialog/Dialog";
import styles from "./CreateBillStyle";
import { withStyles } from "@material-ui/core/styles";
import * as actions from "../../actions/index";
import isEmpty from "../../validation/is_empty";
import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import Card from "material-kit-react/components/Card/Card";
import CardHeader from "material-kit-react/components/Card/CardHeader";
import CardBody from "material-kit-react/components/Card/CardBody";
import BackIcon from "@material-ui/icons/KeyboardBackspace";

class CreateBill extends Component {
  state = {
    isAdd: true,
    editingBillId: null,
    bill: {
      description: "",
      billDate: new Date().toISOString(),
      items: [],
      totalAmount: 0,
      sharedBy: [],
      paidBy: [],
      event: null
    },
    forSharedBy: {
      type: "Percentage",
      isAdding: false,
      isEditing: false
    },
    forPaidBy: {
      type: "Percentage",
      isAdding: false,
      isEditing: false
    },
    editingBillItemIndex: null,
    editingBillItem: {
      description: "",
      quantity: 1,
      amount: ""
    },
    isDisplayAmountInvalid: false,
    resetAmountForSharedBy: true,
    error: null
  };

  componentDidMount() {
    const match = matchPath(this.props.location.pathname, {
      path: "/AddBill/:id"
    });
    if (match) {
      if (isEmpty(this.props.currentEvent)) {
        this.props.onGetEvent(this.props.match.params.id);
      }
    } else {
      axios
        .get("/api/bill/" + this.props.match.params.id)
        .then(res => {
          this.bindBill(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
    this.setState({ isAdd: match !== null });
  }
  bindBill = editingBill => {
    let total = 0;
    const items = [];
    const sharedBy = [];
    const paidBy = [];
    let sharedByType = "";
    let paidByType = "";
    editingBill.items.forEach(item => {
      total = total + item.amount * item.quantity;
      items.push({
        description: item.description,
        quantity: item.quantity,
        amount: item.amount
      });
    });
    editingBill.sharedBy.forEach(item => {
      sharedByType = item.hasOwnProperty("percentage")
        ? "Percentage"
        : "ActualAmount";
      if (sharedByType === "Percentage") {
        sharedBy.push({
          friend: item.friend,
          percentage: item.percentage
        });
      } else {
        sharedBy.push({
          friend: item.friend,
          actualAmount: item.actualAmount
        });
      }
    });
    editingBill.paidBy.forEach(item => {
      paidByType = item.hasOwnProperty("percentage")
        ? "Percentage"
        : "ActualAmount";
      if (paidByType === "Percentage") {
        paidBy.push({
          friend: item.friend,
          percentage: item.percentage
        });
      } else {
        paidBy.push({
          friend: item.friend,
          actualAmount: item.actualAmount
        });
      }
    });
    const newBill = {
      description: editingBill.description,
      billDate: editingBill.billDate,
      items: items,
      totalAmount: total,
      sharedBy: sharedBy,
      paidBy: paidBy,
      event: editingBill.event
    };
    const forSharedBy = {
      ...this.state.forSharedBy,
      type: sharedByType
    };
    const forPaidBy = {
      ...this.state.forPaidBy,
      type: paidByType
    };
    this.setState({
      editingBillId: editingBill._id,
      bill: newBill,
      forSharedBy: forSharedBy,
      forPaidBy: forPaidBy
    });
  };
  onDeleteItem = index => {
    const newItems = [...this.state.bill.items];
    newItems.splice(index, 1);

    //recalculate total amount
    let total = 0;
    newItems.forEach(item => {
      total = total + item.amount * item.quantity;
    });

    const sharedBy = this.updateAverageAmount(
      this.state.forSharedBy.type,
      [...this.state.bill.sharedBy],
      total
    );

    const paidBy = this.updateAverageAmount(
      this.state.forPaidBy.type,
      [...this.state.bill.paidBy],
      total
    );

    const editedBillItems = {
      ...this.state.bill,
      items: newItems,
      totalAmount: total,
      sharedBy: sharedBy,
      paidBy: paidBy
    };
    this.setState({
      bill: editedBillItems
    });
  };

  onSubmitBillItem = () => {
    const newItems = [...this.state.bill.items];
    if (this.state.editingBillItemIndex === null) {
      newItems.push(this.state.editingBillItem);
      //newItems.slice(this.state.editingBillItemIndex, 1);
    } else {
      newItems[this.state.editingBillItemIndex] = this.state.editingBillItem;
    }

    //recalculate total amount
    let total = 0;
    newItems.forEach(item => {
      total = total + item.amount * item.quantity;
    });

    const sharedBy = this.updateAverageAmount(
      this.state.forSharedBy.type,
      [...this.state.bill.sharedBy],
      total
    );

    const paidBy = this.updateAverageAmount(
      this.state.forPaidBy.type,
      [...this.state.bill.paidBy],
      total
    );

    const editedBillItems = {
      ...this.state.bill,
      items: newItems,
      totalAmount: total,
      sharedBy: sharedBy,
      paidBy: paidBy
    };
    const defaultBillItem = {
      description: "",
      quantity: 1,
      amount: 0
    };
    this.setState({
      bill: editedBillItems,
      editingBillItemIndex: null,
      editingBillItem: defaultBillItem
    });
  };

  onBillItemChange = event => {
    const { editingBillItem } = this.state;
    editingBillItem[event.target.name] = event.target.value;
    this.setState({ editingBillItem });
  };

  onEditingBillItemIndexChange = (index, data) => {
    this.setState({
      editingBillItemIndex: index,
      editingBillItem: data
    });
  };

  fixAmountLossFromDivide = (total, averageAmount, arr, column) => {
    if (!arr || arr.length === 0) return arr;

    const remaining = Number((total - averageAmount * arr.length).toFixed(2));
    if (remaining === 0) return arr;
    arr[arr.length - 1][column] = Number(
      (arr[arr.length - 1][column] + remaining).toFixed(2)
    );
  };

  updateAverageAmount = (
    method,
    arr,
    totalAmount = this.state.bill.totalAmount
  ) => {
    if (!arr || arr.length === 0) return arr;
    if (method === "Percentage") {
      const averagePercentage = Number((100 / arr.length).toFixed(2));
      arr.forEach(item => (item.percentage = averagePercentage));
      this.fixAmountLossFromDivide(100, averagePercentage, arr, "percentage");
    } else {
      const averageAmount = Number((totalAmount / arr.length).toFixed(2));
      arr.forEach(item => (item.actualAmount = averageAmount));
      this.fixAmountLossFromDivide(
        totalAmount,
        averageAmount,
        arr,
        "actualAmount"
      );
    }
    return arr;
  };

  updateByArray = (method, arr, friend) => {
    const newArr = [...arr];
    let newItem = null;
    if (method === "Percentage") {
      if (newArr.length > 0) {
        //Recalculate Percentage
        const averagePercentage = Number(
          (100 / (newArr.length + 1)).toFixed(2)
        );
        newArr.forEach(item => (item.percentage = averagePercentage));
        newItem = {
          friend: friend,
          percentage: averagePercentage
        };

        newArr.push(newItem);
        this.fixAmountLossFromDivide(
          100,
          averagePercentage,
          newArr,
          "percentage"
        );
      } else {
        newItem = {
          friend: friend,
          percentage: 100
        };
        newArr.push(newItem);
      }
    } else {
      if (newArr.length > 0) {
        //Recalculate Percentage
        const averageAmount = Number(
          (this.state.bill.totalAmount / (newArr.length + 1)).toFixed(2)
        );
        newArr.forEach(item => (item.actualAmount = averageAmount));
        newItem = {
          friend: friend,
          actualAmount: averageAmount
        };
        newArr.push(newItem);
        this.fixAmountLossFromDivide(
          this.state.bill.totalAmount,
          averageAmount,
          newArr,
          "actualAmount"
        );
      } else {
        newItem = {
          friend: friend,
          actualAmount: this.state.bill.totalAmount
        };
        newArr.push(newItem);
      }
    }
    return newArr;
  };

  getRemainingFriend = usedFriend => {
    const usedFriendId = usedFriend.map(item => item.friend._id);

    if (!usedFriendId || usedFriendId.length === 0) {
      return [...this.props.currentEvent.friends];
    }
    const friends = this.props.currentEvent.friends;
    const remainingFriends = friends.filter(
      friend => usedFriendId.indexOf(friend._id) === -1
    );
    return remainingFriends;
  };

  onAddBillFriend = (id, isSharedBy) => {
    const friends = [...this.props.currentEvent.friends];
    const selectedFriend = friends.find(x => x._id === id);
    let billFriends = null;
    let type = null;
    if (isSharedBy) {
      billFriends = [...this.state.bill.sharedBy];
      type = this.state.forSharedBy.type;
    } else {
      billFriends = [...this.state.bill.paidBy];
      type = this.state.forPaidBy.type;
    }
    billFriends = this.updateByArray(type, billFriends, selectedFriend);
    let newBill = null;
    if (isSharedBy) {
      newBill = {
        ...this.state.bill,
        sharedBy: billFriends
      };

      const forSharedBy = {
        ...this.state.forSharedBy,
        isAdding: false
      };
      this.setState({
        bill: newBill,
        forSharedBy: forSharedBy
      });
    } else {
      newBill = {
        ...this.state.bill,
        paidBy: billFriends
      };
      const forPaidBy = {
        ...this.state.forPaidBy,
        isAdding: false
      };
      this.setState({
        bill: newBill,
        forPaidBy: forPaidBy
      });
    }
  };

  onRemovePaidBy = index => {
    const newPaidBy = [...this.state.bill.paidBy];
    newPaidBy.splice(index, 1);

    const paidBy = this.updateAverageAmount(
      this.state.forPaidBy.type,
      newPaidBy
    );
    const editedBillItems = {
      ...this.state.bill,
      paidBy: paidBy
    };
    this.setState({
      bill: editedBillItems
    });
  };

  onRemoveSharedBy = index => {
    const newSharedBy = [...this.state.bill.sharedBy];
    newSharedBy.splice(index, 1);

    const sharedBy = this.updateAverageAmount(
      this.state.forSharedBy.type,
      newSharedBy
    );

    const editedBillItems = {
      ...this.state.bill,
      sharedBy: sharedBy
    };
    this.setState({
      bill: editedBillItems
    });
  };

  onTypeChanged = (event, isSharedBy) => {
    const methodName =
      event.target.value === "Percentage" ? "percentage" : "actualAmount";
    if (isSharedBy) {
      //reset percentage and amount to null
      const array = this.state.bill.sharedBy.map(item => ({
        friend: item.friend,
        [methodName]: 0
      }));
      const sharedBy = this.updateAverageAmount(event.target.value, array);
      const bill = {
        ...this.state.bill,
        sharedBy: sharedBy
      };
      const forSharedBy = {
        ...this.state.forSharedBy,
        type: event.target.value
      };
      this.setState({ forSharedBy: forSharedBy, bill: bill });
    } else {
      //reset percentage and amount to null
      const array = this.state.bill.paidBy.map(item => ({
        friend: item.friend,
        [methodName]: 0
      }));
      const paidBy = this.updateAverageAmount(event.target.value, array);
      const bill = {
        ...this.state.bill,
        paidBy: paidBy
      };
      const forPaidBy = { ...this.state.forPaidBy, type: event.target.value };
      this.setState({ forPaidBy: forPaidBy, bill: bill });
    }
  };

  onEditingPaidBy = () => {
    const forPaidBy = { ...this.state.forPaidBy, isEditing: true };
    this.setState({ forPaidBy: forPaidBy });
  };

  onEditingSharedBy = () => {
    const forSharedBy = { ...this.state.forSharedBy, isEditing: true };
    this.setState({ forSharedBy: forSharedBy });
  };

  onBillFriendValueChanged = (event, index, isSharedBy) => {
    const billFriend = isSharedBy
      ? [...this.state.bill.sharedBy]
      : [...this.state.bill.paidBy];
    billFriend[index][event.target.name] = event.target.value;
    let newBill = null;
    if (isSharedBy) {
      newBill = {
        ...this.state.bill,
        sharedBy: billFriend
      };
    } else {
      newBill = {
        ...this.state.bill,
        paidBy: billFriend
      };
    }
    this.setState({ bill: newBill });
  };

  onBillFriendSubmit = isSharedBy => {
    const billFriend = isSharedBy
      ? [...this.state.bill.sharedBy]
      : [...this.state.bill.paidBy];
    const type = isSharedBy
      ? this.state.forSharedBy.type
      : this.state.forPaidBy.type;
    const controlName = type === "Percentage" ? "percentage" : "actualAmount";
    billFriend.forEach(
      item => (item[controlName] = Number(Number(item[controlName]).toFixed(2)))
    );
    const isValid = this.isAmountTally(billFriend, type);
    if (!isValid) {
      this.setState({
        isDisplayAmountInvalid: true,
        resetAmountForSharedBy: isSharedBy
      });
    } else {
      if (isSharedBy) {
        const newBill = {
          ...this.state.bill,
          sharedBy: billFriend
        };

        const forSharedBy = { ...this.state.forSharedBy, isEditing: false };
        this.setState({ bill: newBill, forSharedBy: forSharedBy });
      } else {
        const newBill = {
          ...this.state.bill,
          paidBy: billFriend
        };

        const forPaidBy = { ...this.state.forPaidBy, isEditing: false };
        this.setState({ bill: newBill, forPaidBy: forPaidBy });
      }
    }
  };

  isAmountTally = (billFriend, type) => {
    let total = 0;
    if (type === "Percentage") {
      billFriend.forEach(item => {
        total = Number(total.toFixed(2)) + Number(item.percentage.toFixed(2));
      });
      return total === 100;
    } else {
      total = this.state.bill.totalAmount;
      billFriend.forEach(item => {
        total = Number(total.toFixed(2)) - Number(item.actualAmount.toFixed(2));
      });
      return total === 0;
    }
  };

  closeAmountInvalid = () => {
    this.setState({ isDisplayAmountInvalid: false });
  };

  resetAmount = () => {
    if (this.state.resetAmountForSharedBy) {
      const sharedBy = this.updateAverageAmount(this.state.forSharedBy.type, [
        ...this.state.bill.sharedBy
      ]);
      const newBill = {
        ...this.state.bill,
        sharedBy: sharedBy
      };
      this.setState({ bill: newBill, isDisplayAmountInvalid: false });
    } else {
      const paidBy = this.updateAverageAmount(this.state.forPaidBy.type, [
        ...this.state.bill.paidBy
      ]);
      const newBill = {
        ...this.state.bill,
        paidBy: paidBy
      };
      this.setState({ bill: newBill, isDisplayAmountInvalid: false });
    }
  };

  openDialogHandler = isSharedBy => {
    if (isSharedBy) {
      const forSharedBy = { ...this.state.forSharedBy, isAdding: true };
      this.setState({ forSharedBy: forSharedBy });
    } else {
      const forPaidBy = { ...this.state.forPaidBy, isAdding: true };
      this.setState({ forPaidBy: forPaidBy });
    }
  };

  closeDialogHandler = isSharedBy => {
    if (isSharedBy) {
      const forSharedBy = { ...this.state.forSharedBy, isAdding: false };
      this.setState({ forSharedBy: forSharedBy });
    } else {
      const forPaidBy = { ...this.state.forPaidBy, isAdding: false };
      this.setState({ forPaidBy: forPaidBy });
    }
  };

  handleChange = event => {
    let newBill = {
      ...this.state.bill
    };
    if (event.target.name === "billDate") {
      newBill = {
        ...this.state.bill,
        [event.target.name]: new Date(event.target.value).toISOString()
      };
    } else {
      newBill = {
        ...this.state.bill,
        [event.target.name]: event.target.value
      };
    }
    this.setState({ bill: newBill });
  };

  isValidBill = () => {
    let error = null;
    let isValid = true;
    if (isEmpty(this.state.bill.items)) {
      error = "Please insert at least one item.";
      isValid = false;
    } else if (isEmpty(this.state.bill.paidBy)) {
      error = "Please insert at least one Paid By.";
      isValid = false;
    } else if (isEmpty(this.state.bill.sharedBy)) {
      error = "Please insert at least one Shared By.";
      isValid = false;
    }
    this.setState({ error: error });
    return isValid;
  };

  onBillSubmit = () => {
    if (!this.isValidBill()) return;
    const newBill = {
      event: this.state.bill.event
        ? this.state.bill.event
        : this.props.currentEvent._id,
      description: this.state.bill.description,
      billDate: this.state.bill.billDate,
      items: this.state.bill.items,
      sharedBy: this.state.bill.sharedBy.map(item => ({
        friend: {
          _id: item.friend._id,
          name: item.friend.name,
          userId: item.friend.userId,
          email: item.friend.email,
          isCurrentUser: item.friend.isCurrentUser,
          avatar: item.friend.avatar
        },
        percentage: item.percentage,
        actualAmount: item.actualAmount
      })),
      paidBy: this.state.bill.paidBy.map(item => ({
        friend: {
          _id: item.friend._id,
          name: item.friend.name,
          userId: item.friend.userId,
          email: item.friend.email,
          isCurrentUser: item.friend.isCurrentUser,
          avatar: item.friend.avatar
        },
        percentage: item.percentage,
        actualAmount: item.actualAmount
      }))
    };
    if (this.state.isAdd) {
      this.props.onAddBill(newBill, this.props.history);
    } else {
      this.props.onEditBill(
        this.state.editingBillId,
        newBill,
        this.props.history
      );
    }
  };

  render() {
    const { classes } = this.props;
    const addableSharedByFriendList = !isEmpty(this.props.currentEvent.friends)
      ? this.getRemainingFriend(this.state.bill.sharedBy)
      : [];
    const addablePaidByFriendList = !isEmpty(this.props.currentEvent.friends)
      ? this.getRemainingFriend(this.state.bill.paidBy)
      : [];
    const dialogActions = {
      success: {
        title: "Yes",
        handler: this.resetAmount
      },
      cancel: {
        title: "No",
        handler: this.closeAmountInvalid
      }
    };
    return (
      <React.Fragment>
        <Dialog
          open={this.state.isDisplayAmountInvalid}
          closeDialogHandler={this.closeAmountInvalid}
          actions={dialogActions}
          title="Amount Not Tally"
        >
          <Typography variant="body1">
            Amount not tally. Press "Yes" to reset value to average. Or press
            "No" to manually adjust the value.
          </Typography>
        </Dialog>
        <div className={classes.section}>
          <div className={classes.container}>
            <ValidatorForm onSubmit={this.onBillSubmit}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={8}>
                  <Toolbar className={classes.toolbar}>
                    <IconButton onClick={this.props.history.goBack}>
                      <BackIcon />
                    </IconButton>
                    {this.state.error ? (
                      <div className={classes.error}>{this.state.error}</div>
                    ) : null}
                    <Button
                      variant="text"
                      color="primary"
                      aria-label="Save"
                      type="submit"
                    >
                      Save
                    </Button>
                  </Toolbar>
                </GridItem>
                <GridItem xs={12} sm={12} md={8}>
                  <Card>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>Details</h4>
                    </CardHeader>
                    <CardBody>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                          <TextValidator
                            className={classes.textField}
                            label="Description"
                            name="description"
                            fullWidth
                            validators={[
                              "required",
                              "minStringLength:3",
                              "maxStringLength:200"
                            ]}
                            errorMessages={[
                              "this field is required",
                              "must be within 3 and 200 characters.",
                              "must be within 3 and 200 characters."
                            ]}
                            value={this.state.bill.description}
                            onChange={this.handleChange}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                          <TextValidator
                            className={classes.textField}
                            label="Date"
                            name="billDate"
                            type="date"
                            fullWidth
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                            value={this.state.bill.billDate
                              .toString()
                              .substring(0, 10)}
                            onChange={this.handleChange}
                          />
                        </GridItem>
                      </GridContainer>
                    </CardBody>
                  </Card>
                </GridItem>
              </GridContainer>
            </ValidatorForm>
          </div>
        </div>
        <BillItems
          items={this.state.bill.items}
          totalAmount={this.state.bill.totalAmount}
          editingBillItem={this.state.editingBillItem}
          editingBillItemIndex={this.state.editingBillItemIndex}
          onSubmitBillItem={this.onSubmitBillItem}
          onBillItemChange={this.onBillItemChange}
          onEditingBillItemIndexChange={this.onEditingBillItemIndexChange}
          onDeleteItem={this.onDeleteItem}
        />
        <BillFriends
          isSharedBy={false}
          billFriendList={this.state.bill.paidBy}
          addableFriendList={addablePaidByFriendList}
          isAddingFriend={this.state.forPaidBy.isAdding}
          openHandler={this.openDialogHandler}
          closeHandler={this.closeDialogHandler}
          onAddBillFriend={this.onAddBillFriend}
          type={this.state.forPaidBy.type}
          onBillFriendTypeChanged={this.onTypeChanged}
          isEditingBillFriend={this.state.forPaidBy.isEditing}
          onDeleteItem={this.onRemovePaidBy}
          onEditingBillFriend={this.onEditingPaidBy}
          onValueChanged={this.onBillFriendValueChanged}
          onSubmit={this.onBillFriendSubmit}
        />
        <BillFriends
          isSharedBy
          billFriendList={this.state.bill.sharedBy}
          addableFriendList={addableSharedByFriendList}
          isAddingFriend={this.state.forSharedBy.isAdding}
          openHandler={this.openDialogHandler}
          closeHandler={this.closeDialogHandler}
          onAddBillFriend={this.onAddBillFriend}
          type={this.state.forSharedBy.type}
          onBillFriendTypeChanged={this.onTypeChanged}
          isEditingBillFriend={this.state.forSharedBy.isEditing}
          onDeleteItem={this.onRemoveSharedBy}
          onEditingBillFriend={this.onEditingSharedBy}
          onValueChanged={this.onBillFriendValueChanged}
          onSubmit={this.onBillFriendSubmit}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentEvent: state.event.currentEvent,
    editingBill: state.bill.currentBill
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddBill: (data, history) => dispatch(actions.addBill(data, history)),
    onEditBill: (id, data, history) =>
      dispatch(actions.editBill(id, data, history)),
    onGetEvent: id => dispatch(actions.getEvent(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(CreateBill)));
