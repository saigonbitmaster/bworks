import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate, withDataProvider, CUSTOM } from 'ra-loopback3';
import blue from '@material-ui/core/colors/blue';
import { FactoryIcon } from '../../../styles/Icons';
import Icon from '@material-ui/icons/MoneyOutlined'
import StatisticWidget from './StatisticWidget';

class RevenueSum extends Component {


  render() {
    const { translate } = this.props;
    let state = {
      title: translate('generic.emp.widget.fund'),
             
      data: {
        count: {
          label: translate('generic.emp.widget.current'),
          value: 15000000,
          status: 'normal',
        },
        currentQuantity: { label: translate('generic.emp.widget.withdraw'), value: 8000000, status: 'normal' },
        designCapacity: { label: translate('generic.emp.widget.deposit'), value: 23000000, status: 'normal' },
      },
    };
    return <StatisticWidget iconStyle={{ backgroundColor: blue[500] }} icon={<Icon />} {...state} />;
  }
}

RevenueSum.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.any,
};
const enhance = compose(translate, withDataProvider);
export default enhance(RevenueSum);
