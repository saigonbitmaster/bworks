import React, { Component } from 'react';
import { CustomPage } from 'ra-loopback3';
class Dashboard extends Component {
  render() {
    return (
      <CustomPage title="generic.pages.dashboard" header={false}>
        <h1>Dashboard</h1>
      </CustomPage>
    );
  }
}

export default Dashboard;
