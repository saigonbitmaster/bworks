import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate, withDataProvider, CUSTOM } from 'ra-loopback3';
import { WaterSourceIcon } from '../../../styles/Icons';
import StatisticWidget from './StatisticWidget';

class WaterSourceCount extends Component {
  constructor(props) {
    super(props);
    const { translate } = props;
    this.state = {
      title: translate('generic.widgets.waterSourceSummary.waterSource'),
      
      data: {
        totalInService: {
          label: translate('generic.widgets.waterSourceSummary.totalInService'),
          value: null,
          status: 'critical',
        },
        totalInMaintain: {
          label: translate('generic.widgets.waterSourceSummary.totalInMaintain'),
          value: null,
          status: 'low',
        },
        totalInBackup: {
          label: translate('generic.widgets.waterSourceSummary.totalInBackup'),
          value: null,
          status: 'ok',
        },
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
        let totalBackupSource = res.data.filter(item => item.id == 'totalBackupSource')[0].value;
        let totalInOperationSource = res.data.filter(item => item.id == 'totalInOperationSource')[0].value;
        let totalInMaintainSource = res.data.filter(item => item.id == 'totalInMaintainSource')[0].value;
        let data = Object.assign({}, this.state.data);
        data.totalInService.value = totalInOperationSource;
        data.totalInMaintain.value = totalInMaintainSource;
        data.totalInBackup.value = totalBackupSource;
        this.setState(data);
      });
  };

  componentDidMount() {
    this.dashboardData();
  }
  render() {
    return <StatisticWidget icon={<WaterSourceIcon />} {...this.state} />;
  }
}

WaterSourceCount.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.any,
};
const enhance = compose(translate, withDataProvider);
export default enhance(WaterSourceCount);
