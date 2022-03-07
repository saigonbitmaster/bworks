import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate, CUSTOM, withDataProvider } from 'ra-loopback3';
import blue from '@material-ui/core/colors/blue';
import { FactoryIcon } from '../../../styles/Icons';
import StatisticWidget from './StatisticWidget';
import sumBy from 'lodash/sumBy';

class FlowLoggerStatisticWidget extends Component {
  constructor(props) {
    super(props);
    const { translate } = props;
    this.state = {
      title: translate('generic.widgets.factory'),
      subTitle: translate('generic.widgets.unitCalculate', { unit: translate('generic.units.factoryCapacity') }),
      data: {
        count: {
          label: translate('generic.count'),
          value: null,
          status: 'normal',
        },
        currentCapacity: { label: translate('generic.currentCapacity'), value: null, status: 'normal' },
        designCapacity: { label: translate('generic.designCapacity'), value: null, status: 'normal' },
      },
    };
  }
  async componentDidMount() {
    let { data } = this.state;
    const { dataProvider } = this.props;
    const res = await dataProvider(CUSTOM, 'factories', {});
    // console.log(res);
    if (res.data) {
      // eslint-disable-next-line
      data.count.value = res.data.length;
      data.designCapacity.value = sumBy(res.data, 'designCapacityDay'); // cong suat thiet ke
      data.currentCapacity.value = sumBy(res.data, 'currentCapacityDay'); // cong suat hien tai
      this.setState({ data });
    }
  }
  render() {
    return <StatisticWidget iconStyle={{ backgroundColor: blue[500] }} icon={<FactoryIcon />} {...this.state} />;
  }
}

FlowLoggerStatisticWidget.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
};
const enhance = compose(translate, withDataProvider);
export default enhance(FlowLoggerStatisticWidget);
