import React, { Component } from 'react';
import { Field, propTypes, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { translate } from 'ra-core';
import { emailValidate } from 'ra-loopback3';

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
  input: { ...inputProps }, // eslint-disable-line react/prop-types
  ...props
}) => <TextField error={!!(touched && error)} helperText={touched && error} {...inputProps} {...props} fullWidth />;

class ClientInformationInquiringForm extends Component {
  render() {
    const { classes, handleSubmit, isLoading } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className={classes.form}>
          <div className={classes.input}>
            <Field autoFocus name="credential" label="Registered email to get reset link" component={renderInput} />
          </div>
        </div>
        <CardActions>
          <Button variant="raised" type="submit" color="primary" disabled={isLoading} className={classes.button}>
            {isLoading && <CircularProgress size={25} thickness={2} />}
            SEND RESET LINK
          </Button>
        </CardActions>
      </form>
    );
  }
}

ClientInformationInquiringForm.propTypes = {
  ...propTypes,
};

const mapStateToProps = state => ({ isLoading: state.admin.loading > 0 });

const enhance = compose(
  withStyles(styles),
  translate,
  connect(mapStateToProps),
  reduxForm({
    form: 'clientInformationInquiry',
    validate: values => {
      const errors = {};
      const credential = values.credential;
      if (credential) {
        if (!emailValidate(credential)) {
          errors.credential = 'Invalid email';
        }
      } else {
        errors.credential = 'Must not empty';
      }

      return errors;
    },
  }),
);

export default enhance(ClientInformationInquiringForm);
