import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withDataProvider, CUSTOM } from 'ra-loopback3';
import { isArray } from 'lodash';
import GeoJsonView from './GeoJsonView';

class KmlView extends Component {
  static propTypes = {
    types: PropTypes.arrayOf(PropTypes.string),
    common: PropTypes.string,
    dataProvider: PropTypes.func,
    options: PropTypes.object,
    refMap: PropTypes.object,
  };
  static defaultProps = {
    options: { preserveViewport: true },
  };

  state = { kmls: [] };

  componentDidMount() {
    this.getKmls();
  }

  getKmls = async () => {
    const { types, common, dataProvider } = this.props;
    const res = await dataProvider(CUSTOM, 'maps', { subUrl: 'kml', method: 'post', body: { types, common } });
    if (isArray(res.data) && !this.unmount) {
      this.setState({ kmls: res.data });
    }
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  render() {
    const { kmls } = this.state;
    const { options, refMap } = this.props;
    return (
      <Fragment>
        {kmls.map(kml => {
          return (
            <Fragment key={kml.id}>
              {refMap.current && kml.geoJsonObj && <GeoJsonView refMap={refMap} data={kml.geoJsonObj} />}
              {/* <KmlLayer url={kml.url.replace('.s3.', '.s3-')} options={options} /> */}
            </Fragment>
          );
        })}
      </Fragment>
    );
  }
}
export default compose(withDataProvider)(KmlView);
