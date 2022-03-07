import React from 'react';
import { SaveButton, Toolbar } from 'ra-loopback3';

const CompleteRequestToolbar = props => (
  <Toolbar {...props}>
    <SaveButton label="generic.complete" />
  </Toolbar>
);

export default CompleteRequestToolbar;
