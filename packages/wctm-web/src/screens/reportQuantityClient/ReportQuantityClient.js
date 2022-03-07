import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CustomPage, withTranslate } from 'ra-loopback3';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import ByGeo from './ByGeo';
import ByProvider from './ByProvider';

class ReportQuantityClient extends Component {
  state = {
    value: 0,
  };

  handleChangeTab = (_, value) => this.setState({ value });

  render() {
    const { value } = this.state;

    return (
      <CustomPage title={'generic.pages.reportDebtClient'} header={false}>
        <Paper style={{ marginBottom: 0, paddingBottom: 0 }}>
          <Tabs value={value} onChange={this.handleChangeTab}>
            <Tab label={this.props.translate('generic.report.titleReportDebtClientByGeo')} />
            <Tab label={this.props.translate('generic.report.titleReportDebtClientByProvider')} />
          </Tabs>
          {value === 0 && <ByGeo {...this.props} />}
          {value === 1 && <ByProvider {...this.props} />}
        </Paper>
      </CustomPage>
    );
  }
}
ReportQuantityClient.propTypes = {
  theme: PropTypes.object,
  translate: PropTypes.func,
};
ReportQuantityClient.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(connect(null, {}), withTranslate);

export default enhance(ReportQuantityClient);
