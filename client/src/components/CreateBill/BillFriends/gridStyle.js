const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  paper: {
    width: "80%",
    margin: "10px",
    display: "flex",
    overflow: "hidden",
    padding: "5px"
  },
  gridList: {
    flexWrap: "nowrap",
    transform: "translateZ(0)",
    width: 500
  },
  gridListTile: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    cursor: "pointer"
  },
  title: {
    color: "white"
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)"
  }
});

export default styles;
