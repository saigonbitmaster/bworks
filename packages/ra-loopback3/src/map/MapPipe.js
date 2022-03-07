import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Polyline } from 'react-google-maps';
import { withTheme } from '@material-ui/core';
import clone from 'lodash/clone';

class MapPipe extends Component {
  static propTypes = {
    path: PropTypes.array,
    pipe: PropTypes.object,
    zIndex: PropTypes.number,
    editable: PropTypes.bool,
    onChange: PropTypes.func,
    mapitemprops: PropTypes.object,
    theme: PropTypes.object,
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
    this.props.onChange(this.mvcArrayToArray(this.polyRef.current.getPath()));
  };

  onRightClick = e => {
    // remove point click
    this.props.onChange(this.mvcArrayToArray(this.polyRef.current.getPath(), e.vertex));
  };

  render() {
    const {
      path,
      pipe,
      zIndex,
      editable,
      mapitemprops = { polygon: {}, parentDmaId: '' },
      theme,
      ...rest
    } = this.props;
    let { polyline = {} } = mapitemprops;
    if (!polyline.options) {
      polyline.options = pipe
        ? theme.pipe.diameter(pipe.meta.diameter)
        : editable
        ? theme.pipe.edit
        : theme.pipe.diameter(10);
      // avoid change default theme.
      polyline.options = clone(polyline.options);
    }
    // /* eslint-disable no-undef */
    // let maps = google.maps;
    // /* eslint-enable no-undef */
    if ((path && path.length) || (pipe && pipe.polyline)) {
      let editProps = {};
      let fixPath = path || pipe.polyline;
      if (editable) {
        editProps = {
          editable: true,
          draggable: true,
          onMouseUp: this.onDragEnd,
          onDragEnd: this.onDragEnd,
          onRightClick: this.onRightClick,
        };
        return (
          <Polyline
            defaultEditable={true}
            path={fixPath}
            {...rest}
            ref={this.polyRef}
            {...rest}
            {...polyline}
            {...editProps}
          />
        );
      }
      return <Polyline path={fixPath} {...rest} ref={this.polyRef} {...polyline} {...rest} />;
    }
    return null;
  }
}

export default withTheme(MapPipe);
