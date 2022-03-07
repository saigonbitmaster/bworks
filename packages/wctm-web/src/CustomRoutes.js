import React from 'react';
import { Route } from 'react-router-dom';
import { ClientInformationInquiringPage, RecoveryEmailResultPage, CreateNewPasswordPage } from 'ra-loopback3';
import config from './Config';

export default [
  <Route
    exact
    path="/resetPassword"
    component={() => <ClientInformationInquiringPage model="AppUser" projectKey={config.projectKey} />}
    key={1}
    noLayout
  />,
  <Route
    exact
    path="/resetPasswordEmailSentResult"
    component={props => <RecoveryEmailResultPage {...props} />}
    key={2}
    noLayout
  />,
  <Route
    exact
    path="/createNewPassword"
    component={() => <CreateNewPasswordPage pluralizedModel="AppUsers" method="reset-password" />}
    key={3}
    noLayout
  />,
];
