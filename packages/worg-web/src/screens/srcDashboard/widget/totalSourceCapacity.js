import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate, withDataProvider, CUSTOM } from 'ra-loopback3';
import green from '@material-ui/core/colors/green';
import { QuantityIcon } from '../../../styles/Icons';
import StatisticWidget from './StatisticWidget';

class TotalSourceCapacity extends Component {
  constructor(props) {
    super(props);
    const { translate } = props;
    this.state = {
      title: translate('generic.widgets.quantityCapacity.designedCapacity'),
      subTitle: translate('generic.widgets.unitCalculate', { unit: translate('generic.units.flow') }),
      data: {
        day: { label: translate('generic.widgets.quantityCapacity.dailyCapacity'), value: null, status: 'ok' },
        month: { label: translate('generic.widgets.quantityCapacity.monthlyCapacity'), value: null, status: 'low' },
        year: { label: translate('generic.widgets.quantityCapacity.yearlyCapacity'), value: null, status: 'ok' },
      },
    };
  }

  dashboardData = () => {
    this.props
      .dataProvider(CUSTOM, 'WaterSources', {
        subUrl: 'dashboard',
        method: 'get',
        query: { mode: 'widget' },
      })
      .then(res => {
        let totalDailyCapacity = res.data.filter(item => item.id == 'totalDailyCapacity')[0].value;
        let totalMonthlyCapacity = res.data.filter(item => item.id == 'totalMonthlyCapacity')[0].value;
        let totalYearlyCapacity = res.data.filter(item => item.id == 'totalYearlyCapacity')[0].value;
        let data = Object.assign({}, this.state.data);
        data.day.value = totalDailyCapacity;
        data.month.value = totalMonthlyCapacity;
        data.year.value = totalYearlyCapacity;
        this.setState(data);
      });
  };

  componentDidMount() {
    this.dashboardData();
  }
  render() {
    return <StatisticWidget iconStyle={{ backgroundColor: green[500] }} icon={<QuantityIcon />} {...this.state} />;
  }
}

TotalSourceCapacity.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.any,
};
const enhance = compose(translate, withDataProvider);
export default enhance(TotalSourceCapacity);
