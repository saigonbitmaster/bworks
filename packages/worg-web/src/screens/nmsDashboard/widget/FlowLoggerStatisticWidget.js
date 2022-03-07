import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import get from 'lodash/get';
import { translate, CUSTOM, withDataProvider } from 'ra-loopback3';
import { FlowLoggerIcon } from '../../../styles/Icons';
import StatisticWidget from './StatisticWidget';

class FlowLoggerStatisticWidget extends Component {
  constructor(props) {
    super(props);
    const { translate } = props;
    this.state = {
      title: translate('generic.widgets.flowLogger'),
      subTitle: translate('generic.widgets.unitCalculate', { unit: translate('generic.units.quantity') }),
      data: {
        warn: { label: translate('generic.warn'), value: null, status: 'low' },
        bad: { label: translate('generic.bad'), value: null, status: 'critical' },
        total: { label: translate('generic.total'), value: null, status: 'ok' },
      },
    };
  }
  async componentDidMount() {
    // get api to get data
    const { dataProvider } = this.props;
    const res = await dataProvider(CUSTOM, 'materialuses', { subUrl: 'summaryDataLogger', method: 'get' });
    if (res.data) {
      const { data } = this.state;
      data.warn.value = get(res.data, 'warn');
      data.bad.value = get(res.data, 'bad');
      data.total.value = get(res.data, 'total');
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
    return <StatisticWidget icon={<FlowLoggerIcon />} {...this.state} />;
  }
}

FlowLoggerStatisticWidget.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
};
const enhance = compose(translate, withDataProvider);
export default enhance(FlowLoggerStatisticWidget);
