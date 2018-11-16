import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import styles from "./EventDetailsStyle";

import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import Card from "material-kit-react/components/Card/Card";
import CardHeader from "material-kit-react/components/Card/CardHeader";
import CardBody from "material-kit-react/components/Card/CardBody";
import {
  GridList,
  GridListTile,
  GridListTileBar,
  Toolbar,
  IconButton
} from "@material-ui/core";
import Avatar from "../../layout/Avatar/Avatar";
import EditIcon from "@material-ui/icons/Edit";

const EventDetails = props => {
  const onEditEventDetails = () => {
    props.history.push("/EditEvent");
  };
  const classes = props.classes;
  const gridCol = window.innerWidth <= 800 ? 3 : 5;
  const friendContent = props.event.friends.map(friend => (
    <GridListTile key={friend._id} classes={{ tile: classes.gridListTile }}>
      <Avatar
        backgroundColor={friend.avatar.backgroundColor}
        colorNumber={friend.avatar.colorNumber}
      >
        {friend.avatar.text}
      </Avatar>
      <GridListTileBar
        title={friend.name}
        classes={{
          root: classes.titleBar,
          title: classes.title
        }}
      />
    </GridListTile>
  ));
  return (
    <div className={classes.section}>
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary" className={classes.cardHeader}>
                <h4>Details</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <Toolbar className={classes.toolbar}>
                      <h4>{props.event.name}</h4>
                      <IconButton onClick={onEditEventDetails}>
                        <EditIcon />
                      </IconButton>
                    </Toolbar>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={6}>
                    From:
                    {props.event.startDate.toString().substring(0, 10)}
                  </GridItem>
                  <GridItem xs={12} sm={6} md={6}>
                    To:
                    {props.event.endDate.toString().substring(0, 10)}
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <GridList
                      className={classes.gridList}
                      cols={gridCol}
                      cellHeight={100}
                    >
                      {friendContent}
                    </GridList>
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

EventDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
  friendList: PropTypes.array
};

export default withRouter(withStyles(styles)(EventDetails));
