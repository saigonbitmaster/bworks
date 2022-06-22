import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate, withDataProvider, CUSTOM } from 'ra-loopback3';
import green from '@material-ui/core/colors/green';
import { QuantityIcon } from '../../../styles/Icons';
import StatisticWidget from './StatisticWidget';
import Icon from '@material-ui/icons/WorkOutline';

class EmployerSum extends Component {


  componentDidMount() {
  }
  render() {
    const translate = this.props.translate;
    let state = {
      title: translate('generic.emp.widget.employer'),
     
      data: {
        day: { label: translate('generic.emp.widget.today'), value: 540, status: 'ok' },
        month: { label: translate('generic.emp.widget.thisMonth'), value: 12000, status: 'low' },
        year: { label: translate('generic.emp.widget.thisYear'), value: 120000, status: 'ok' },
      },
    };
    return <StatisticWidget iconStyle={{ backgroundColor: green[500] }} icon={<Icon />} {...state} />;
  }
}

EmployerSum.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.any,
};
const enhance = compose(translate, withDataProvider);
export default enhance(EmployerSum);
