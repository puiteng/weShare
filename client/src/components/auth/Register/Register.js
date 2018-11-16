import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { registerUser } from "../../../actions/index";
import { withRouter } from "react-router-dom";
import styles from "../../../styles/formStyle";

class Register extends Component {
  constructor() {
    super();

    this.state = {
      form: {
        name: "",
        email: "",
        password: "",
        password2: ""
      }
    };
  }

  componentDidMount() {
    // custom rule will have name 'isPasswordMatch'
    ValidatorForm.addValidationRule("isPasswordMatch", value => {
      if (value !== this.state.form.password) {
        return false;
      }
      return true;
    });
  }

  handleChange = event => {
    const { form } = this.state;
    form[event.target.name] = event.target.value;
    this.setState({ form });
  };

  handleSubmit = event => {
    event.preventDefault();

    const newUser = {
      name: this.state.form.name,
      email: this.state.form.email,
      password: this.state.form.password
    };

    this.props.onRegisterUser(newUser, this.props.history);
  };

  render() {
    const { classes } = this.props;
    const { form } = this.state;
    let errorMsg = null;
    if (this.props.errors) {
      errorMsg = Object.keys(this.props.errors).map(function(key, index) {
        console.log(key);
        return (
          <Typography key={key} variant="body1" color="error">
            {this.props.errors[key]}{" "}
          </Typography>
        );
      }, this);
    }
    return (
      <React.Fragment>
        {this.props.progress.loading ? <LinearProgress /> : null}
        <ValidatorForm
          className={classes.container}
          onSubmit={this.handleSubmit}
        >
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Sign Up
          </Typography>
          <TextValidator
            className={classes.textField}
            label="Name"
            onChange={this.handleChange}
            name="name"
            fullWidth
            validators={["required", "minStringLength:3", "maxStringLength:30"]}
            errorMessages={[
              "this field is required",
              "must be within 3 and 30 characters.",
              "must be within 3 and 30 characters."
            ]}
            value={form.name}
            variant="outlined"
          />
          <TextValidator
            className={classes.textField}
            label="Email"
            onChange={this.handleChange}
            name="email"
            fullWidth
            validators={["required", "isEmail"]}
            errorMessages={["this field is required", "email is not valid"]}
            value={form.email}
            variant="outlined"
          />
          <TextValidator
            className={classes.textField}
            label="Password"
            onChange={this.handleChange}
            name="password"
            type="password"
            fullWidth
            validators={["required", "minStringLength:6", "maxStringLength:20"]}
            errorMessages={[
              "this field is required",
              "must be within 6 and 20 characters.",
              "must be within 6 and 20 characters."
            ]}
            value={form.password}
            variant="outlined"
          />
          <TextValidator
            className={classes.textField}
            label="Confirm Password"
            onChange={this.handleChange}
            name="password2"
            type="password"
            fullWidth
            validators={["isPasswordMatch", "required"]}
            errorMessages={["password mismatch", "this field is required"]}
            value={form.password2}
            variant="outlined"
          />
          <Button className={classes.dense} type="submit">
            Submit
          </Button>
          {errorMsg}
        </ValidatorForm>
      </React.Fragment>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  progress: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    errors: state.errors,
    progress: state.progress
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRegisterUser: (user, history) => dispatch(registerUser(user, history))
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(Register))
);
