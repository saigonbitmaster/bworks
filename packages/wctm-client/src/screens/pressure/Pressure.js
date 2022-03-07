import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Datagrid,
  FunctionField,
  translate,
  Header,
  // CUSTOM,
  TextField,
  CUSTOM,
  withDataProvider,
  DateField,
  NumberField,
  FlexFormFilter,
  List,
} from 'ra-loopback3';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Paper, Grid } from '@material-ui/core';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { concat, groupBy } from 'lodash';
import moment from 'moment-timezone';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
} from 'recharts';
// import format from '../../util/format';
import SelectHourDayMonthYearFromTo from '../../components/SelectHourDayMonthYearFromTo';
import config from '../../Config';

const styles = {
  high: { color: 'red' },
  low: { color: 'blue' },
  loss: { color: 'green' },
};
const CustomFunctionField = withStyles(styles)(
  ({ classes, translate, hasList, hasShow, hasEdit, hasCreate, dataProvider, ...props }) => {
    if (props.record && props.record[props.source]) {
      return (
        <FunctionField
          className={classes[props.record[props.source]]}
          render={record => translate(`generic.conclusionPressure.${record[props.source]}`)}
          {...props}
        />
      );
    } else {
      return null;
    }
  },
);
class Pressure extends Component {
  refController = React.createRef();
  formRef = React.createRef();

  state = {
    filter: {
      typeTime: 'hour',
      day: moment().toDate(),
    },
    dataCollect: [],
    loggerNames: [],
  };

  componentDidMount = () => {
    this.getData(this.state.filter);
  };

  onChangeFilter = filter => {
    if (this.refController.current){
    this.setState({ filter });
    this.getData(filter);
    let refController = this.refController;
    refController.current.updateFilter();}
  };

  onChangeTime = () => {};

  getData = filter => {
    const tmp = { where: filter };
    this.props
      .dataProvider(CUSTOM, 'Clients/getInfoWaterPressure', {
        fullUrl: true,
        method: 'GET',
        query: { filter: JSON.stringify(tmp) },
      })
      .then(({ data: [data] }) => {
        // console.log('res', res);
        if (data && data.loggers) {
          let dataCollect = [];
          let key;
          switch (this.state.filter.typeTime) {
            case 'hour': {
              key = 'HH:mm';
              break;
            }
            case 'day': {
              key = 'DD/MM/YYYY HH:mm';
              break;
            }
          }

          // Group by time, format time and re-label
          const dmaName = data.name;
          const loggerData = concat(
            ...data.loggers.map(logger =>
              logger.data.map(datum => {
                datum.loggerName = logger.name;
                return datum;
              }),
            ),
          );
          const groupedByTimeLoggerData = groupBy(loggerData, 'logTime');
          const groupedTimestamps = Object.keys(groupedByTimeLoggerData);
          for (let timestamp of groupedTimestamps) {
            const parsedTimestamp = parseInt(timestamp, 10);
            const newLoggerDatum = { logTime: moment(parsedTimestamp).format(key) };
            const groupedLoggerData = groupedByTimeLoggerData[timestamp];
            for (let { loggerName, pressure } of groupedLoggerData) {
              newLoggerDatum[loggerName] = pressure;
            }
            dataCollect.push(newLoggerDatum);
          }

          this.setState({ dataCollect, loggerNames: data.loggers.map(i => i.name), dmaName });
        }
      });
  };

