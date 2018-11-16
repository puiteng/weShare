import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import styles from "./EventSummaryStyle";
import Avatar from "../../layout/Avatar/Avatar";

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

const EventSummary = props => {
  const classes = props.classes;
  const transactionContent = props.summary.eventTransactions.map(
    transaction => (
      <TableRow key={transaction.friend._id}>
        <TableCell>
          <Avatar
            backgroundColor={transaction.friend.avatar.backgroundColor}
            colorNumber={transaction.friend.avatar.colorNumber}
          >
            {transaction.friend.avatar.text}
          </Avatar>
        </TableCell>
        <TableCell
          className={
            transaction.amount > 0
              ? classes.tableCell
              : classes.tableCellNegative
          }
        >
          {transaction.amount}
        </TableCell>
      </TableRow>
    )
  );
  return (
    <React.Fragment>
      <div className={classes.section}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={8}>
              <Card>
                <CardHeader color="primary" className={classes.cardHeader}>
                  <h4>Summary</h4>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <h4>Total Spent: {props.summary.totalSpent}</h4>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                      <h4>Bills: {props.summary.totalBill}</h4>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Friend</TableCell>
                            <TableCell>Amount Spent</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>{transactionContent}</TableBody>
                      </Table>
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </React.Fragment>
  );
};

EventSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  summary: PropTypes.object.isRequired
};

export default withStyles(styles)(EventSummary);
