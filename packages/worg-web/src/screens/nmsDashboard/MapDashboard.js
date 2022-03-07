import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withDataProvider, CUSTOM } from 'ra-loopback3';
import { Grid, withTheme } from '@material-ui/core';
import queryString from 'query-string';
import { isEmpty } from 'lodash';
import MapStatus from './MapStatus';
import LatestStatus from './LatestStatus';
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    const defaultState = this.getDefaultState();
    const { baseOnFlowLogger: defaultBaseOnFlowLogger } = defaultState;
    this.state = { currentStatus: [], baseOnFlowLogger: defaultBaseOnFlowLogger || false, screen: 'dashboard' };
  }
  componentDidMount() {
    this.loadStatus();
  }

  loadStatus = () => {
    const { dataProvider } = this.props;
    const { baseOnFlowLogger } = this.state;
    dataProvider(CUSTOM, 'dmas', {
      subUrl: 'currentStatus',
      method: 'get',
      query: { mode: baseOnFlowLogger ? 'FlowLogger' : 'Dma' },
    }).then(res => {
      if (res) {
        this.setState({ currentStatus: res.data });
      }
    });
  };

  onChangeDisPlay = (e, value) => {
    this.setState(
      {
        currentStatus: [],
        baseOnFlowLogger: value,
      },
      this.loadStatus,
    );
    this.props.onChangeDisPlay(value);
  };

  getDefaultState = () => {
    const {
      location: { search },
      defaultState,
    } = this.props;
    if (search && search.length !== 0) {
      return JSON.parse(queryString.parse(search).state);
    } else if (defaultState && !isEmpty(defaultState)) {
      return defaultState;
    }
    return {};
  };

  render() {
    const { theme } = this.props;
    const { currentStatus, baseOnFlowLogger } = this.state;
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={9} style={{ display: 'flex' }}>
          <MapStatus theme={theme} currentStatus={currentStatus} baseOnFlowLogger={baseOnFlowLogger} />
        </Grid>
        <Grid item xs={12} md={3} style={{ display: 'flex' }}>
          <LatestStatus
            currentStatus={currentStatus}
            baseOnFlowLogger={baseOnFlowLogger}
            onChangeDisPlay={this.onChangeDisPlay}
          />
        </Grid>
      </Grid>
    );
  }
}

Dashboard.propTypes = {
  dataProvider: PropTypes.func.isRequired,
  theme: PropTypes.object,
  defaultState: PropTypes.object,
  location: PropTypes.object,
  onChangeDisPlay: PropTypes.func,
};

const enhance = compose(withDataProvider, withTheme);

export default enhance(Dashboard);
