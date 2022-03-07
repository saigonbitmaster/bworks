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
  resetPasswordLink: {
    marginBottom: '0',
    textAlign: 'right',
  },
});

const renderNormalInput = ({
  meta: { touched, error } = {}, // eslint-disable-line react/prop-types
  input: { ...inputProps }, // eslint-disable-line react/prop-types
  ...props
}) => <TextField error={!!(touched && error)} helperText={touched && error} {...inputProps} {...props} fullWidth />;

// const renderPasswordInput = ({
//   meta: { touched, error } = {}, // eslint-disable-line react/prop-types
//   input: { ...inputProps }, // eslint-disable-line react/prop-types
//   ...props
// }) => (
//   <TextField
//     error={!!(touched && error)}
//     type="password"
//     helperText={touched && error}
//     {...inputProps}
//     {...props}
//     fullWidth
//   />
// );

class RegistrationForm extends Component {
  render() {
    const { classes, handleSubmit, isLoading } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className={classes.form}>
          <Typography component="p">
            Xin hãy nhập tên tài khoản hoặc email để đăng ký tài khoản của bạn. Chúng tôi sẽ gửi 1 đường dẫn để tạo mật
            khẩu mới
          </Typography>
          <div className={classes.input}>
            <Field autoFocus name="code" label="Mã Khách hàng" component={renderNormalInput} />
          </div>
          <div className={classes.input}>
            <Field autoFocus name="email" label="Email" component={renderNormalInput} />
          </div>
        </div>
        <CardActions>
          <Button variant="raised" type="submit" color="primary" disabled={isLoading} className={classes.button}>
            {isLoading && <CircularProgress size={25} thickness={2} />}
            Tiếp tục
          </Button>
        </CardActions>
      </form>
    );
  }
}

RegistrationForm.propTypes = {
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
      const { code, email } = values;

      if (!email) {
        errors.email = 'Bắt buộc';
      }
      if (email) {
        // User entered his/her email
        if (!email.includes('@') || !email.match(/^\w+@(?:[a-z]+\.)+[a-z]+$/)) {
          errors.email = 'Email không hợp lệ';
        }
      }

      if (!code) {
        errors.code = 'Bắt buộc';
      } else {
        if (!code.match(/^\w+$/)) {
          // User entered non-alphanumeric entities
          errors.code = 'Mã KH không hợp lệ';
        }
      }

      // if (!password) {
      //   errors.password = 'Bắt buộc';
      // } else {
      //   if (!password.match(/^[a-zA-Z0-9_]+$/)) {
      //     errors.password = 'Mật khẩu không hợp lệ';
      //   }
      // }

      // if (!reconfirmedPassword) {
      //   errors.reconfirmedPassword = 'Bắt buộc';
      // } else {
      //   if (password !== reconfirmedPassword) {
      //     errors.reconfirmedPassword = 'Mật khẩu không được xác nhận chính xác';
      //   }
      // }

      return errors;
    },
  }),
);

export default enhance(RegistrationForm);
