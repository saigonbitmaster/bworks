import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate, withDataProvider } from 'ra-loopback3';
import { withTheme } from '@material-ui/core';
// import blue from '@material-ui/core/colors/blue';
import { CtmIcon } from '../../../styles/Icons';
import StatisticWidget from './StatisticWidget';

class CtmStatisticSummary extends Component {
  constructor(props) {
    super(props);
    const { translate } = props;
    const dmaCount = 2; // hard code, level1 only
    //todo
    this.state = {
      title: translate('generic.widgets.business'),
      subTitle: `(${translate('generic.widgets.customer')})`,
      dmaCount,
      data: {
        count: { label: translate('generic.count'), value: 2791 },
        quantityLastMonth: { label: translate('generic.quantityMonth'), value: 50796, status: 'normal' },
        revenueLastMonth: { label: translate('generic.revenueLastMonth'), value: 50796 * 12000, status: 'normal' },
      },
    };
  }

  getData = () => {};

  componentDidMount() {
    this.getData();
  }
  render() {
    return (
      <StatisticWidget
        iconStyle={{ backgroundColor: this.props.theme.palette.primary }}
        icon={<CtmIcon />}
        {...this.state}
      />
    );
  }
}

CtmStatisticSummary.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.any,
  theme: PropTypes.object,
};
const enhance = compose(translate, withTheme, withDataProvider);
export default enhance(CtmStatisticSummary);
