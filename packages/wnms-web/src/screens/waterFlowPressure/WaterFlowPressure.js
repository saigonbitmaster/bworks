import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  CustomPage,
  FlexFormFilter,
  DmaSelectInput,
  TimeRangeInput,
  Button,
  withDataProvider,
  translate,
  CUSTOM,
  CustomPageController,
} from 'ra-loopback3';
import moment from 'moment-timezone';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Grid, Tabs, Tab } from '@material-ui/core';
import { StatisticButtonIcon } from '../../styles/Icons';
import DmaLoggerChartHour from './DmaLoggerChartHour';
import DmaLoggerChartDay from './DmaLoggerChartDay';
import PressureDetailsList from './PressureDetailsList';

const styles = theme => {
  return {
    paper: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    widthFormGroup: { float: 'left', paddingRight: '8px' },
  };
};

const ALL_DMA = 'AllDma';
class WaterFlowPressure extends Component {
  formRefFilter = React.createRef();
  state = {
    chartType: '',
    chartData: [],
    update: 0,
    tabindex: 0,
    filter: {
      timeRange: {
        type: 'hour',
        from: moment()
          .startOf('day')
          .toDate(),
        to: moment()
          .endOf('day')
          .toDate(),
      },
      dmaId: ALL_DMA,
    },
    screen: 'waterFlowPressure',
  };

  componentDidMount() {
    this.onClickStatistic();
  }

  getData = filter => {
    const {
      dmaId,
      timeRange: { type, from, to },
    } = filter;
    switch (type) {
      case 'hour':
        return this.staticByHour({ type, dmaId, day: from });
      case 'day':
        return this.staticByDay({ type, dmaId, from, to });
      default:
        return;
    }
  };

  onClickStatistic = () => {
    const filter = this.formRefFilter.current.props.values;
    this.getData(filter);
    this.setState({ filter });
  };

  staticByDay = async ({ type, dmaId, from, to }) => {
    const { dataProvider } = this.props;
    let res = await dataProvider(CUSTOM, 'dmas', {
      method: 'get',
      subUrl: 'statisticRuntimeLoggerDay',
      query: {
        dmaId: dmaId === ALL_DMA ? null : dmaId,
        from: moment(from)
          .startOf('day')
          .utc(),
        to: moment(to)
          .startOf('day')
          .utc(),
      },
    });
    this.safeSetState({ chartType: type, chartData: res.data, update: this.state.update + 1 });
  };

  staticByHour = async ({ type, dmaId, day }) => {
    const { dataProvider } = this.props;
    let res = await dataProvider(CUSTOM, 'dmas', {
      method: 'get',
      subUrl: 'statisticRuntimeLoggerHour',
      query: {
        dmaId: dmaId === ALL_DMA ? null : dmaId,
        day: moment(day)
          .startOf('day')
          .utc(),
      },
    });
    this.safeSetState({ chartType: type, chartData: res.data, update: this.state.update + 1 });
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  safeSetState = state => {
    if (this.unmount) return;
    this.setState(state);
  };

  handleTabChange = (e, tabindex) => {
    this.safeSetState({ tabindex });
  };

  render() {
    const { title, translate, classes, resource, theme, ...rest } = this.props;
    const { tabindex, chartData, update, filter, chartType, screen } = this.state;
    const spacing = theme.spacing(2);
    return (
      <CustomPage title={title} header card screen={screen}>
        <CustomPageController filter={filter} resource={resource} screen={screen} hasFilter>
          <FlexFormFilter
            formName="statistic-pressure-dma"
            formRef={this.formRefFilter}
            destroyOnUnmount
            submitButton
            categorize="filter"
          >
            <DmaSelectInput
              allowEmpty={false}
              source={'dmaId'}
              label={translate('generic.dma').toUpperCase()}
              style={{ marginLeft: '5px' }}
              // alldma={ALL_DMA}
              formClassName={classes.widthFormGroup}
              flgAllLevel1={true}
            />
            <TimeRangeInput
              fullWidth
              label={''}
              types={['hour', 'day']}
              source={'timeRange'}
              defaultType={'hour'}
              formClassName={classes.widthFormGroup}
            />
            <Button
              decorate="true"
              label={translate('generic.statistic.labelButtonStatistic')}
              style={{ marginTop: '30px', float: 'left' }}
              onClick={this.onClickStatistic}
              type="submit"
            >
              <StatisticButtonIcon />
            </Button>
          </FlexFormFilter>
        </CustomPageController>
        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12}>
            {chartData && (
              <Fragment>
                <Tabs
                  style={{ marginLeft: 24 }}
                  value={tabindex}
                  onChange={this.handleTabChange}
                  aria-label={translate('generic.details')}
                >
                  <Tab value={0} label={translate('generic.chartAndWarn')} />
                  <Tab value={1} label={translate('generic.details')} />
                </Tabs>
                {tabindex == 0 &&
                  chartData.map(dmaData =>
                    chartType === 'hour' ? (
                      <DmaLoggerChartHour key={dmaData._id + update} dmaData={dmaData} />
                    ) : (
                      <DmaLoggerChartDay key={dmaData._id + update} dmaData={dmaData} />
                    ),
                  )}
                {tabindex == 1 && (
                  <PressureDetailsList {...rest} chartData={chartData} update={update} type={chartType} />
                )}
              </Fragment>
            )}
          </Grid>
        </Grid>
      </CustomPage>
    );
  }
}
WaterFlowPressure.propTypes = {
  theme: PropTypes.object,
  translate: PropTypes.func,
  title: PropTypes.string,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
  resource: PropTypes.string,
};
WaterFlowPressure.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(connect(null, {}), translate, withDataProvider, withTheme, withStyles(styles));

export default enhance(WaterFlowPressure);