  render() {
    const { dataProvider, translate, theme, classes, ...rest } = this.props;
    const { filter, loggerNames, dataCollect } = this.state;

    let optionFormat;
    switch (filter.typeTime) {
      case 'hour': {
        optionFormat = { hour: 'numeric', minute: 'numeric' };
        break;
      }
      case 'day': {
        optionFormat = { year: 'numeric', month: 'numeric', day: 'numeric' };
        break;
      }
      // case 'month': {
      //   optionFormat = { year: 'numeric', month: 'numeric' };
      //   break;
      // }
      // case 'year': {
      //   optionFormat = { year: 'numeric' };
      //   break;
      // }
    }

    const renderArea = [];
    const renderLinearGradient = [];

    for (let i = 0; i < loggerNames.length; i++) {
      if (filter.typeTime === 'hour') {
        renderArea.push(
          <Line
            key={i}
            dot={false}
            type="monotone"
            dataKey={loggerNames[i]}
            stroke={config.color.flowPressureChart[i]}
          />,
        );
      } else if (filter.typeTime === 'day') {
        renderArea.push(
          <Area
            key={i}
            type="monotone"
            dataKey={loggerNames[i]}
            stroke={config.color.flowPressureChart[i]}
            fillOpacity={1}
            fill={`url(#color${i})`}
          />,
        );
        renderLinearGradient.push(
          <linearGradient key={i} id={`color${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={config.color.flowPressureChart[i]} stopOpacity={0.8} />
            <stop offset="95%" stopColor={config.color.flowPressureChart[i]} stopOpacity={0} />
          </linearGradient>,
        );
      }
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <Paper>
            <Header title={translate('generic.pressureChart.titleChart')} />
            <Grid container>
              <Grid item xs={12} sm={12}>
                {/* <ReferenceInput reference="dmas" source="dmaId" allowEmpty>
                  <SelectInput optionText="name" />
                </ReferenceInput> */}

                <FlexFormFilter
                  formName={'filterFormPressure'}
                  onChange={this.onChangeFilter}
                  formRef={this.formRef}
                  defaultValue={{
                    typeTime: 'hour',
                    day: moment().toDate(),
                  }}
                >
                  <SelectHourDayMonthYearFromTo
                    onChangeTime={this.onChangeTime}
                    sourceTypeTime={'typeTime'}
                    sourceDayFrom={'from'}
                    sourceDayTo={'to'}
                    // sourceMonthFrom={'monthFrom'}
                    // sourceMonthTo={'monthTo'}
                    // sourceYearFrom={'yearFrom'}
                    // sourceYearTo={'yearTo'}
                    sourceHour={'day'}
                  />
                </FlexFormFilter>
              </Grid>
              <Grid item xs={12} sm={12} style={{ height: '300px' }}>
                <ResponsiveContainer>
                  {filter.typeTime === 'hour' ? (
                    <LineChart data={dataCollect} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                      <XAxis
                        dataKey="logTime"
                        label={{
                          value: translate('generic.time'),
                          position: 'insideBottomRight',
                          fontSize: '0.8em',
                          offset: 0,
                        }}
                        tick={{ fontSize: '0.8em' }}
                      />

                      <YAxis
                        padding={{ top: 10 }}
                        tick={{ fontSize: '0.8em' }}
                        label={{ value: translate('generic.units.bar'), position: 'top', fontSize: '0.8em' }}
                      />

                      <Legend wrapperStyle={{ fontSize: '0.8em' }} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip labelStyle={{ fontSize: '0.8em' }} itemStyle={{ fontSize: '0.8em' }} />
                      {renderArea}
                    </LineChart>
                  ) : filter.typeTime === 'day' ? (
                    <AreaChart data={dataCollect} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                      <defs>{renderLinearGradient}</defs>
                      <XAxis
                        dataKey="logTime"
                        label={{
                          value: translate('generic.time'),
                          position: 'insideBottomRight',
                          fontSize: '0.8em',
                          offset: 0,
                        }}
                        tick={{ fontSize: '0.8em' }}
                      />

                      <YAxis
                        padding={{ top: 10 }}
                        tick={{ fontSize: '0.8em' }}
                        label={{ value: translate('generic.units.bar'), position: 'top', fontSize: '0.8em' }}
                      />

                      <Legend wrapperStyle={{ fontSize: '0.8em' }} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip labelStyle={{ fontSize: '0.8em' }} itemStyle={{ fontSize: '0.8em' }} />
                      {renderArea}
                    </AreaChart>
                  ) : null}
                </ResponsiveContainer>
              </Grid>
              <Grid item xs={12} sm={12}>
                <List
                  refController={this.refController}
                  {...rest}
                  className="subheader"
                  resource="custompressures"
                  fixUrl="clients/getAlertWaterPressure"
                  title={translate('generic.pressureChart.titleList')}
                  filter={filter || {}}
                  bulkActions={false}
                >
                  <Datagrid>
                    <DateField source="time" options={optionFormat} label={translate('generic.time')} />
                    {/* <TextField source="dmaName" label={translate('generic.pressureChart.dmaName')} /> */}
                    <TextField source="loggerName" label={translate('generic.pressureChart.dataLoggerName')} />
                    <NumberField source="value" label={translate('generic.pressureChart.totalPressure')} />
                    <CustomFunctionField
                      source="type"
                      label={translate('generic.pressureChart.status')}
                      {...this.props}
                    />
                  </Datagrid>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}
Pressure.propTypes = {
  theme: PropTypes.object,
  translate: PropTypes.func,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
};
Pressure.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
// eslint-disable-next-line
const mapStateToProps = state => {
  return {};
};
const enhance = compose(withDataProvider, connect(mapStateToProps, {}), withStyles(styles), withTheme, translate);

export default enhance(Pressure);
