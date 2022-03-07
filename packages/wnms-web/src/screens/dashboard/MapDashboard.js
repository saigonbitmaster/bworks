import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withDataProvider, CUSTOM } from 'ra-loopback3';
import { Grid, withTheme } from '@material-ui/core';
import MapStatus from './MapStatus';
import LatestStatus from './LatestStatus';
import slugify from 'slugify';
import { includes } from 'lodash';
class MapDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentStatus: [], filter: '', filterStatus: [] };
  }
  componentDidMount() {
    this.loadStatus();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.filter !== this.state.filter) {
      const { currentStatus, filter } = this.state;
      if (filter) {
        this.updateFilterStatus(currentStatus);
      } else {
        this.setState({ filterStatus: currentStatus });
      }
    }
  }

  loadStatus = () => {
    const _this = this;
    const { dataProvider, baseOnFlowLogger } = this.props;
    dataProvider(CUSTOM, 'dmas', {
      subUrl: 'currentStatus',
      method: 'get',
      query: { mode: baseOnFlowLogger ? 'FlowLogger' : 'Dma', deep: 3 },
    }).then(res => {
      if (res) {
        this.setState({ currentStatus: res.data }, () => _this.updateFilterStatus(res.data));
      }
    });
  };

  updateFilterStatus = currentStatus => {
    const { filter } = this.state;
    const options = { locale: 'vi', lower: true };
    const filterKey = slugify(filter, options);
    const filterStatus = currentStatus.filter(
      dma =>
        includes(slugify(dma.name, options), filterKey) ||
        dma.flowLoggers.some(logger => includes(slugify(logger.name + ' ' + logger.optionKey, options), filterKey)),
    );
    this.setState({ filterStatus });
  };

  onChangeDisPlay = (e, value) => {
    this.setState(
      {
        currentStatus: [],
      },
      this.loadStatus,
    );
    this.props.onChangeDisPlay(value);
  };

  onChangeFilter = val => {
    this.setState({ filter: val });
  };

  render() {
    const { theme, baseOnFlowLogger, onChangeFocus, focus } = this.props;
    const { filter, filterStatus } = this.state;
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={9} style={{ display: 'flex' }}>
          <MapStatus focus={focus} theme={theme} currentStatus={filterStatus} baseOnFlowLogger={baseOnFlowLogger} />
        </Grid>
        <Grid item xs={12} md={3} style={{ display: 'flex' }}>
          <LatestStatus
            filter={filter}
            onChangeFilter={this.onChangeFilter}
            currentStatus={filterStatus}
            baseOnFlowLogger={baseOnFlowLogger}
            onChangeDisPlay={this.onChangeDisPlay}
            onChangeFocus={onChangeFocus}
          />
        </Grid>
      </Grid>
    );
  }
}

MapDashboard.propTypes = {
  dataProvider: PropTypes.func.isRequired,
  theme: PropTypes.object,
  defaultState: PropTypes.object,
  location: PropTypes.object,
  onChangeDisPlay: PropTypes.func,
  baseOnFlowLogger: PropTypes.bool,
  onChangeFocus: PropTypes.func,
  focus: PropTypes.object,
};

const enhance = compose(withDataProvider, withTheme);

export default enhance(MapDashboard);
