import React from 'react';
import { Route } from 'react-router-dom';
import { PasswordRecoveryPage, SetPassword, SubmitPage } from 'web-common';
import config from './Config';


export default [
  <Route
    exact
    path="/submitAccount"
    component={() => <SubmitPage model="AppUser" projectKey={config.projectKey} />}
    key={1}
    noLayout
  />,
  <Route
    exact
    path="/resetPassword"
    component={props => <PasswordRecoveryPage {...props} />}
    key={2}
    noLayout
  />,
  <Route
    exact
    path="/setPassword"
    component={props => <SetPassword {...props} />}
    key={2}
    noLayout
  />,
];
