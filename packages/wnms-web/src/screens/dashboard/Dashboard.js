import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { CustomPage, withDataProvider, CUSTOM, CustomPageController } from 'ra-loopback3';
import { Grid, withTheme } from '@material-ui/core';
import queryString from 'query-string';
import { isEmpty } from 'lodash';
import TopStatistic from './widget/TopStatistic';
import MapStatus from './MapStatus';
import LatestStatus from './LatestStatus';
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    const defaultState = this.getDefaultState();
    const { baseOnFlowLogger: defaultBaseOnFlowLogger } = defaultState;
    this.state = {
      update: 1,
      currentStatus: [],
      baseOnFlowLogger: defaultBaseOnFlowLogger || false,
      screen: 'dashboard',
    };
  }

  componentDidMount() {
    this.loadStatus();
    this.interval = setInterval(this.loadInterval, 300000); // 5 minutes
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  loadInterval = () => {
    this.setState({ update: this.state.update });
    this.loadStatus();
  };

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
    return { baseOnFlowLogger: true };
  };

  render() {
    const { theme } = this.props;
    const { currentStatus, baseOnFlowLogger, screen, update } = this.state;
    return (
      <CustomPage key={update} title={'generic.pages.dashboard'} header={false} screen={screen}>
        <CustomPageController screen={screen} state={{ baseOnFlowLogger }} hasState>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopStatistic />
            </Grid>
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
        </CustomPageController>
      </CustomPage>
    );
  }
}

Dashboard.propTypes = {
  dataProvider: PropTypes.func.isRequired,
  theme: PropTypes.object,
  defaultState: PropTypes.object,
  location: PropTypes.object,
};

const mapStateToProps = state => {
  const screenState = state.customPage['dashboard'];
  return {
    defaultState: screenState ? screenState.state : null,
  };
};

const enhance = compose(connect(mapStateToProps), withDataProvider, withTheme);

export default enhance(Dashboard);
