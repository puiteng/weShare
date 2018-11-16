import React from "react";
import Dialog from "@material-ui/core/Dialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import classes from "./Spinner.css";

const Spinner = props => {
  return (
    <Dialog
      open={true}
      style={{
        width: "200px",
        marginLeft: "40%",
        backgroundColor: "transparent"
      }}
      overlayStyle={{ backgroundColor: "transparent" }}
      title="Loading"
      titleStyle={{
        paddingTop: "0px",
        paddingLeft: "45px",
        fontSize: "15px",
        lineHeight: "40px"
      }}
    >
      <CircularProgress size={30} />
    </Dialog>
  );
};

export default Spinner;
