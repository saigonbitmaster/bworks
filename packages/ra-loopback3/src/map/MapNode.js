import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core';
// import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';
import clone from 'lodash/clone';
import { Marker } from 'react-google-maps';

class MapNode extends Component {
  nodeRef = React.createRef();
  static propTypes = {
    position: PropTypes.any,
    node: PropTypes.object,
    zIndex: PropTypes.number,
    editable: PropTypes.bool,
    onChange: PropTypes.func,
    mapitemprops: PropTypes.object,
    theme: PropTypes.object,
    onClick: PropTypes.func,
    icon: PropTypes.any,
  };

  static defaultProps = {
    zIndex: 100,
    editable: false,
  };

  constructor(props) {
    super(props);
    this.polyRef = React.createRef();
  }

  mvcArrayToArray = (mvcArray, removeIndex = -1) => {
    let result = [];
    mvcArray.forEach((point, index) => {
      if (index !== removeIndex) {
        result.push({ lat: point.lat(), lng: point.lng() });
      }
    });
    return result;
  };

  onPolylineComplete = polyline => {
    this.props.onChange(this.mvcArrayToArray(polyline.getPath()));
    // remove polygon from drawing manager
    polyline.setMap(null);
  };

  onDragEnd = () => {
    let e = this.nodeRef.current.getPosition();
    this.props.onChange({ lat: e.lat(), lng: e.lng() });
  };

  onClick = e => {
    if (this.props.onClick) {
      this.props.onClick(e, this.props.node || this.props.position);
    }
  };

  render() {
    const {
      position,
      node,
      zIndex,
      editable,
      icon: customIcon,
      mapitemprops = { polygon: {}, parentDmaId: '' },
      theme,
      onClick,
      ...rest
    } = this.props;
    let { marker = {} } = mapitemprops;
    // eslint-disable-next-line
    let maps = google.maps;
    if (!marker.options) {
      marker.options = editable ? theme.node.edit : theme.node.default;
      // avoid change default theme.
      marker.options = clone(marker.options);
    }
    if (position || (node && node.position)) {
      let editProps = {};
      let fixPosition = position || node.position;
      if (editable) {
        editProps = {
          draggable: true,
          onDragEnd: this.onDragEnd,
        };
        return (
          <Marker
            ref={this.nodeRef}
            position={fixPosition}
            {...rest}
            {...marker}
            {...editProps}
            noRedraw={false}
            icon={{
              path: maps.SymbolPath.CIRCLE,
              strokeColor: 'red',
              scale: 5,
            }}
            zIndex={marker.options.zIndex || 210}
          />
        );
      }
      let icon = customIcon
        ? customIcon
        : {
            path: maps.SymbolPath.CIRCLE,
            strokeColor: 'blue',
            scale: 3,
          };
      return (
        <Marker
          position={fixPosition}
          icon={icon}
          clickable={!!onClick}
          onClick={onClick ? this.onClick : undefined}
          {...rest}
          ref={this.nodeRef}
          {...marker}
          {...rest}
          zIndex={marker.options.zIndex || 200}
        />
      );
    }
    return null;
  }
}

export default withTheme(MapNode);
