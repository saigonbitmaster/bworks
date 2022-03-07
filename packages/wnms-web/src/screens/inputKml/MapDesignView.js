import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MapRender, CUSTOM } from 'ra-loopback3';
import { KmlLayer } from 'react-google-maps';

class MapDesignView extends Component {
  refMap = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      center: props.mapOptions.defaultCenter || undefined,
      listKmls: [],
    };
  }
  async componentDidMount() {
    // console.log('MapDesignView componentDidMount');
    await this.getKml();
  }

  getKml = async () => {
    let { dataProvider } = this.props;
    let res = await dataProvider(CUSTOM, 'kmls', {
      filter: {
        where: { active: true },
      },
    });

    if (res && res.data && res.data.length) {
      let { data } = res;
      this.setState({ listKmls: data });
    } else {
      this.setState({ listKmls: [] });
    }
  };

  // eslint-disable-next-line
  async UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log('MapDesignView UNSAFE_componentWillReceiveProps');
    await this.getKml();
  }

  render() {
    const { mapOptions } = this.props;
    const { center, listKmls } = this.state;
    // console.log('MapDesignView render', listKmls);
    return (
      <MapRender
        refMap={this.refMap}
        {...mapOptions}
        defaultCenter={mapOptions.defaultCenter}
        center={center}
        isPaper={false}
      >
        {listKmls.map(item => {
          if (item.urlS3) {
            return <KmlLayer key={item.id} url={item.urlS3} options={{ preserveViewport: true }} />;
          }
        })}
      </MapRender>
    );
  }
}

MapDesignView.propTypes = {
  mapOptions: PropTypes.object,
  dataProvider: PropTypes.func,
};
MapDesignView.defaultProps = {};

export default MapDesignView;
