import React, { Component } from 'react';
import { withDataProvider, GET_LIST } from 'ra-loopback3';
import QualityLoggerStatus from './QualityLoggerStatus';
import MapRenderWithConfig from '../../containers/map/MapRenderWithConfig';
import { Grid, withTheme } from '@material-ui/core';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
class Main extends Component {
  refMap = React.createRef();
  constructor(props) {
    super(props);
    this.state = { loggers: [] };
  }
  componentDidMount() {
    this.loadStatus();
  }

  loadStatus = () => {
    const { dataProvider } = this.props;
    dataProvider(GET_LIST, 'materialuses', {
      rawFilter: {
        where: { type: 'QualityLogger' },
        // fields: { id: true, name: true },
      },
    }).then(res => {
      if (res && res.data && res.data.length > 0) {
        this.setState({ loggers: res.data });
      }
    });
  };
  render() {
    const { theme } = this.props;
    let { loggers } = this.state;
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} style={{ display: 'flex' }}>
          <MapRenderWithConfig
            refMap={this.refMap}
            options={{ minHeight: '700px', height: 'auto' }}
            onZoomChanged={this.handleZoomChanged}
          >
            <QualityLoggerStatus theme={theme} loggers={loggers} flgShowInfo={true} />
          </MapRenderWithConfig>
        </Grid>
      </Grid>
    );
  }
}
Main.propTypes = {
  dataProvider: PropTypes.func,
  theme: PropTypes.object,
};
const enhance = compose(withDataProvider, withTheme);

export default enhance(Main);
