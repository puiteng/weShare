import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import styles from "./BillItemStyle";
import BillItemRow from "./BillItemRow";

import { ValidatorForm } from "react-material-ui-form-validator";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from "@material-ui/core";

import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import Card from "material-kit-react/components/Card/Card";
import CardHeader from "material-kit-react/components/Card/CardHeader";
import CardBody from "material-kit-react/components/Card/CardBody";

const BillItems = props => {
  const {
    classes,
    items,
    editingBillItemIndex,
    editingBillItem,
    onBillItemChange
  } = props;
  const isInEdidMode = editingBillItemIndex !== null;
  const existingBillItems = items.map((item, index) => {
    if (isInEdidMode && index === editingBillItemIndex) {
      return (
        <BillItemRow
          key={index}
          classes={classes}
          isEditMode
          form={editingBillItem}
          onBillItemChange={onBillItemChange}
        />
      );
    } else {
      return (
        <BillItemRow
          key={index}
          index={index}
          classes={classes}
          form={item}
          disabled={isInEdidMode}
          onEditingBillItemIndexChange={props.onEditingBillItemIndexChange}
          onDeleteItem={props.onDeleteItem}
        />
      );
    }
  });
  const tableBody = (
    <TableBody>
      {existingBillItems}
      {editingBillItemIndex == null ? (
        <BillItemRow
          classes={classes}
          isEditMode
          form={editingBillItem}
          onBillItemChange={onBillItemChange}
        />
      ) : null}
    </TableBody>
  );
  return (
    <div className={classes.section}>
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary" className={classes.cardHeader}>
                <h4>Items</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <ValidatorForm onSubmit={props.onSubmitBillItem}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell numeric>Quantity</TableCell>
                            <TableCell numeric>Amount</TableCell>
                            <TableCell />
                          </TableRow>
                        </TableHead>
                        {tableBody}
                      </Table>
                    </ValidatorForm>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <h4>Total Amount: {props.totalAmount}</h4>
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

BillItems.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BillItems);
