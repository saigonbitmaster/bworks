import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { debounce, get } from 'lodash';
import { withDataProvider, withRightDrawer, MapGeoJson } from 'ra-loopback3';
import { Marker } from 'react-google-maps';
import { withTheme } from '@material-ui/core';

const GEO_ACTIVE_STYLE = theme => ({
  fillColor: theme.status.active,
  strokeColor: theme.status.active,
  strokeWeight: 1,
});

const GEO_NORMAL_STYLE = theme => ({
  fillColor: theme.status.normal,
  strokeColor: theme.status.normal,
  strokeWeight: 1,
});
@withDataProvider
@withRightDrawer
@withTheme
export default class MapWaterSource extends Component {
  static propTypes = {
    onChangeSelectedFactory: PropTypes.func,
    dataProvider: PropTypes.func,
    rightDrawer: PropTypes.func,
    refMap: PropTypes.object,
    theme: PropTypes.object,
    refMapFactory: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const { theme } = props;
    this.state = {
      factories: [],
      factoryIcon: '',
      factoryActiveIcon: '',
      geoDatas: null,
      geoActiveStyle: GEO_ACTIVE_STYLE(theme),
      geoNormalStyle: GEO_NORMAL_STYLE(theme),
      activeFactoryId: '',
    };
  }

  async componentDidMount() {
    const { dataProvider, theme, refMapFactory } = this.props;
    if (refMapFactory) {
      refMapFactory.current = this;
    }
    let res = await dataProvider('CUSTOM', 'factories', {});
    const resIcon = await dataProvider('URL_ONLY', 'icons', {
      subUrl: 'dropView/Factory',
      query: {
        size: 64,
        color: theme.status.normal,
      },
    });
    const resActiveIcon = await dataProvider('URL_ONLY', 'icons', {
      subUrl: 'dropView/Factory',
      query: {
        size: 64,
        color: theme.status.active,
      },
    });
    this.safeSetState(
      {
        factories: res.data,
        factoryIcon: resIcon.data.url,
        factoryActiveIcon: resActiveIcon.data.url,
      },
      () => this.loadGeometry(res.data),
    );
  }

  loadGeometry = debounce(async factories => {
    const { dataProvider } = this.props;
    const { data } = await dataProvider('CUSTOM', 'gadms', {
      rawFilter: {
        where: {
          id: { inq: ['5cb843d7051a1c083ebc3af6', '5cb843d7051a1c083ebc3afa', '5cb843d7051a1c083ebc3af8'] },
        },
      },
    });
    const geoDatas = data.map((item, index) => ({
      type: 'Feature',
      geometry: item.geometry,
      properties: { ...item.properties, factoryId: factories[index % factories.length].id, id: item.id },
    }));
    this.safeSetState({
      geoDatas,
    });
  }, 1000);

  // onItemClick = item => {
  //   // this.props.rightDrawer(<FactoryInfo item={item} />);
  // };

  safeSetState = (state, cb) => {
    if (!this.unmount) this.setState(state, cb);
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  onFactoryClick = factoryId => {
    const { activeFactoryId } = this.state;
    const { onChangeSelectedFactory } = this.props;
    const newActive = activeFactoryId == factoryId ? '' : factoryId;
    this.safeSetState({ activeFactoryId: newActive });
    if (onChangeSelectedFactory) {
      onChangeSelectedFactory(newActive);
    }
  };

  onRelease = () => {
    this.onFactoryClick('');
  };

  onGeoClick = event => {
    const factoryId = get(event, 'feature.l.factoryId');
    if (factoryId) this.onFactoryClick(factoryId);
  };

  render() {
    const {
      factories,
      factoryIcon,
      geoDatas,
      activeFactoryId,
      geoActiveStyle,
      geoNormalStyle,
      factoryActiveIcon,
    } = this.state;
    const { refMap } = this.props;
    if (!factories || !factories.length) return null;
    return (
      <Fragment>
        {factories.map(factory => (
          <Marker
            onClick={() => this.onFactoryClick(factory.id)}
            key={factory.id}
            icon={{ url: activeFactoryId && activeFactoryId === factory.id ? factoryActiveIcon : factoryIcon }}
            position={factory.position}
          />
        ))}
        {geoDatas &&
          refMap.current &&
          geoDatas.map(data => (
            <MapGeoJson
              key={data.properties.id}
              style={activeFactoryId && activeFactoryId === data.properties.factoryId ? geoActiveStyle : geoNormalStyle}
              onClick={this.onGeoClick}
              data={data}
              refMap={refMap}
            />
          ))}
      </Fragment>
    );
  }
}
