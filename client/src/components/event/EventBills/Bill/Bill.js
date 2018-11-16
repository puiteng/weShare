import React from "react";
import PropTypes from "prop-types";
import Avatar from "../../../layout/Avatar/Avatar";
import {
  GridList,
  GridListTile,
  GridListTileBar,
  Toolbar,
  IconButton
} from "@material-ui/core";
import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import styles from "./BillStyle";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const Bill = props => {
  const { classes, billTransaction } = props;
  const gridCol = window.innerWidth <= 800 ? 3 : 5;
  const content = billTransaction.transactions.map(transaction => (
    <GridListTile
      key={transaction.friend._id}
      classes={{ tile: classes.gridListTile }}
    >
      <Avatar
        backgroundColor={transaction.friend.avatar.backgroundColor}
        colorNumber={transaction.friend.avatar.colorNumber}
      >
        {transaction.friend.avatar.text}
      </Avatar>
      <GridListTileBar
        title={transaction.amount}
        classes={{
          root: classes.titleBar,
          title: classes.title
        }}
      />
    </GridListTile>
  ));

  const itemContent = billTransaction.items.map(item => (
    <TableRow key={item._id}>
      <TableCell>{item.description}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>{item.amount}</TableCell>
    </TableRow>
  ));
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <h4>{billTransaction.description}</h4>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Toolbar className={classes.toolbar}>
              <h4>Total Spent: {billTransaction.totalAmount}</h4>
              <div>
                <IconButton onClick={props.onEdit}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => props.onDeleteBill(billTransaction.billId)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </Toolbar>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <GridList
              className={classes.gridList}
              cols={gridCol}
              cellHeight={100}
            >
              {content}
            </GridList>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <h4>Items</h4>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{itemContent}</TableBody>
            </Table>
          </GridItem>
        </GridContainer>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

Bill.propTypes = {
  classes: PropTypes.object.isRequired,
  billTransaction: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default withStyles(styles)(Bill);
