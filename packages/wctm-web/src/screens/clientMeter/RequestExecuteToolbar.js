import React from 'react';
import { SaveButton, Toolbar } from 'ra-loopback3';

const RequestExecuteToolbar = props => (
  <Toolbar {...props}>
    <SaveButton label="generic.executeRequest" />
  </Toolbar>
);

export default RequestExecuteToolbar;
