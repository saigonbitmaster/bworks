import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import get from 'lodash/get';
import { translate, withDataProvider, CUSTOM } from 'ra-loopback3';
import green from '@material-ui/core/colors/green';
import { QuantityIcon } from '../../../styles/Icons';
import format from '../../../util/format';
import StatisticWidget from './StatisticWidget';

class QuantityStatisticWidget extends Component {
  constructor(props) {
    super(props);
    const { translate } = props;
    this.state = {
      title: translate('generic.widgets.quantity'),
      subTitle: translate('generic.widgets.unitCalculate', { unit: translate('generic.units.flow') }),
      data: {
        today: { label: translate('generic.times.today'), value: null, status: 'ok' },
        yesterday: { label: translate('generic.times.yesterday'), value: null, status: 'low' },
        thisMonth: { label: translate('generic.times.thisMonth'), value: null, status: 'ok' },
      },
    };
  }
  async componentDidMount() {
    // get api to get data
    const { dataProvider } = this.props;
    const res = await dataProvider(CUSTOM, 'dmas', { subUrl: 'summaryQuantity', method: 'get' });
    if (res.data) {
      const { data } = this.state;
      let toDay = get(res.data, 'today');
      let yesterday = get(res.data, 'yesterday');
      let thisMonth = get(res.data, 'thisMonth');

      data.today.value = format.formatWithDec(toDay, 0, toDay);
      data.yesterday.value = format.formatWithDec(yesterday, 0, yesterday);
      data.thisMonth.value = format.formatWithDec(thisMonth, 0, thisMonth);
      this.safeSetState(data);
    }
  }
  safeSetState = state => {
    if (!this.unmount) this.setState(state);
  };
  componentWillUnmount() {
    this.unmount = true;
  }
  render() {
    return <StatisticWidget iconStyle={{ backgroundColor: green[500] }} icon={<QuantityIcon />} {...this.state} />;
  }
}

QuantityStatisticWidget.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
};
const enhance = compose(translate, withDataProvider);
export default enhance(QuantityStatisticWidget);
