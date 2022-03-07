import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { set } from 'lodash';
import { translate, withDataProvider, CUSTOM } from 'ra-loopback3';
import moment from 'moment-timezone';
import green from '@material-ui/core/colors/green';
import { RevenueIcon } from '../../../styles/Icons';
import StatisticWidget from './Widget';

class Revenue extends Component {
  constructor(props) {
    super(props);
    const { translate } = props;
    const month = moment()
      .subtract(1, 'month')
      .startOf('month');
    this.state = {
      month,
      title: translate('generic.widgets.revenue'),
      // subTitle: translate('generic.widgets.unitCalculate', { unit: translate('generic.units.flow') }),
      data: {
        lastMonth: {
          label: translate('generic.widgets.month', { month: month.format('MM') }),
          value: null,
          status: 'ok',
        },
        thisYear: { label: translate('generic.times.thisYear'), value: null, status: 'ok' },
        lastYear: { label: translate('generic.times.lastYear'), value: null, status: 'ok' },
      },
    };
  }
  componentDidMount() {
    const { data } = this.state;
    // prototype data
    this.props.dataProvider(CUSTOM, 'clients', { subUrl: 'widgetRevenue' }).then(res => {
      if (res.data) {
        Object.keys(res.data).map(key => {
          if (data[key]) {
            set(data, `${key}.value`, res.data[key]);
          }
        });
        this.setState({ data: { ...data } });
      }
    });
  }
  render() {
    return <StatisticWidget iconStyle={{ backgroundColor: green[500] }} icon={<RevenueIcon />} {...this.state} />;
  }
}

Revenue.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
};
const enhance = compose(translate, withDataProvider);
export default enhance(Revenue);
