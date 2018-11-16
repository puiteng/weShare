import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";

import * as actions from "../../../actions/index";

import eventStyles from "./EventsStyle";

import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import Card from "material-kit-react/components/Card/Card";
import CardHeader from "material-kit-react/components/Card/CardHeader";
import CardBody from "material-kit-react/components/Card/CardBody";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "../../layout/Dialog/Dialog";
import { withStyles } from "@material-ui/core/styles";
import isEmpty from "../../../validation/is_empty";

class Events extends Component {
  state = {
    selectedEventId: null,
    displayDeleteConfirmation: false
  };
  componentDidMount() {
    if (isEmpty(this.props.events)) this.props.onGetEvents();
  }
  onAddEvent = () => {
    this.props.history.push("/AddEvent");
  };
  onEventClick = id => {
    this.props.history.push("/event/" + id);
  };
  onDeleteEvent = id => {
    this.setState({ selectedEventId: id, displayDeleteConfirmation: true });
  };
  closeDeleteConfirmation = () => {
    this.setState({ selectedEventId: null, displayDeleteConfirmation: false });
  };
  onConfirmDelete = () => {
    this.props.onDeleteEvent(this.state.selectedEventId);
    this.closeDeleteConfirmation();
  };
  render() {
    const classes = this.props.classes;
    if (this.props.loading) {
      return (
        <div className={classes.section}>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={8}>
                <Card>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>Events</h4>
                  </CardHeader>
                  <CardBody>
                    <LinearProgress />
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      );
    } else {
      let eventList = null;
      if (this.props.events) {
        eventList = this.props.events.map(event => (
          <TableRow className={classes.tableRow} hover key={event._id}>
            <TableCell onClick={() => this.onEventClick(event._id)}>
              {event.name}
            </TableCell>
            <TableCell onClick={() => this.onEventClick(event._id)}>
              {event.startDate}
            </TableCell>
            <TableCell onClick={() => this.onEventClick(event._id)}>
              {event.endDate}
            </TableCell>
            <TableCell padding="checkbox">
              <IconButton onClick={() => this.onDeleteEvent(event._id)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ));
      }
      const dialogActions = {
        success: {
          title: "Yes",
          handler: this.onConfirmDelete
        },
        cancel: {
          title: "No",
          handler: this.closeDeleteConfirmation
        }
      };
      return (
        <React.Fragment>
          <Dialog
            open={this.state.displayDeleteConfirmation}
            closeDialogHandler={this.closeDeleteBillDialog}
            actions={dialogActions}
            title="Delete Event"
          >
            Are you sure you want to delete this event?
          </Dialog>
          <div className={classes.section}>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={8}>
                  <Card>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>Events</h4>
                    </CardHeader>
                    <CardBody>
                      <Button
                        variant="fab"
                        color="primary"
                        aria-label="Add"
                        onClick={this.onAddEvent}
                      >
                        <AddIcon />
                      </Button>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell />
                          </TableRow>
                        </TableHead>
                        <TableBody>{eventList}</TableBody>
                      </Table>
                    </CardBody>
                  </Card>
                </GridItem>
              </GridContainer>
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
}

Events.propTypes = {
  classes: PropTypes.object.isRequired,
  events: PropTypes.array,
  onGetEvents: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    events: state.event.events,
    loading: state.event.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetEvents: () => dispatch(actions.getEventByUser()),
    onDeleteEvent: id => dispatch(actions.deleteEvent(id))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(eventStyles)(Events))
);
