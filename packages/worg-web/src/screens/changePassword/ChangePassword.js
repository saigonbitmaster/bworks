import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CUSTOM, required, TextInput, translate, Create, withDataProvider, FlexForm, minLength } from 'ra-loopback3';
import { withTheme } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { reset } from 'redux-form';

const validatePassword = (translate, values) => {
  // console.log('validatePassword', values);
  // let strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
  let mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))');
  const errors = {};
  let { newPassword, confirmPassword } = values;
  let tmpNew = newPassword ? newPassword.toLowerCase() : '';
  if (!mediumRegex.test(tmpNew)) {
    errors.newPassword = [translate('resources.appusers.messages.errorNewPassword')];
  }
  let tmpConfirm = confirmPassword ? confirmPassword.toLowerCase() : '';
  if (tmpNew !== tmpConfirm) {
    errors.confirmPassword = [translate('resources.appusers.messages.errorConfirmPassword')];
  }
  return errors;
};
class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }
  save = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    // console.log('save', record, defaultOnSuccess, defaultOnFailure);
    this.props
      .dataProvider(
        CUSTOM,
        'appusers',
        {
          method: 'POST',
          subUrl: 'change-password',
          body: {
            oldPassword: record.currentPassword,
            newPassword: record.newPassword,
          },
        },
        {
          notification: { body: 'resources.appusers.messages.passwordUpdated', level: 'info' },
          // reset form
          callback: () => this.props.reset(this.formRef.current.props.form),
        },
        defaultOnFailure,
      )
      // eslint-disable-next-line
      .catch(e => {
        // console.log('error', e);
      });
  };
  render() {
    const { translate, dataProvider, reset, ...rest } = this.props;
    return (
      <Create save={this.save} resource="appusers" {...rest} hasList={false}>
        <FlexForm
          style={{ flexGrow: 1 }}
          spacing={2}
          formRef={this.formRef}
          validate={values => validatePassword(translate, values)}
        >
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={12}>
              <TextInput source="currentPassword" type="password" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <TextInput source="newPassword" type="password" validate={[required(), minLength(6)]} />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <TextInput source="confirmPassword" type="password" validate={[required()]} />
            </Grid>
          </Grid>
        </FlexForm>
      </Create>
    );
  }
}
ChangePassword.propTypes = {
  theme: PropTypes.object,
  translate: PropTypes.func,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
};
ChangePassword.detaultProps = {
  hasList: false,
  hasShow: false,
  hasCreate: false,
  hasEdit: false,
};
// eslint-disable-next-line
  const mapStateToProps = state => {
  return {};
};
const enhance = compose(withDataProvider, connect(mapStateToProps, { reset }), withTheme, translate);

export default enhance(ChangePassword);
