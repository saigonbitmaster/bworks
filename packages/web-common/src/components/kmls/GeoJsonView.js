import React from 'react';
import { MapGeoJson } from 'ra-loopback3';
import { withTheme } from '@material-ui/core';
import compose from 'recompose/compose';

// eslint-disable-next-line react/prop-types
function RawGeoJsonView({ refMap, data, theme }) {
  const onGeoClick = () => {};
  return <MapGeoJson style={{}} onClick={onGeoClick} data={data} refMap={refMap} theme={theme} />;
}

const GeoJsonView = compose(withTheme)(RawGeoJsonView);
export default GeoJsonView;
