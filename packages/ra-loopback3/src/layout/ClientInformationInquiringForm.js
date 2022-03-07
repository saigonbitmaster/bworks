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
          <Typography component="p">
            Xin hãy nhập tên tài khoản hoặc email được dùng để đăng ký tài khoản của bạn. Chúng tôi sẽ gửi 1 đường dẫn
            để tạo mật khẩu mới
          </Typography>
          <div className={classes.input}>
            <Field autoFocus name="credential" label="Thông tin tài khoản" component={renderInput} />
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
        if (credential.includes('@')) {
          // User entered his/her email
          if (!credential.match(/^\w+@(?:[a-z]+\.)+[a-z]+$/)) {
            errors.credential = 'Email không hợp lệ';
          }
        } else if (!credential.match(/^\w+$/)) {
          // User entered non-alphanumeric entities
          errors.credential = 'Tên tài khoản không hợp lệ';
        }
      } else {
        errors.credential = 'Bắt buộc';
      }

      return errors;
    },
  }),
);

export default enhance(ClientInformationInquiringForm);
