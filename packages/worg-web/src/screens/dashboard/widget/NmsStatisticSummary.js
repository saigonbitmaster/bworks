import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate, withDataProvider, CUSTOM } from 'ra-loopback3';
import moment from 'moment-timezone';
import { withTheme } from '@material-ui/core';
import { get, sumBy } from 'lodash';
import { NmsIcon } from '../../../styles/Icons';
import StatisticWidget from './StatisticWidget';

class NmsStatisticWidget extends Component {
  constructor(props) {
    super(props);
    const { translate } = props;
    //todo
    this.state = {
      title: translate('generic.widgets.nms'),
      subTitle: `(DMA)`,
      data: {
        dmaCount: { label: translate('generic.dmaLevel1'), value: '...' },
        waterLossLastMonth: {
          label: translate('generic.waterLossLastMonth'),
          value: '...',
          status: 'normal',
        },
        quantityLastMonth: { label: translate('generic.quantityLastMonth'), value: '...', status: 'normal' },
      },
    };
  }

  getData = async () => {
    const { dataProvider } = this.props;
    const { data } = this.state;
    // quantity
    let res = await dataProvider(CUSTOM, 'dmas', { subUrl: 'summaryQuantity', method: 'get' });
    if (res.data) {
      // let toDay = get(res.data, 'today');
      // let yesterday = get(res.data, 'yesterday');
      let thisMonth = get(res.data, 'lastMonth');
      // data.today.value = format.formatWithDec(toDay, 0, toDay);
      // data.yesterday.value = format.formatWithDec(yesterday, 0, yesterday);
      data.quantityLastMonth.value = thisMonth * 5 || 0; // hard code multi 5
    }
    // waterLossLastMonth
    const waterLoss = await this.getWaterLossLastMonth();
    if (waterLoss) {
      data.waterLossLastMonth.value = waterLoss;
    }

    // dmaCount
    res = await dataProvider(CUSTOM, 'dmas', { subUrl: 'Count', method: 'get', rawFilter: { where: { level: 1 } } });
    if (res.data) {
      data.dmaCount.value = res.data.count;
    }
    this.setState({ data });
  };

  getWaterLossLastMonth = async () => {
    let timeRange = {
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
    // console.log(timeRange);
    let res;
    res = await this.props.dataProvider(CUSTOM, 'dmas/statisticQuantityByMonth', {
      query: { dmaId: 'AllDma', timeRange: JSON.stringify(timeRange) },
    });
    if (res && res.data.length) {
      let sum = sumBy(res.data, 'leak');
      let val = sum || 0;
      // console.log('res: ', res, val);
      return val;
    }

    return null;
  };

  componentDidMount() {
    this.getData();
  }
  render() {
    return (
      <StatisticWidget
        iconStyle={{ backgroundColor: this.props.theme.palette.primary }}
        icon={<NmsIcon />}
        {...this.state}
      />
    );
  }
}

NmsStatisticWidget.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.any,
  theme: PropTypes.object,
};
const enhance = compose(translate, withTheme, withDataProvider);
export default enhance(NmsStatisticWidget);
