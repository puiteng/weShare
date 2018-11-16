import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as actions from "../../actions/index";
import EventDetail from "./EventDetails/EventDetails";
import isEmpty from "../../validation/is_empty";
import EventBills from "./EventBills/EventBills";
import EventSummary from "./EventSummary/EventSummary";
import Dialog from "../layout/Dialog/Dialog";
import LinearProgress from "@material-ui/core/LinearProgress";

class Event extends Component {
  state = {
    event: {},
    friendList: [],
    fullFriendList: [],
    displayDeleteConfirmation: false,
    selectedForDelete: null
  };
  componentDidMount() {
    this.props.onGetEvent(this.props.match.params.id);
  }

  computeEventSummary(event) {
    let totalSpent = 0;
    let totalBill = event.bills ? event.bills.length : 0;
    const eventTransactions = [];
    if (event.billTransactions) {
      const billTransactions = [...event.billTransactions];
      console.log(billTransactions);
      billTransactions.forEach(billTransaction => {
        totalSpent = Number(
          (totalSpent + billTransaction.totalAmount).toFixed(2)
        );
        billTransaction.transactions.forEach(transaction => {
          const index = eventTransactions.findIndex(
            x => x.friend._id == transaction.friend._id
          );
          if (index === -1) {
            eventTransactions.push({ ...transaction });
          } else {
            eventTransactions[index].amount = Number(
              (eventTransactions[index].amount + transaction.amount).toFixed(2)
            );
          }
        });
      });
    }
    eventTransactions.sort((a, b) => {
      if (a.amount > b.amount) return -1;
      if (a.amount < b.amount) return 1;
      return 0;
    });
    return {
      totalSpent: totalSpent,
      totalBill: totalBill,
      eventTransactions: eventTransactions
    };
  }

  onDeleteBill = id => {
    this.setState({ selectedForDelete: id, displayDeleteConfirmation: true });
  };

  closeDeleteBillDialog = () => {
    this.setState({
      selectedForDelete: null,
      displayDeleteConfirmation: false
    });
  };

  onConfirmDelete = () => {
    this.props.onDeleteBill(this.state.selectedForDelete);
    this.closeDeleteBillDialog();
  };

  render() {
    if (this.props.loading || isEmpty(this.props.currentEvent)) {
      return <LinearProgress />;
    } else {
      const eventSummary = this.computeEventSummary(this.props.currentEvent);
      const dialogActions = {
        success: {
          title: "Yes",
          handler: this.onConfirmDelete
        },
        cancel: {
          title: "No",
          handler: this.closeDeleteBillDialog
        }
      };
      return (
        <React.Fragment>
          <Dialog
            open={this.state.displayDeleteConfirmation}
            closeDialogHandler={this.closeDeleteBillDialog}
            actions={dialogActions}
            title="Remove Bill"
          >
            Are you sure you want to remove this bill?
          </Dialog>
          <EventDetail event={this.props.currentEvent} />
          <EventSummary summary={eventSummary} />
          <EventBills
            billTransactions={this.props.currentEvent.billTransactions}
            onDeleteBill={this.onDeleteBill}
          />
        </React.Fragment>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    currentEvent: state.event.currentEvent,
    friends: state.friend.friends,
    loading: state.event.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetEvent: id => dispatch(actions.getEvent(id)),
    onDeleteBill: id => dispatch(actions.deleteBill(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Event);
