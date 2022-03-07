import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { debounce, isEqual, get } from 'lodash';
import geolib from 'geolib';
import { MapRender } from '../../LocalExport';
import MapMaterialNode from '../../map/MapMaterialNode';
import { getList } from '../../data/materialuses';
import MapNodeListWithData from '../../map/MapNodeListWithData';
import RawMapPipeInputDecorate from './RawMapPipeInputDecorate';
// import MapMaterial from '../../map/MapMaterial';
class RawMapNodeSelectInput extends Component {
  refMap = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      drawing: !props.value || props.value.length == 0,
      center: props.center || props.defaultCenter,
      mousePosition: null,
      materials: [],
      decorateDmaId: props.decorate.dmaId,
      icon: props.icon,
      activeIcon: props.activeIcon,
    };
  }

  static getDerivedStateFromProps(props, state) {
    // console.log('RawMapNodeSelectInput getDerivedStateFromProps: ', props, state);
    let drawing = !props.value || props.value.length == 0;
    let decorateDmaId = props.decorate.dmaId;
    let icon = get(props, 'icon', '');
    let activeIcon = get(props, 'activeIcon', '');
    return { ...state, drawing, decorateDmaId, icon, activeIcon };
  }

  componentDidMount() {
    const { dataProvider, model } = this.props;
    if (model) {
      getList({ dataProvider, dmaIds: ['all'], types: [model] }).then(materials => {
        if (!this.unmount) {
          this.setState({ materials });
        }
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('RawMapNodeSelectInput shouldComponentUpdate ', nextProps, nextState);
    if (
      nextProps.value !== this.props.value ||
      !isEqual(nextState.center, this.state.center) ||
      !isEqual(nextState.materials, this.state.materials) ||
      !isEqual(nextState.decorateDmaId, this.state.decorateDmaId) || // add
      !isEqual(nextState.icon, this.state.icon) || // add
      !isEqual(nextState.activeIcon, this.state.activeIcon) // add
    ) {
      return true;
    }
    return false;
  }

  onMapCenterChanged = debounce(() => {
    let center = this.refMap.current.getCenter();
    // calculateDistance for update
    center = { lat: center.lat(), lng: center.lng() };
    let distance = geolib.getDistance(
      { latitude: this.state.center.lat, longitude: this.state.center.lng },
      { latitude: center.lat, longitude: center.lng },
    );
    if (distance > this.props.reloadCenterDistance) {
      this.setState({ center });
    }
  }, 100);

  componentWillUnmount() {
    this.unmount = true;
    this.onMapCenterChanged.cancel();
  }

  onNodeClick = (e, node) => {
    this.props.onChange(node.id, node);
  };

  render() {
    const {
      defaultCenter,
      defaultZoom,
      value = null,
      formData,
      icon,
      activeIcon,
      decorate,
      dataProvider,
      model,
      children,
      // ...rest
    } = this.props;
    // console.log('RawMapNodeSelectInput: ', this.props);
    const { materials } = this.state;
    return (
      <Fragment>
        <MapRender
          refMap={this.refMap}
          onCenterChanged={this.onMapCenterChanged}
          onMouseMove={this.onMouseMove}
          defaultZoom={defaultZoom}
          defaultCenter={get(formData, 'node') || defaultCenter}
          options={{ maxHeight: '450px' }}
        >
          {children}
          <MapNodeListWithData dataProvider={dataProvider} onClick={this.onNodeClick} center={this.state.center} />
          {materials.map(material => {
            // console.log('material', material.id);
            if (material.id !== get(formData, 'id')) {
              return (
                <MapMaterialNode
                  key={material.id}
                  data={material}
                  icon={icon}
                  dataProvider={dataProvider}
                  model={model}
                />
              );
            }
            return null;
          })}
          <MapMaterialNode id={value} icon={activeIcon ? activeIcon : icon} dataProvider={dataProvider} model={model} />
          <RawMapPipeInputDecorate {...decorate} />

          {/* next verision */}
          {/* <MapMaterial
            id={value}
            icon={activeIcon ? activeIcon : icon}
            dataProvider={dataProvider}
            model={model}
            {...rest}
          /> */}
        </MapRender>
      </Fragment>
    );
  }
}

RawMapNodeSelectInput.propTypes = {
  center: PropTypes.object,
  model: PropTypes.string.isRequired,
  icon: PropTypes.any.isRequired,
  activeIcon: PropTypes.any,
  defaultCenter: PropTypes.object,
  defaultZoom: PropTypes.number,
  dataProvider: PropTypes.func,
  formData: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
  mapitemprops: PropTypes.object,
  decorate: PropTypes.object,
  reloadCenterDistance: PropTypes.number,
  children: PropTypes.node,
};
RawMapNodeSelectInput.defaultProps = {
  reloadCenterDistance: 1000, // meter
};

export default RawMapNodeSelectInput;
