import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate, withDataProvider, CUSTOM } from 'ra-loopback3';
import blue from '@material-ui/core/colors/blue';
import { FactoryIcon } from '../../../styles/Icons';
import StatisticWidget from './StatisticWidget';

class FlowLoggerStatisticWidget extends Component {
  constructor(props) {
    super(props);
    const { translate } = props;
    this.state = {
      title: translate('generic.widgets.factory'),
             
      data: {
        count: {
          label: translate('generic.fund.total'),
          value: null,
          status: 'normal',
        },
        currentQuantity: { label: translate('generic.fund.earned'), value: null, status: 'normal' },
        designCapacity: { label: translate('generic.fund.deposited'), value: null, status: 'normal' },
      },
    };
  }

  /* loadStatus = () => {
        const { dataProvider } = this.props;
        const { baseOnFlowLogger } = this.state;
        dataProvider(CUSTOM, 'WaterSource', {
            subUrl: 'dashboard',
            method: 'get',
            query: { mode: baseOnFlowLogger ? 'FlowLogger' : 'Dma' },
        }).then(res => {
            if (res) {
                this.setState({ currentStatus: res.data });
            }
        });
    };*/

  dashboardData = () => {
    this.props
      .dataProvider(CUSTOM, 'WaterSources', {
        subUrl: 'dashboard',
        method: 'get',
        query: { mode: 'widget' },
      })
      .then(res => {
        let totalFactory = res.data.filter(item => item.id == 'totalFactory')[0].value;
        let currentQuantity = res.data.filter(item => item.id == 'totalCurrentDailyVolumeFactory')[0].value;
        let designCapacity = res.data.filter(item => item.id == 'totalDailyCapacityFactory')[0].value;
        let data = Object.assign({}, this.state.data);
        data.count.value = totalFactory;
        data.currentQuantity.value = currentQuantity;
        data.designCapacity.value = designCapacity;
        this.setState(data);
      });
  };

  componentDidMount() {
    this.dashboardData();
  }
  render() {
    return <StatisticWidget iconStyle={{ backgroundColor: blue[500] }} icon={<FactoryIcon />} {...this.state} />;
  }
}

FlowLoggerStatisticWidget.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.any,
};
const enhance = compose(translate, withDataProvider);
export default enhance(FlowLoggerStatisticWidget);
