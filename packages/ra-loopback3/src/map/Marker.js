import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core';
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';
import { clone, debounce, get } from 'lodash';
class Marker extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    // eslint-disable-next-line
    let maps = google.maps;
    const { icon, data, theme, model, label, defaultTitle, flgShowInfo, position, ...rest } = this.props;
    // if (!marker.options) {
    //   marker.options = clone(theme[camelCase(model)]) || { options: {} };
    // }
    if (!Object.keys(position).length) {
      return null;
    }
    const labelSize = { width: 140 };
    const labelPadding = 0;
    let content = flgShowInfo ? (
      <span>
        <b>
          {data.name} - {data.optionKey}
        </b>
        <br />
        <span style={{ color: theme.status[data.status] }}>{data.pressure}(bar)</span>
        &nbsp;&nbsp;
        <span style={{ color: theme.status.ok }}>{data.flowRate}(m³/h)</span>
      </span>
    ) : (
      <span />
    );
    return (
      <MarkerWithLabel
        {...rest}
        labelStyle={{
          textAlign: 'center',
          width: labelSize.width + 'px',
          backgroundColor: 'white',
          fontSize: '13px',
          padding: labelPadding + 'px',
        }}
        labelAnchor={{ x: labelSize.width / 2 + labelPadding, y: 65 }}
        // key={data.id}
        position={position}
        // zIndex={marker.options.zIndex || 210}
        icon={{
          url: get(icon, 'url', ''),
        }}
      >
        {content}
      </MarkerWithLabel>
    );
  }
}

Marker.propTypes = {
  icon: PropTypes.any,
  data: PropTypes.any,
  id: PropTypes.string,
  model: PropTypes.string,
  dataProvider: PropTypes.func.isRequired,
  marker: PropTypes.object,
  label: PropTypes.any,
  theme: PropTypes.object,
  flgShowInfo: PropTypes.bool,
  defaultTitle: PropTypes.any,
  position: PropTypes.object,
};
export default withTheme(Marker);
