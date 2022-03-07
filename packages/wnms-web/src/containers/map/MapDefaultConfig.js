import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withDataProvider, GET_LIST } from 'ra-loopback3';
import isEqual from 'lodash/isEqual';
import config from '../../Config';
import { mapDefaultCenter, mapDefaultZoom } from '../../actions/mapActions';

function mapStateToProps(state) {
  return {
    defaultCenter: state.common.mapDefaultCenter,
    defaultZoom: state.common.mapDefaultZoom,
  };
}

const withMapDefaultConfig = BaseComponent => {
  class MapDefaultConfig extends Component {
    static propTypes = {
      dataProvider: PropTypes.func,
      defaultCenter: PropTypes.object,
      defaultZoom: PropTypes.number,
      mapDefaultCenter: PropTypes.func,
      mapDefaultZoom: PropTypes.func,
      dispatch: PropTypes.any,
    };
    constructor(props) {
      super(props);
      this.state = {
        defaultCenter: props.defaultCenter,
        defaultZoom: props.defaultZoom,
      };
    }
    componentDidMount() {
      const { mapDefaultCenter, mapDefaultZoom } = this.props;
      if (!this.state.defaultCenter) {
        // get api for default center
        this.props
          .dataProvider(GET_LIST, 'NmsConfigs', {
            rawFilter: {
              where: { id: { in: ['MapDefaultCenter', 'MapDefaultZoom'] } },
              fields: { id: true, value: true },
            },
          })
          .then(res => {
            if (res && res.data) {
              res.data.map(item => {
                if (item.id === 'MapDefaultCenter') {
                  mapDefaultCenter(item.value);
                } else if (item.id === 'MapDefaultZoom') {
                  mapDefaultZoom(item.value);
                }
              });
            } else {
              mapDefaultCenter(config.defaultCenter);
              mapDefaultZoom(config.defaultZoom);
            }
          });
      }
    }
    static getDerivedStateFromProps(props, preState) {
      if (!isEqual(props.defaultCenter, preState.defaultCenter) || props.defaultZoom !== preState.defaultZoom) {
        return {
          ...preState,
          defaultCenter: props.defaultCenter,
          defaultZoom: props.defaultZoom,
        };
      }
      return preState;
    }
    render() {
      const {
        dataProvider,
        defaultCenter,
        mapDefaultCenter,
        mapDefaultZoom,
        defaultZoom,
        dispatch,
        ...rest
      } = this.props;
      if (this.state.defaultCenter && this.state.defaultZoom) {
        return (
          <BaseComponent {...rest} defaultCenter={this.state.defaultCenter} defaultZoom={this.state.defaultZoom} />
        );
      }
      return null;
    }
  }
  const enhance = compose(
    withDataProvider,
    connect(mapStateToProps, {
      mapDefaultCenter,
      mapDefaultZoom,
    }),
  );
  return enhance(MapDefaultConfig);
};

export default withMapDefaultConfig;
