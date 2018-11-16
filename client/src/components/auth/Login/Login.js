import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import * as actions from "../../../actions/index";

import withStyles from "@material-ui/core/styles/withStyles";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import Card from "material-kit-react/components/Card/Card";
import CardHeader from "material-kit-react/components/Card/CardHeader";
import CardBody from "material-kit-react/components/Card/CardBody";
import CardFooter from "material-kit-react/components/Card/CardFooter";
import Button from "material-kit-react/components/CustomButtons/Button";
import loginStyle from "./LoginStyle";

class Login extends Component {
  constructor() {
    super();

    this.state = {
      form: {
        email: "",
        password: ""
      }
    };
  }
  componentDidMount() {
    if (this.props.auth && this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }
  handleChange = event => {
    const { form } = this.state;
    form[event.target.name] = event.target.value;
    this.setState({ form });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.onLogin(this.state.form, this.props.history);
  };

  render() {
    const { classes } = this.props;
    const { form } = this.state;
    return (
      <div className={classes.section}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card>
                <ValidatorForm
                  className={classes.form}
                  onSubmit={this.handleSubmit}
                >
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>Login</h4>
                  </CardHeader>
                  <CardBody>
                    <TextValidator
                      className={classes.textField}
                      label="Email"
                      onChange={this.handleChange}
                      name="email"
                      fullWidth
                      validators={["required", "isEmail"]}
                      errorMessages={[
                        "this field is required",
                        "email is not valid"
                      ]}
                      value={form.email}
                    />
                    <TextValidator
                      className={classes.textField}
                      label="Password"
                      onChange={this.handleChange}
                      name="password"
                      type="password"
                      fullWidth
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                      value={form.password}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button simple color="primary" size="lg" type="submit">
                      Submit
                    </Button>
                  </CardFooter>
                </ValidatorForm>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}
Login.propTypes = {
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
    onLogin: (userData, history) =>
      dispatch(actions.loginUser(userData, history))
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(loginStyle)(Login))
);
