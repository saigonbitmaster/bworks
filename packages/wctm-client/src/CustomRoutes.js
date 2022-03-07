import React from 'react';
import { Route } from 'react-router-dom';
import { CreateNewPasswordPage, RecoveryEmailResultPage, ClientInformationInquiringPage } from 'ra-loopback3';
import config from './Config';
import RegistrationPage from './resources/login/RegistrationPage';
import RegistrationResultPage from './resources/login/RegistrationResultPage';

export default [
  <Route exact path="/registerNewClientUser" component={() => <RegistrationPage />} key={1} noLayout />,
  <Route
    exact
    path="/registrationResult"
    component={props => <RegistrationResultPage {...props} />}
    key={2}
    noLayout
  />,
  <Route
    exact
    path="/resetPassword"
    component={() => <ClientInformationInquiringPage model="ClientUser" projectKey={config.projectKey} />}
    key={1}
    noLayout
  />,
  <Route
    exact
    path="/resetPasswordEmailSentResult"
    component={props => <RecoveryEmailResultPage {...props} />}
    key={3}
    noLayout
  />,
  <Route
    exact
    path="/createNewPassword"
    component={() => <CreateNewPasswordPage pluralizedModel="ClientUsers" method="reset-password" />}
    key={5}
    noLayout
  />,
  <Route
    exact
    path="/createNewPasswordForNewAccount"
    component={() => (
      <CreateNewPasswordPage
        model="ClientUsers"
        method="setPasswordToNewAccount"
        pluralizedModel="ClientUsers"
        extraArgsToBody={{ requestSignature: window.location.href.match('requestToken=(.*)&')[1] }}
      />
    )}
    key={6}
    noLayout
  />,
];
