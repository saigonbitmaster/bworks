import React from 'react';
import { connect } from 'react-redux';
// import { Layout } from 'react-admin';
import Layout from './HtmlLayout';

export let darkTheme = {
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
};

export let lightTheme = {
  palette: {
    secondary: {
      light: '#757de8',
      main: '#3f51b5',
      dark: '#002984',
      contrastText: '#fff',
    },
  },
  shape: {
    borderRadius: 4,
  },
};

const custom = {
  status: {
    loss: '#ba000d',
    low: '#f57f17',
    normal: '#3f51b5',
    active: '#F44336',
    ok: '#4caf50',
    high: '#ba000d',
    ng: '#ba000d',
    error: '#f44336',
    critical: '#a31545',
    alert: '#f57f17',
    criticalAlert: '#a31545',
    warning: '#f57f17',
    warn: '#f57f17',
    bad: '#f44336',
  },
  sourceGroup: {
    strokeColor: '#2196F3',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#2196F3',
    fillOpacity: 0.35,
    zIndex: 102,
    geodesic: true,
  },
  dma: {
    edit: {
      strokeColor: '#f44336',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#f44336',
      fillOpacity: 0.35,
      zIndex: 190,
      geodesic: true,
    },
    level: {
      1: {
        strokeColor: '#9C27B0',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#9C27B0',
        fillOpacity: 0.35,
        zIndex: 101,
        geodesic: true,
      },
      2: {
        strokeColor: '#2196F3',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#2196F3',
        fillOpacity: 0.35,
        zIndex: 102,
        geodesic: true,
      },
      3: {
        strokeColor: '#03A9F4',
        strokeOpacity: 0.8,
        strokeWeight: 1.5,
        fillColor: '#03A9F4',
        fillOpacity: 0.35,
        zIndex: 103,
        geodesic: true,
      },
      4: {
        strokeColor: '#f44336',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#f44336',
        fillOpacity: 0.35,
        zIndex: 104,
        geodesic: true,
      },
    },
    parent: {},
    siblings: {},
  },
  node: {
    default: {
      zIndex: 1000,
    },
    edit: {
      zIndex: 1010,
    },
  },
  pipe: {
    edit: {
      strokeColor: '#f44336',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: '#f44336',
      fillOpacity: 0.35,
      zIndex: 310,
      geodesic: true,
    },
    diameter: diameter => {
      if (diameter <= 100) {
        return {
          strokeColor: '#2196F3',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          zIndex: 301,
        };
      } else if (diameter <= 200) {
        return {
          strokeColor: '#3F51B5',
          strokeOpacity: 0.8,
          strokeWeight: 2.5,
          zIndex: 302,
        };
      } else if (diameter <= 300) {
        return {
          strokeColor: '#673AB7',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          zIndex: 303,
        };
      } else if (diameter <= 400) {
        return {
          strokeColor: '#4CAF50',
          strokeOpacity: 0.8,
          strokeWeight: 3.5,
          zIndex: 304,
        };
      } else if (diameter <= 500) {
        return {
          strokeColor: '#795548',
          strokeOpacity: 0.8,
          strokeWeight: 4,
          zIndex: 305,
        };
      } else {
        return {
          strokeColor: '#F44336',
          strokeOpacity: 0.8,
          strokeWeight: 4.5,
          zIndex: 306,
        };
      }
    },
  },
  flowLogger: {
    zIndex: 400,
  },
  materials: {
    edit: {
      color: '#f44336',
      strokeColor: '#f44336',
    },
  },
};

darkTheme = { ...darkTheme, ...custom };
lightTheme = { ...lightTheme, ...custom };

const DefaultLayout = connect(
  state => ({
    theme: state.theme === 'dark' ? darkTheme : lightTheme,
  }),
  {},
)(Layout);

export const layoutWithProps = (props, Layout = DefaultLayout) => {
  const CustomLayout = rest => <Layout {...rest} {...props} />;
  return CustomLayout;
};

export default DefaultLayout;
