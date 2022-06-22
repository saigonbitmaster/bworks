import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Field, propTypes, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { translate } from 'ra-core';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { emailValidate, usernameValidate } from 'ra-loopback3';

const styles = () => ({
  form: {
    padding: '0 1em 1em 1em',
  },
  input: {
    marginTop: '1em',
  },
  button: {
    width: '100%',
  },
  resetPasswordLink: {
    marginBottom: '0',
    textAlign: 'right',
  },
});

const renderInput = ({
  meta: { touched, error } = {}, // eslint-disable-line react/prop-types
  input: inputProps, // eslint-disable-line react/prop-types
  ...props
}) => <TextField error={!!(touched && error)} helperText={touched && error} {...inputProps} {...props} fullWidth />;

class SummitForm extends Component {
  render() {
    const { classes, handleSubmit, isLoading } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className={classes.form}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Field autoFocus name="fullName" label="Full name" component={renderInput} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field autoFocus name="username" label="Username" component={renderInput} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field autoFocus name="email" label="Email" component={renderInput} />
            </Grid>
            <Grid item xs={6} sm={6}>
              <Field autoFocus name="password" label="Password" type="password" component={renderInput} />
            </Grid>
            <Grid item xs={6} sm={6}>
              <Field autoFocus name="repeatPassword" type="password" label="Repeate password" component={renderInput} />
            </Grid>
          </Grid>
        </div>
        <CardActions>
          <Button variant="raised" type="submit" color="primary" disabled={isLoading} className={classes.button}>
            {isLoading && <CircularProgress size={25} thickness={2} />}
            submit
          </Button>
        </CardActions>
      </form>
    );
  }
}

SummitForm.propTypes = {
  ...propTypes,
};

const mapStateToProps = state => ({ isLoading: state.admin.loading > 0 });

const enhance = compose(
  withStyles(styles),
  translate,
  connect(mapStateToProps),
  reduxForm({
    form: 'summitForm',
    validate: values => {
      const errors = {};
      const username = values.username;
      const email = values.email;
      const repeatPassword = values.repeatPassword;
      const password = values.password;
      username ? null : (errors.username = 'Must not empty');
      email ? null : (errors.email = 'Must not empty');
      emailValidate(email) ? null : (errors.email = 'Invalid email');
      usernameValidate(username) ? null : (errors.username = 'Invalid username');
      password ? null : (errors.password = 'Must not empty');
      repeatPassword ? null : (errors.repeatPassword = 'Must not empty');
      repeatPassword !== password ? (errors.repeatPassword = 'Passwords not match') : null;
      return errors;
    },
  }),
);

export default enhance(SummitForm);