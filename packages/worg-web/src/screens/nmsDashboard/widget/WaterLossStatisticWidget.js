import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate, CUSTOM, withDataProvider } from 'ra-loopback3';
import { withTheme } from '@material-ui/core';
import moment from 'moment-timezone';
import _ from 'lodash';
import { WaterLossIcon } from '../../../styles/Icons';
import format from '../../../util/format';
import StatisticWidget from './StatisticWidget';
class WaterLossStatisticWidget extends Component {
  constructor(props) {
    super(props);
    const { translate } = props;
    this.state = {
      title: translate('generic.widgets.waterLoss'),
      subTitle: translate('generic.widgets.unitCalculate', { unit: translate('generic.units.flow') }),
      data: {
        lastMonth: { label: translate('generic.times.lastMonth'), value: null, status: 'normal' },
        thisYear: { label: translate('generic.times.thisYear'), value: null, status: 'normal' },
        lastYear: { label: translate('generic.times.lastYear'), value: null, status: 'normal' },
      },
    };
  }
  componentDidMount() {
    this.getData();
  }
  getData = async () => {
    let dmaId = null;
    let timeRangeLastMonth = {
      type: 'month',
      from: moment()
        .subtract(1, 'month')
        .startOf('month')
        .toDate(),
      to: moment()
        .subtract(1, 'month')
        .endOf('month')
        .toDate(),
    };
    let timeRangeThisYear = {
      type: 'month',
      from: moment()
        .startOf('year')
        .toDate(),
      to: moment()
        .endOf('year')
        .toDate(),
    };
    let timeRangeLastYear = {
      type: 'month',
      from: moment()
        .subtract(1, 'year')
        .startOf('year')
        .toDate(),
      to: moment()
        .subtract(1, 'year')
        .endOf('year')
        .toDate(),
    };
    let lastMonth = await this.load(dmaId, timeRangeLastMonth);
    let thisYear = await this.load(dmaId, timeRangeThisYear);
    let lastYear = await this.load(dmaId, timeRangeLastYear);

    const { data } = this.state;
    data.lastMonth.value = lastMonth;
    data.thisYear.value = thisYear;
    data.lastYear.value = lastYear;
    this.setState({ data });
  };

  load = async (dmaId, timeRange) => {
    // console.log(timeRange);
    let res;
    res = await this.props.dataProvider(CUSTOM, 'dmas/statisticQuantityByMonth', {
      query: { dmaId, timeRange: JSON.stringify(timeRange) },
    });
    if (res && res.data.length) {
      let sum = _.sumBy(res.data, 'leak');
      let val = format.formatWithDec(sum, 0, sum);
      // console.log('res: ', res, val);
      return val;
    }

    return null;
  };

  render() {
    return (
      <StatisticWidget
        iconStyle={{ backgroundColor: this.props.theme.palette.error.main }}
        icon={<WaterLossIcon />}
        {...this.state}
      />
    );
  }
}

WaterLossStatisticWidget.propTypes = {
  translate: PropTypes.func,
  theme: PropTypes.object,
  dataProvider: PropTypes.func,
};
const enhance = compose(translate, withDataProvider, withTheme);
export default enhance(WaterLossStatisticWidget);
