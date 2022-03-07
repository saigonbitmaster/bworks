import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { set } from 'lodash';
import { translate, withDataProvider, CUSTOM } from 'ra-loopback3';
import green from '@material-ui/core/colors/green';
import { CustomerIcon } from '../../../styles/Icons';
import StatisticWidget from './Widget';

class Customers extends Component {
  constructor(props) {
    super(props);
    const { translate } = props;
    this.state = {
      title: translate('generic.pages.client'),
      // subTitle: translate('generic.widgets.unitCalculate', { unit: translate('generic.units.flow') }),
      data: {
        total: { label: translate('generic.total'), value: null, status: 'ok' },
        inuse: { label: translate('generic.widgets.inuse'), value: null, status: 'ok' },
        register: { label: translate('generic.widgets.newRegister'), value: null, status: 'ok' },
      },
    };
  }
  componentDidMount() {
    const { data } = this.state;
    // prototype data
    this.props.dataProvider(CUSTOM, 'clients', { subUrl: 'status' }).then(res => {
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
    return <StatisticWidget iconStyle={{ backgroundColor: green[500] }} icon={<CustomerIcon />} {...this.state} />;
  }
}

Customers.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
};
const enhance = compose(translate, withDataProvider);
export default enhance(Customers);
