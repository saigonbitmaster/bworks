import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { CustomPage, withDataProvider, CUSTOM } from 'ra-loopback3';
import { Grid, withTheme } from '@material-ui/core';
import TopStatistic from './widget/TopStatistic';
import MapStatus from './MapStatus';
import GeneralInfo from './GeneralInfo';

class Dashboard extends React.Component {
  state = { currentStatus: [], baseOnFlowLogger: false, activeFactoryId: null };
  componentDidMount() {
    this.loadStatus();
  }

  loadStatus = () => {
    const { dataProvider } = this.props;
    let { baseOnFlowLogger } = this.state;
    dataProvider(CUSTOM, 'WaterSources', {
      subUrl: 'dashboard',
      method: 'get',
      query: { mode: baseOnFlowLogger ? 'dataLogger' : 'waterSource' },
    }).then(res => {
      if (res) {
        this.setState({ currentStatus: res.data });
      }
    });
  };

  onChangeDisPlay = (e, value) => {
    this.setState(
      {
        baseOnFlowLogger: value,
      },
      this.loadStatus,
    );
  };

  onChangeSelectedFactory = id => {
    this.setState({ activeFactoryId: id });
  };

  render() {
    const { theme } = this.props;
    const { currentStatus, baseOnFlowLogger, activeFactoryId } = this.state;
    return (
      <CustomPage title={'generic.pages.dashboard'}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopStatistic />
          </Grid>
          <Grid item xs={12} md={9} style={{ display: 'flex' }}>
            <MapStatus theme={theme} onChangeSelectedFactory={this.onChangeSelectedFactory} />
          </Grid>
          <Grid item xs={12} md={3} style={{ display: 'flex' }}>
            <GeneralInfo activeFactoryId={activeFactoryId} />
          </Grid>
        </Grid>
      </CustomPage>
    );
  }
}

Dashboard.propTypes = {
  dataProvider: PropTypes.func.isRequired,
  theme: PropTypes.object,
};

const enhance = compose(withDataProvider, withTheme);

export default enhance(Dashboard);
