import React from 'react';
import { Route } from 'react-router';
import ImportMatStock from './screens/manageMat/ImportMatStock';
import ExportMatStock from './screens/manageMat/ExportMatStock';
export default [
  <Route key="manageMaterial/import" path="/manageMaterial/import" component={ImportMatStock} />,
  <Route key="manageMaterial/export" path="/manageMaterial/export" component={ExportMatStock} />,
  <Route key="manageMaterial/print" path="/manageMaterial/print" />,
];
