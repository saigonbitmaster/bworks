import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate, withDataProvider, CUSTOM } from 'ra-loopback3';
import { withTheme } from '@material-ui/core';
import moment from 'moment-timezone';
import { ReportVolumeIcon } from '../../../styles/Icons';
import StatisticWidget from './StatisticWidget';

class WaterSourceSummary extends Component {
  constructor(props) {
    super(props);
    const { translate } = props;
    const waterSourceCount = 0;
    this.state = {
      title: `${translate('generic.widgets.waterSourceSummary.waterSource')} (${waterSourceCount || '...'})`,
      subTitle: translate('generic.widgets.unitCalculate', { unit: translate('generic.units.flow') }),
      waterSourceCount,
      data: {
        today: { label: translate('generic.quantityDay'), value: '...', status: 'normal' },
        lastMonth: {
          label: translate('generic.quantityMonth'),
          value: '...',
          status: 'normal',
        },
        thisYear: { label: translate('generic.quantityYear'), value: '...', status: 'normal' },
      },
    };
  }

  getData = () => {
    const { dataProvider, translate } = this.props;
    dataProvider(CUSTOM, 'WaterSources', {
      subUrl: 'dashboard',
      method: 'get',
      query: { mode: 'widget' },
    }).then(res => {
      const count = res.data.filter(item => item.id == 'waterSourceCount')[0].value;
      const title = `${translate('generic.widgets.waterSourceSummary.waterSource')} (${count || '...'})`;
      let todayValue = res.data.filter(item => item.id == 'totalDailyCapacity')[0].value;
      let lastMonthValue = res.data.filter(item => item.id == 'totalMonthlyCapacity')[0].value;
      let thisYearValue = res.data.filter(item => item.id == 'totalYearlyCapacity')[0].value;
      let data = Object.assign({}, this.state.data);
      data.today.value = todayValue;
      data.lastMonth.value = lastMonthValue;
      data.thisYear.value = thisYearValue;
      this.setState({ data, title });
    });
  };

  componentDidMount() {
    this.getData();
  }
  render() {
    const { data } = this.state;

    // hardcode
    data.lastMonth.value = data.lastMonth.value || 420179;

    return (
      <StatisticWidget
        iconStyle={{ backgroundColor: this.props.theme.palette.primary }}
        icon={<ReportVolumeIcon />}
        {...this.state}
      />
    );
  }
}

WaterSourceSummary.propTypes = {
  translate: PropTypes.func,
  theme: PropTypes.object,
  dataProvider: PropTypes.any,
};
const enhance = compose(translate, withTheme, withDataProvider);
export default enhance(WaterSourceSummary);
