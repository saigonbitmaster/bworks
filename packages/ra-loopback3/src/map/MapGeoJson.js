import { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import { MAP } from 'react-google-maps/lib/constants';
import uuidv1 from 'uuid/v1';
// import { withTheme } from '@material-ui/core';

const DEFAULT_STYLE = theme => ({
  fillColor: theme.palette.primary.main,
  strokeColor: theme.palette.primary.main,
  strokeWeight: 1,
});

// @withTheme
export default class MapGeoJson extends Component {
  static propTypes = {
    refMap: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    style: PropTypes.object,
    theme: PropTypes.object,
  };
  features = {};

  constructor(props) {
    super(props);
  }

  getMap() {
    const { refMap } = this.props;
    return get(refMap, `current.context['${MAP}']`);
  }

  componentWillUnmount() {
    this.removeGeo();
  }

  componentDidMount() {
    this.updateGeo();
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateGeo();
  }

  removeGeo() {
    const map = this.getMap();
    if (map) {
      const featureIds = Object.keys(this.features);
      for (const featureId of featureIds) {
        map.data.remove(this.features[featureId]);
      }
      if (this.clickListener) {
        // eslint-disable-next-line no-undef
        google.maps.event.removeListener(this.clickListener);
      }
    }
  }

  addFeature(feature, map) {
    const { properties = {}, geometry, type } = feature;
    if (!properties.featureId) {
      properties.featureId = uuidv1().toString();
    }
    console.log(feature);
    if (map) {
      this.features[properties.featureId] = map.data.addGeoJson({
        type,
        geometry,
        properties: properties,
      });
    }
  }

  addFeatureCollection(features, map) {
    for (const data of features) {
      if (data.type === 'Feature') {
        this.addFeature(data, map);
      } else if (data.type === 'FeatureCollection') {
        this.addFeatureCollection(data.features, map);
      }
    }
  }

  updateGeo = debounce(() => {
    // this.removeGeo(); // remove if able

    const { data = {} } = this.props;
    const map = this.getMap();
    if (!map) return;
    if (!this.clickListener) {
      this.clickListener = map.data.addListener('click', function(event) {
        const id = get(event, 'feature.l.featureId');
        if (id && this.props.onClick) {
          this.props.onClick(event, id);
        }
      });
    }

    if (data.type === 'Feature') {
      this.addFeature(data, map);
    } else if (data.type === 'FeatureCollection') {
      this.addFeatureCollection(data.features, map);
    }
    map.data.setStyle(function(feature) {
      const style = feature.getProperty('style') || {};
      return style;
    });
  }, 1000);

  render() {
    return '';
  }
}
