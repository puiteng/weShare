const styles = theme => ({
  container: {
    width: 500,
    margin: "20px auto",
    display: "flex",
    flexWrap: "wrap",
    boxSizing: "border-box",
    flexDirection: "column",
    textAlign: "center"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: 10
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  }
});

export default styles;
