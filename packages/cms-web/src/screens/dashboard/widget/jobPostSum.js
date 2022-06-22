import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate, withDataProvider, CUSTOM } from 'ra-loopback3';
import { withTheme } from '@material-ui/core';
import { ReportVolumeIcon } from '../../../styles/Icons';
import StatisticWidget from './StatisticWidget';

class JobPostSum extends Component {
  constructor(props) {
    super(props);
  
  }


  componentDidMount() {
  }
  render() {
    const { translate } = this.props;
    let state = {
      title: translate('generic.emp.widget.jobPost'),
      
      data: {
        today: { label: translate('generic.emp.widget.total'), value: 2630000, status: 'normal' },
        lastMonth: { label: translate('generic.emp.widget.bidJobs'), value: 6300000, status: 'normal' },
        thisYear: { label: translate('generic.emp.widget.contractedJobs'), value: 150000, status: 'normal' },
      },
    };
    return (
      <StatisticWidget
        iconStyle={{ backgroundColor: this.props.theme.palette.error.main }}
        icon={<ReportVolumeIcon />}
        {...state}
      />
    );
  }
}

JobPostSum.propTypes = {
  translate: PropTypes.func,
  theme: PropTypes.object,
  dataProvider: PropTypes.any,
};
const enhance = compose(translate, withTheme, withDataProvider);
export default enhance(JobPostSum);
