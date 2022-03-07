import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Datagrid,
  FunctionField,
  translate,
  Header,
  // CUSTOM,
  withDataProvider,
  DateField,
  NumberField,
  TextField,
  FlexFormFilter,
  List,
  CUSTOM,
  SelectInput,
} from 'ra-loopback3';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Paper, Grid } from '@material-ui/core';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
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
import { flatten, groupBy } from 'lodash';
// import format from '../../util/format';
import SelectHourDayMonthYearFromTo from '../../components/SelectHourDayMonthYearFromTo';
import config from '../../Config';

const styles = {
  high: { color: 'red' },
  low: { color: 'blue' },
};
const choices = [
  { id: 'ph', name: 'generic.qualityWaterChart.ph' },
  { id: 'clo', name: 'generic.qualityWaterChart.clo' },
  { id: 'ntu', name: 'generic.qualityWaterChart.ntu' },
];

const CustomFunctionField = withStyles(styles)(
  ({ classes, translate, hasList, hasShow, hasEdit, hasCreate, dataProvider, ...props }) => {
    if (props.record && props.record[props.source]) {
      return (
        <FunctionField
          className={classes[props.record[props.source]]}
          render={record => `${translate(`generic.conclusionQuality.${record[props.source]}`)}`}
          {...props}
        />
      );
    } else {
      return <FunctionField render={record => `${translate(record.status)}`} {...props} />;
    }
  },
);

class QualityWater extends Component {
  refController = React.createRef();
  formRef = React.createRef();

  state = {
    filter: {
      typeTime: 'hour',
      hour: moment().toDate(),
      typeQualityWater: 'ph',
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
      .dataProvider(CUSTOM, 'Clients/getInfoQualityWater', {
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
              key = 'H:mm';
              break;
            }
            case 'day': {
              key = 'DD/MM/YYYY';
              break;
            }
            // case 'month': {
            //   key = 'MM/YYYY';
            //   break;
            // }
            // case 'year': {
            //   key = 'YYYY';
            //   break;
            // }
          }

          // Group by time, format time and re-label
          const dmaName = data.name;
          const loggerData = flatten(
            data.loggers.map(logger => {
              return logger.data[0].data.map(datum => {
                datum.loggerName = logger.name;
                return datum;
              });
            }),
          );
          const groupedByTimeLoggerData = groupBy(loggerData, 'logTime');
          const groupedTimestamps = Object.keys(groupedByTimeLoggerData);
          for (const timestamp of groupedTimestamps) {
            const parsedTimestamp = parseInt(timestamp, 10);
            const newLoggerDatum = { logTime: moment(parsedTimestamp).format(key) };
            const groupedLoggerData = groupedByTimeLoggerData[timestamp];
            for (let datum of groupedLoggerData) {
              if (datum[filter.typeQualityWater] && datum.loggerName) {
                newLoggerDatum[datum.loggerName] = datum[filter.typeQualityWater];
              }
            }
            dataCollect.push(newLoggerDatum);
          }
          this.setState({ dataCollect, loggerNames: data.loggers.map(i => i.name), dmaName });
        }
      });
  };

  render() {
    const { dataProvider, translate, theme, classes, ...rest } = this.props;
    const { filter, dataCollect, loggerNames } = this.state;

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

    for (let index = 0; index < loggerNames.length; index++) {
      if (filter.typeTime === 'hour') {
        renderArea.push(
          <Line
            key={index}
            dot={false}
            type="monotone"
            dataKey={loggerNames[index]}
            stroke={config.color.qualityWaterChart[index]}
          />,
        );
      } else {
        renderArea.push(
          <Area
            key={index}
            type="monotone"
            dataKey={loggerNames[index]}
            stroke={config.color.qualityWaterChart[index]}
            fillOpacity={1}
            fill={`url(#color${index})`}
          />,
        );

        renderLinearGradient.push(
          <linearGradient id={`color${0}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={config.color.qualityWaterChart[index]} stopOpacity={0.8} />
            <stop offset="95%" stopColor={config.color.qualityWaterChart[index]} stopOpacity={0} />
          </linearGradient>,
        );
      }
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <Paper>
            <Header title={translate('generic.qualityWaterChart.titleChart')} />
            <Grid container>
              <Grid item xs={12} sm={12}>
                <FlexFormFilter
                  formName={'filterFormQualityWater'}
                  onChange={this.onChangeFilter}
                  formRef={this.formRef}
                  defaultValue={{
                    typeTime: 'hour',
                    hour: moment().toDate(),
                    typeQualityWater: 'ph',
                  }}
                >
                  <SelectInput
                    source="typeQualityWater"
                    label={translate('generic.qualityWaterChart.typeQualityWater')}
                    choices={choices}
                    style={{ marginLeft: '5px', float: 'left', width: '50px' }}
                  />
                  <SelectHourDayMonthYearFromTo
                    onChangeTime={this.onChangeTime}
                    sourceTypeTime={'typeTime'}
                    sourceDayFrom={'dayFrom'}
                    sourceDayTo={'dayTo'}
                    // sourceMonthFrom={'monthFrom'}
                    // sourceMonthTo={'monthTo'}
                    // sourceYearFrom={'yearFrom'}
                    // sourceYearTo={'yearTo'}
                    sourceHour={'hour'}
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
                        domain={[0, 'dataMax']}
                        type="number"
                        label={{
                          value: translate(`generic.units.${filter.typeQualityWater}`),
                          position: 'top',
                          fontSize: '0.8em',
                        }}
                      />

                      <Legend wrapperStyle={{ fontSize: '0.8em' }} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip labelStyle={{ fontSize: '0.8em' }} itemStyle={{ fontSize: '0.8em' }} />
                      {renderArea}
                    </LineChart>
                  ) : filter.typeTime === 'day' ? (
                    <AreaChart data={dataCollect} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
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
                        label={{
                          value: translate(`generic.units.${filter.typeQualityWater}`),
                          position: 'top',
                          fontSize: '0.8em',
                        }}
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
                  resource="customqualitywaters"
                  fixUrl="clients/getAlertQualityWater"
                  title={translate('generic.qualityWaterChart.titleList')}
                  filter={filter || {}}
                  bulkActions={false}
                >
                  <Datagrid>
                    <DateField source="time" options={optionFormat} label={translate('generic.time')} />
                    <TextField source="loggerName" label={translate('generic.pressureChart.dataLoggerName')} />
                    <NumberField
                      source={'value'}
                      label={`${translate(`generic.qualityWaterChart.${filter.typeQualityWater}`)} (${translate(
                        `generic.units.${filter.typeQualityWater}`,
                      )})`}
                    />
                    <CustomFunctionField
                      source="type"
                      label={translate('generic.qualityWaterChart.status')}
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
QualityWater.propTypes = {
  theme: PropTypes.object,
  translate: PropTypes.func,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
};
QualityWater.detaultProps = {
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

export default enhance(QualityWater);
