import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { debounce, isEqual } from 'lodash';
import { MapPipe, MapMaterialNode, URL_ONLY } from 'ra-loopback3';
import { withTheme } from '@material-ui/core';
import { getList } from '../../data/materialuse';
import {
  // FlowLoggerIcon,
  // MeterIcon,
  // QualityLoggerIcon,
  // FilterIcon,
  // PressureReducingIcon,
  // PumpIcon,
  // TankIcon,
  // ValveIcon,
  // OtherIcon,
  iconToMap,
} from '../../styles/Icons';

class MapMaterialListWithData extends Component {
  state = {
    materials: [],
  };

  getData = debounce(({ dataProvider, dmaIds, types }) => {
    // console.log('dma id', dmaIds);
    // validate type
    if (!types || types.length === 0) return this.setState({ materials: [] });
    // get data
    return getList({ dataProvider, dmaIds, types, deep: 2 }).then(materials => {
      // console.log('get list', materials);
      if (!this.unmount) {
        this.setState({ materials }, this.forceUpdate);
      }
    });
  }, 400);

  componentDidMount() {
    this.getData(this.props);
  }

  componentDidUpdate(prevProps) {
    const { dmaIds, types, updateView } = this.props;
    if (!isEqual(dmaIds, prevProps.dmaIds) || !isEqual(types, prevProps.types) || updateView !== prevProps.updateView) {
      this.getData(this.props);
    }
  }

  componentWillUnmount() {
    this.unmount = true;
    this.getData.cancel();
  }

  iconLink = iconName => {
    let url = this.props.dataProvider(URL_ONLY, 'icons', {
      subUrl: `dropView/${iconName}`,
      query: { status: 'normal' },
      ignoreToken: true,
    }).url;
    return url;
  };
  bigIconLink = iconName => {
    let url = this.props.dataProvider(URL_ONLY, 'icons', {
      subUrl: `view/${iconName}`,
      query: { color: 'normal', size: 64 },
      ignoreToken: true,
    }).url;
    return url;
  };

  render() {
    const { materials } = this.state;
    const { dataProvider, theme } = this.props;
    // console.log('MapMaterialListWithData state', this.state);
    // console.log('MapMaterialListWithData props', this.props);
    return (
      <Fragment>
        {materials.map(item => {
          switch (item.type) {
            case 'Pipe':
              return <MapPipe key={item.id} pipe={item} />;
            case 'FlowLogger':
              return (
                <MapMaterialNode
                  dataProvider={dataProvider}
                  model={item.type}
                  icon={iconToMap({ iconElement: 'FlowLoggerIcon', color: theme.palette.primary.main })}
                  key={item.id}
                  data={item}
                />
              );
            case 'QualityLogger':
              return (
                <MapMaterialNode
                  dataProvider={dataProvider}
                  model={item.type}
                  icon={iconToMap({
                    iconElement: 'QualityLoggerIcon',
                    color: theme.palette.primary.main,
                  })}
                  key={item.id}
                  data={item}
                />
              );
            case 'ElectricLogger':
              return (
                <MapMaterialNode
                  dataProvider={dataProvider}
                  model={item.type}
                  icon={iconToMap({
                    iconElement: 'ElectricLoggerIcon',
                    color: theme.palette.primary.main,
                  })}
                  key={item.id}
                  data={item}
                />
              );
            case 'Meter':
              return (
                <MapMaterialNode
                  dataProvider={dataProvider}
                  model={item.type}
                  icon={iconToMap({ iconElement: 'MeterIcon', color: theme.palette.primary.main })}
                  key={item.id}
                  data={item}
                />
              );
            case 'Filter':
              return (
                <MapMaterialNode
                  dataProvider={dataProvider}
                  model={item.type}
                  icon={iconToMap({ iconElement: 'FilterIcon', color: theme.palette.primary.main })}
                  key={item.id}
                  data={item}
                />
              );
            case 'PressureReducing':
              return (
                <MapMaterialNode
                  dataProvider={dataProvider}
                  model={item.type}
                  icon={iconToMap({
                    iconElement: 'PressureReducingIcon',
                    color: theme.palette.primary.main,
                  })}
                  key={item.id}
                  data={item}
                />
              );
            case 'Pump':
              return (
                <MapMaterialNode
                  dataProvider={dataProvider}
                  model={item.type}
                  icon={iconToMap({ iconElement: 'PumpIcon', color: theme.palette.primary.main })}
                  key={item.id}
                  data={item}
                />
              );
            case 'Tank':
              return (
                <MapMaterialNode
                  dataProvider={dataProvider}
                  model={item.type}
                  icon={iconToMap({ iconElement: 'TankIcon', with: 64, color: theme.palette.primary.main })}
                  key={item.id}
                  data={item}
                />
              );
            case 'Valve':
              return (
                <MapMaterialNode
                  dataProvider={dataProvider}
                  model={item.type}
                  icon={iconToMap({ iconElement: 'ValveIcon', color: theme.palette.primary.main })}
                  key={item.id}
                  data={item}
                />
              );
            default:
              return (
                <MapMaterialNode
                  dataProvider={dataProvider}
                  model={item.type}
                  icon={iconToMap({ iconElement: 'OtherIcon', color: theme.palette.primary.main })}
                  key={item.id}
                  data={item}
                />
              );
          }
        })}
      </Fragment>
    );
  }
}
MapMaterialListWithData.propTypes = {
  icon: PropTypes.any,
  mapitemprops: PropTypes.object,
  dataProvider: PropTypes.func.isRequired,
  dmaIds: PropTypes.arrayOf(PropTypes.string),
  updateView: PropTypes.number,
  types: PropTypes.arrayOf(PropTypes.string),
  deep: PropTypes.number,
  theme: PropTypes.object,
};
MapMaterialListWithData.defaultProps = {
  deep: 1, // use later
};

const enhance = compose(withTheme);
export default enhance(MapMaterialListWithData);
