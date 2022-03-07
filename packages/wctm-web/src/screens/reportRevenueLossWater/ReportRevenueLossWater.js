import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CustomPage, withTranslate } from 'ra-loopback3';
import { Tabs, Tab, Paper } from '@material-ui/core';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import WaterLoss from './WaterLoss';
import RevenueLoss from './RevenueLoss';

class ReportRevenueLossWater extends Component {
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
            <Tab label={this.props.translate('generic.report.titleReportWaterLoss')} />
            <Tab label={this.props.translate('generic.report.titleReportRevenueLoss')} />
          </Tabs>
          {value === 0 && <WaterLoss {...this.props} />}
          {value === 1 && <RevenueLoss {...this.props} />}
        </Paper>
      </CustomPage>
    );
  }
}
ReportRevenueLossWater.propTypes = {
  theme: PropTypes.object,
  translate: PropTypes.func,
};
ReportRevenueLossWater.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(connect(null, {}), withTranslate);

export default enhance(ReportRevenueLossWater);
