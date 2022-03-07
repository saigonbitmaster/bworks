import get from 'lodash/get';
const WrapperCoordinateMap = {
  // convert 1 point in react map to geojson to save mongodb
  // in: object point
  // out: geo json point
  // example:
  //  { type: "Point", coordinates: [ 40, 5 ] }
  convertPointToGeoJson: point => {
    let final = {
      type: 'Point',
      coordinates: [],
    };
    let coordinates = [];
    coordinates.push(point.lng);
    coordinates.push(point.lat);
    final.coordinates = coordinates;
    return final;
  },

  // convert 1 Polygon in react map to geojson to save mongodb
  // in: path(from getPath() function of polygon)
  // out: geojon polygon
  // example:
  // {
  //   type: "Polygon",
  //   coordinates: [ [ [ 0 , 0 ] , [ 3 , 6 ] , [ 6 , 1 ] , [ 0 , 0  ] ] ]
  // }
  convertPolygonToGeoJson: path => {
    let final = {
      type: 'Polygon',
      coordinates: [],
    };
    let coordinates = [];
    let subMain = [];
    // eslint-disable-next-line
    path.forEach((point, index) => {
      subMain.push([point.lng(), point.lat()]); // long-lat
    });
    coordinates.push(subMain);
    final.coordinates = coordinates;
    return final;
  },

  // ==========
  // convert 2 Polygon in react map to geojson to save mongodb
  // in:
  // + polyFirst: array point([lat, lng]) or geojson MultiPolygon
  // + polySecond: path(from getPath() function of polyon)
  // out: geosjon
  // example:
  // {
  //   type: "MultiPolygon",
  //   coordinates: [
  //      [ [ [ -73.958, 40.8003 ], [ -73.9498, 40.7968 ], [ -73.9737, 40.7648 ], [ -73.9814, 40.7681 ], [ -73.958, 40.8003 ] ] ],
  //      [ [ [ -73.958, 40.8003 ], [ -73.9498, 40.7968 ], [ -73.9737, 40.7648 ], [ -73.958, 40.8003 ] ] ]
  //   ]
  // }
  convertTwoPolygonToGeoJson: (polyFirst, polySecond) => {
    let final = {
      type: 'MultiPolygon',
      coordinates: [],
    };
    let coordinates = [];
    if (!polyFirst || !polySecond) {
      return final;
    }

    // xu ly first polygon => lay array point
    let subMain = [];
    if (Array.isArray(polyFirst)) {
      for (let i = 0; i < polyFirst.length; ++i) {
        subMain.push([polyFirst[i].lng, polyFirst[i].lat]); // long-lat
      }
      coordinates.push(subMain);
    } else if (get(polyFirst, 'type') === 'MultiPolygon' && Array.isArray(get(polyFirst, 'coordinates'))) {
      coordinates = get(polyFirst, 'coordinates');
    } else {
      return final; //error
    }

    // xu ly second polygon
    subMain = [];
    // eslint-disable-next-line
    polySecond.forEach((point, index) => {
      subMain.push([point.lng(), point.lat()]); // long-lat
    });

    coordinates.push(subMain);
    final.coordinates = coordinates;
    return final;
  },

  // convert many Polygon in react map to geojson to save mongodb
  // in: paths(from getPaths() function of polygon)
  // out: format geojson
  convertMultiPolygonToGeoJson: paths => {
    let coordinates = [];
    // eslint-disable-next-line
    paths.forEach((item, index) => {
      let poly = [];
      // eslint-disable-next-line
      item.forEach((point, index) => {
        poly.push([point.lng(), point.lat()]); // long-lat
      });
      coordinates.push(poly);
    });
    return { type: coordinates.length === 1 ? 'Polygon' : 'MultiPolygon', coordinates };
  },

  // convert geojson to many polygon for react map
  // in: geojson of MultiPolygon
  // out: array[lat, lng]
  convertGeoJsonToMultiPolygon: data => {
    let final = [];
    let coordinates = get(data, 'coordinates');
    if (!coordinates || !coordinates.length) return final;

    for (let k = 0; k < coordinates.length; k++) {
      let itemCoordinates = coordinates[k];
      let result = [];
      for (let i = 0; i < itemCoordinates.length; i++) {
        let item = itemCoordinates[i];
        if (item.length !== 2) {
          continue;
        }
        result.push({ lat: item[1], lng: item[0] }); // lat-long
      }
      if (result.length) {
        final.push(result);
      }
    }

    return final;
  },

  // convert geojson to 1 polygon for react map
  // in: geojson of Polygon
  // out: array[lat, lng]
  convertGeoJsonToPolygon: data => {
    let result = [];
    let coordinates = get(data, 'coordinates');
    if (!coordinates || !coordinates.length) return result;
    let itemCoordinates = coordinates[0];

    for (let i = 0; i < itemCoordinates.length; i++) {
      let item = itemCoordinates[i];
      if (item.length !== 2) {
        continue;
      }
      result.push({ lat: item[1], lng: item[0] }); // lat-long
    }
    return result;
  },

  // convert geojson to 1 point for react map
  // in: geojson of point
  // out: object
  convertGeoJsonToPoint: data => {
    return { lat: data[1], lng: data[0] };
  },

  convertGeoJsonToMap: (geojson, type) => {
    let result = [];
    switch (type) {
      case 'Point': {
        result = WrapperCoordinateMap.convertGeoJsonToPoint(geojson);
        break;
      }
      case 'Polygon': {
        result = WrapperCoordinateMap.convertGeoJsonToPolygon(geojson);
        break;
      }
      case 'MultiPolygon': {
        result = WrapperCoordinateMap.convertGeoJsonToMultiPolygon(geojson);
      }
    }
    return result;
  },
};

export default WrapperCoordinateMap;
