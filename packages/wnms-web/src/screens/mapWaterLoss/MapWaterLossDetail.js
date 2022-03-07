import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { List, Datagrid, TextField, NumberField, FunctionField, translate } from 'ra-loopback3';
import { withTheme } from '@material-ui/core';

class MapWaterLossDetail extends Component {
  refController = React.createRef();
  constructor(props) {
    super(props);
    this.state = { filter: props.defaultFilter };
  }
  componentDidMount() {
    if (this.props.refHandle) {
      this.props.refHandle.current = this;
    }
  }
  // static getDerivedStateFromProps(props, state) {
  //   const { filter } = props;
  //   if (!isEqual(filter, state.filter)) {
  //     return { filter };
  //   }
  //   return null;
  // }
  updateFilter = filter => {
    this.setState({ filter }, this.refController.current.updateFilter);
  };
  renderStatus = record => {
    if (record && record.rateLeak) {
      return (
        <span style={{ color: this.props.theme.status[record.status] }}>
          {this.props.translate(`generic.conclusionDmaLoss.${record.status}`)}
        </span>
      );
    }

    return <span>{this.props.translate('generic.conclusionDmaLoss.noData')}</span>;
  };
  // renderRate = record => {
  //   if (record.input && record.output && record.fullLeak) {
  //     return `${parseInt((record.fullLeak * 100) / record.input)} %`;
  //   }
  //   return null;
  // };
  render() {
    const { filter } = this.state;
    const { defaultFilter, translate, refHandle, theme, ...rest } = this.props;
    const Action = () => null;
    return (
      <List
        {...rest}
        resource="logwaterlossdmamonths"
        fixUrl="dmas/mapWaterLoss"
        refController={this.refController}
        filter={{ $rawQuery: filter }}
        bulkActions={false}
        actions={<Action />}
        title={translate('generic.details')}
        sub
      >
        <Datagrid>
          <TextField source="name" label={translate('generic.waterFlows.dmaLevel1')} />
          <NumberField
            source="mainConsumption"
            label={translate('generic.waterFlows.input')}
            options={{ maximumFractionDigits: 1 }}
          />
          <NumberField
            source="subConsumption"
            label={translate('generic.waterFlows.output')}
            options={{ maximumFractionDigits: 1 }}
          />
          <NumberField
            source="leak"
            label={translate('generic.waterFlows.fullLeak')}
            options={{ maximumFractionDigits: 1 }}
          />
          <NumberField label={translate('generic.waterFlows.rateLeak')} source="rateLeak" />
          <FunctionField label={translate('generic.status')} render={this.renderStatus} />
        </Datagrid>
      </List>
    );
  }
}

MapWaterLossDetail.propTypes = {
  defaultFilter: PropTypes.object,
  refHandle: PropTypes.object,
  translate: PropTypes.func,
  theme: PropTypes.object,
};

const enhance = compose(translate, withTheme);
export default enhance(MapWaterLossDetail);
