import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate, withDataProvider, CUSTOM } from 'ra-loopback3';
import { withTheme } from '@material-ui/core';
// import blue from '@material-ui/core/colors/blue';
import { FactoryIcon } from '../../../styles/Icons';
import StatisticWidget from './StatisticWidget';

class FactoryStatisticWidget extends Component {
  constructor(props) {
    super(props);
    const { translate } = props;
    //todo
    this.state = {
      title: `${translate('generic.widgets.factory')} (${'...'})`,
      subTitle: translate('generic.widgets.unitCalculate', { unit: translate('generic.units.flow') }),
      data: {
        quantityDay: { label: translate('generic.quantityDay'), value: '...', status: 'normal' },
        quantityMonth: { label: translate('generic.quantityMonth'), value: '...', status: 'normal' },
        quantityYear: { label: translate('generic.quantityYear'), value: '...', status: 'normal' },
      },
    };
  }

  getData = async () => {
    const { dataProvider, translate } = this.props;
    const { data } = this.state;
    // get factories summary
    const res = await dataProvider(CUSTOM, 'factories', { subUrl: 'statusSummary' });
    // console.log('sad', res.data);
    if (res.data) {
      const title = `${translate('generic.widgets.factory')} (${res.data.count || '...'})`;
      data.quantityDay.value = res.data.currentCapacityDay || 196120;
      data.quantityMonth.value = res.data.currentCapacityDay * 30 || 19610 * 4;
      data.quantityYear.value = res.data.currentCapacityDay * 30 * 12 || 196120 * 4 * 11;
      this.setState({ data: { ...data }, title });
    }
  };

  componentDidMount() {
    this.getData();
  }
  render() {
    return (
      <StatisticWidget
        iconStyle={{ backgroundColor: this.props.theme.palette.primary }}
        icon={<FactoryIcon />}
        {...this.state}
      />
    );
  }
}

FactoryStatisticWidget.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.any,
  theme: PropTypes.object,
};
const enhance = compose(translate, withTheme, withDataProvider);
export default enhance(FactoryStatisticWidget);
