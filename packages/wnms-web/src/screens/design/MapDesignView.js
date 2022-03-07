import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MapRender } from 'ra-loopback3';
import { isEqual, debounce } from 'lodash';
import MapFactory from '../../containers/map/MapFactory';
import MapDmaListWithData from '../../containers/map/MapDmaListWithData';
import MapNodeListWithData from '../../containers/map/MapNodeListWithData';
import MapMaterialListWithData from '../../containers/map/MapMaterialListWithData';

class MapDesignView extends Component {
  refMap = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      mapOptions: props.mapOptions,
      center: props.mapOptions.defaultCenter || undefined,
      dmaIds: [],
    };
  }

  onDmasChange = dmas => {
    let dmaIds = dmas.map(dma => dma.id);
    this.setState({ dmaIds });
  };

  onCenterChanged = debounce(() => {
    let center = this.refMap.current.getCenter();
    center = { lat: center.lat(), lng: center.lng() };
    this.setState({ center });
    this.props.onChange({
      defaultCenter: center,
    });
  }, this.props.debounceCenter);

  searchPosition = center => {
    this.setState({ center });
    this.props.onChange({
      defaultCenter: center,
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.viewDmaId !== this.props.viewDmaId ||
      !isEqual(nextState.dmaIds, this.state.dmaIds) ||
      !isEqual(nextProps.viewSelected, this.props.viewSelected) ||
      !isEqual(nextState.center, this.state.center)
    ) {
      return true;
    }
    return false;
  }

  onZoomChanged = () => {
    this.props.onChange({ defaultZoom: this.refMap.current.getZoom() });
  };

  static getDerivedStateFromProps(nextProps, state) {
    if (
      nextProps.mapOptions.defaultCenter &&
      !isEqual(nextProps.mapOptions.defaultCenter, state.mapOptions.defaultCenter)
    ) {
      return {
        ...state,
        mapOptions: nextProps.mapOptions,
        center: nextProps.mapOptions.defaultCenter,
      };
    }
    return state;
  }

  render() {
    const { dataProvider, mapOptions, viewSelected, updateView, viewDmaId, viewContext, icon } = this.props;
    // console.log('MapDesignView render: ', this.props);
    // eslint-disable-line
    const { center } = this.state; // dmaIds
    let showDma = false,
      showNode = false,
      types = [];
    viewSelected.map(item => {
      if (item === 'Dma') {
        showDma = true;
      } else if (item === 'Node') {
        showNode = true;
      } else {
        types.push(item);
      }
    });
    return (
      <MapRender
        refMap={this.refMap}
        onZoomChanged={this.onZoomChanged}
        {...mapOptions}
        options={{ maxHeight: '90vh' }}
        defaultCenter={mapOptions.defaultCenter}
        onCenterChanged={this.onCenterChanged}
        center={center}
        searchPosition={this.searchPosition}
        isPaper={true}
      >
        <MapDmaListWithData
          show={showDma}
          mapitemprops={{ noFill: true }}
          onCenterChange={this.onCenterChange}
          onDmasChange={this.onDmasChange}
          parentDmaId={viewDmaId}
          dataProvider={dataProvider}
        />
        <MapMaterialListWithData
          updateView={updateView}
          icon={icon}
          types={types}
          // dmaIds={dmaIds}
          dmaIds={[viewDmaId]}
          dataProvider={dataProvider}
        />
        {showNode && <MapNodeListWithData center={center} dataProvider={dataProvider} />}
        {viewContext}
        <MapFactory />
      </MapRender>
    );
  }
}

MapDesignView.propTypes = {
  icon: PropTypes.any,
  dataProvider: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  mapOptions: PropTypes.object,
  viewSelected: PropTypes.array,
  updateView: PropTypes.number,
  viewDmaId: PropTypes.string,
  viewContext: PropTypes.node,
  searchPosition: PropTypes.func,
  debounceCenter: PropTypes.number,
};
MapDesignView.defaultProps = {
  debounceCenter: 500, // ms
};

export default MapDesignView;
