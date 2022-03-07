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
});

const renderInput = ({
  meta: { touched, error } = {}, // eslint-disable-line react/prop-types
  input: { ...inputProps }, // eslint-disable-line react/prop-types
  ...props
}) => (
  <TextField
    error={!!(touched && error)}
    type="password"
    helperText={touched && error}
    {...inputProps}
    {...props}
    fullWidth
  />
);

class CreateNewPasswordForm extends Component {
  render() {
    const { classes, handleSubmit, isLoading } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className={classes.form}>
          <Typography component="p">Xin hãy tạo mật khẩu mới và xác nhận</Typography>
          <div className={classes.input}>
            <Field autoFocus name="newPassword" label="Mật khẩu mới" component={renderInput} />
          </div>
          <div className={classes.input}>
            <Field name="reconfirmedNewPassword" label="Xác nhận mật khẩu mới" component={renderInput} />
          </div>
        </div>
        <CardActions>
          <Button variant="raised" type="submit" color="primary" disabled={isLoading} className={classes.button}>
            {isLoading && <CircularProgress size={25} thickness={2} />}
            Tạo
          </Button>
        </CardActions>
      </form>
    );
  }
}

CreateNewPasswordForm.propTypes = {
  ...propTypes,
};

const mapStateToProps = state => ({ isLoading: state.admin.loading > 0 });

const enhance = compose(
  withStyles(styles),
  translate,
  connect(mapStateToProps),
  reduxForm({
    form: 'formCreateNewPassword',
    validate: values => {
      const errors = {};
      if (!values.newPassword) {
        errors.newPassword = 'Bắt buộc';
      } else {
        if (!values.newPassword.match(/^[a-zA-Z0-9_]+$/)) {
          errors.newPassword = 'Mật khẩu không hợp lệ';
        }
      }

      if (!values.reconfirmedNewPassword) {
        errors.reconfirmedNewPassword = 'Bắt buộc';
      } else {
        if (values.newPassword !== values.reconfirmedNewPassword) {
          errors.reconfirmedNewPassword = 'Mật khẩu không được xác nhận chính xác';
        }
      }
      return errors;
    },
  }),
);

export default enhance(CreateNewPasswordForm);
