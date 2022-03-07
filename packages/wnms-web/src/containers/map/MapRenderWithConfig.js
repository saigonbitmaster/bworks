import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withDataProvider, MapRender, CUSTOM } from 'ra-loopback3';
import { commonConfig } from '../../actions/mapActions';
class MapRenderWithConfig extends Component {
  componentDidMount() {
    const {
      dataProvider,
      config: { MapDefaultCenter: defaultCenter, MapDefaultCenter: defaultZoom },
      commonConfig,
    } = this.props;
    if (!defaultCenter || !defaultZoom) {
      // get config from server
      dataProvider(CUSTOM, 'nmsconfigs', { rawFilter: { id: { inq: ['MapDefaultCenter', 'MapDefaultZoom'] } } }).then(
        res => {
          if (res && res.data) {
            let payloadConfig = {};
            res.data.map(item => {
              payloadConfig[item.id] = item.value;
            });
            commonConfig(payloadConfig);
          }
        },
      );
    }
  }

  render() {
    const {
      dataProvider,
      config: { MapDefaultCenter: defaultCenter, MapDefaultZoom: defaultZoom },
      commonConfig,
      ...rest
    } = this.props;
    if (!defaultCenter || !defaultZoom) {
      return null;
    }
    return <MapRender isPaper defaultCenter={defaultCenter} defaultZoom={defaultZoom} {...rest} />;
  }
}
MapRenderWithConfig.propTypes = {
  dataProvider: PropTypes.func,
  config: PropTypes.object,
  commonConfig: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    config: state.common,
  };
};
const mapDispatchToProps = { commonConfig };

export default compose(withDataProvider, connect(mapStateToProps, mapDispatchToProps))(MapRenderWithConfig);
