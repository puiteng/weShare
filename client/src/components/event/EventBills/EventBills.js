import React from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import styles from "./EventBillsStyle";

import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import Card from "material-kit-react/components/Card/Card";
import CardHeader from "material-kit-react/components/Card/CardHeader";
import CardBody from "material-kit-react/components/Card/CardBody";
import AddIcon from "@material-ui/icons/Add";
import { Toolbar, IconButton } from "@material-ui/core";

import Bill from "./Bill/Bill";

const EventBills = props => {
  const onAddBill = () => {
    props.history.push("/AddBill/" + props.match.params.id);
  };
  const onEdit = id => {
    props.history.push("/EditBill/" + id);
  };
  const classes = props.classes;
  let bills = null;
  if (props.billTransactions) {
    bills = props.billTransactions.map((billTransaction, index) => (
      <Bill
        key={index}
        billTransaction={billTransaction}
        onEdit={() => onEdit(billTransaction.billId)}
        onDeleteBill={props.onDeleteBill}
      />
    ));
  }
  return (
    <div className={classes.section}>
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary" className={classes.cardHeader}>
                <h4>Bills</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <Toolbar className={classes.toolbar}>
                      <IconButton onClick={onAddBill}>
                        <AddIcon />
                      </IconButton>
                    </Toolbar>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    {bills}
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
};

EventBills.propTypes = {
  classes: PropTypes.object.isRequired,
  onDeleteBill: PropTypes.func.isRequired
};

export default withRouter(withStyles(styles)(EventBills));
