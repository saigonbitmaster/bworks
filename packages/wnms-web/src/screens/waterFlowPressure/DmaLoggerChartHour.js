import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate } from 'ra-loopback3';
import { groupBy, forEach, minBy, maxBy, get } from 'lodash';
import { Card, CardHeader, CardContent, Typography, withTheme } from '@material-ui/core';
import moment from 'moment-timezone';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Line, CartesianGrid, Label, Legend, Tooltip } from 'recharts';
import { createSelector } from 'reselect';
import format from '../../util/format';
import PressureNotifyList from './PressureNotifyList';

class DmaLoggerChartHour extends Component {
  // eslint-disable-next-line no-unused-vars
  getTicks = data => {
    const result = [];
    if (data && data.length > 1) {
      const min = data[0].logTime;
      const max = data[data.length - 1].logTime;
      const step = 60 * 60 * 1000;
      let current = min - (min % step);
      while (current < max) {
        result.push(current);
        current += step;
      }
    }
    return result;
  };

  getNotificationByLogger = logger => {
    // use reselect for optimize performance
    if (!logger || !logger.meta || !logger.data) return [];
    const configSelector = state => state.meta.pressure;
    const loggerSelector = state => state.data;
    const groupByHourSelector = createSelector(loggerSelector, logItems => {
      return groupBy(logItems, logItem =>
        moment(logItem.logTime)
          .startOf('hour')
          .format('x'),
      );
    });
    const flowMinMaxSelector = createSelector(groupByHourSelector, logGroupByHours => {
      const res = [];
      forEach(logGroupByHours, (logGroupByHour, key) => {
        if (logGroupByHour) {
          res.push({
            time: parseInt(key),
            min: get(minBy(logGroupByHour, 'pressure'), 'pressure'),
            max: get(maxBy(logGroupByHour, 'pressure'), 'pressure'),
          });
        }
      });
      return res;
    });
    const notifySelector = createSelector(flowMinMaxSelector, configSelector, (pressureMinMaxByHours, config) => {
      let notis = [];
      forEach(pressureMinMaxByHours, item => {
        if (item.min < config.loss) {
          // loss
          notis.push({
            time: item.time,
            type: 'loss',
            value: item.min,
          });
        } else if (item.min < config.low) {
          // low
          notis.push({
            time: item.time,
            type: 'low',
            value: item.min,
          });
        } else if (item.max > config.high) {
          // low
          notis.push({
            time: item.time,
            type: 'high',
            value: item.max,
          });
        }
      });

      return notis;
    });

    return notifySelector(logger);
  };

  render() {
    const { dmaData, translate, theme } = this.props;
    // console.log('DmaLoggerChartHour prop', this.props);
    // console.log('DmaLoggerChartHour state', this.state);
    if (!dmaData) return null;
    return (
      <Card>
        <CardHeader title={dmaData.name} style={{ paddingBottom: 0 }} />
        <CardContent>
          {dmaData.loggers.map(logger => {
            return (
              <Fragment key={logger._id}>
                <Typography gutterBottom variant="subtitle1">
                  {logger.name} - {logger.optionKey}
                </Typography>
                <Typography variant="body1">
                  {logger.data && logger.data.length ? (
                    <Fragment>
                      <ResponsiveContainer width={'100%'} height={300}>
                        <LineChart data={logger.data} margin={{ top: 30, right: 5, bottom: 30, left: 5 }}>
                          <XAxis
                            dataKey="logTime"
                            // scale="time"
                            ticks={this.getTicks(logger.data)}
                            tickFormatter={time => moment(time).format('HH')}
                            // type="number"
                            domain={['dataMin', 'dataMax']}
                          />
                          <YAxis yAxisId="flowRate" scale="auto">
                            <Label value={translate('generic.units.flowRate')} position="top" offset={10} />
                          </YAxis>
                          <YAxis yAxisId="pressure" scale="auto" orientation="right">
                            <Label value={translate('generic.units.pressure')} position="top" offset={10} />
                          </YAxis>
                          <CartesianGrid strokeDasharray="3 3" />
                          <Legend />
                          <Tooltip
                            label="abc"
                            labelFormatter={val => moment(val).format('L LT')}
                            // formatter={value => round(value, 2)}
                            formatter={(name, value, props) => {
                              let tmp;
                              if (props.dataKey === 'flowRate') {
                                tmp = format.formatNumber(name, 0);
                              } else if (props.dataKey === 'pressure') {
                                tmp = format.formatNumber(name, 2);
                              } else {
                                tmp = name;
                              }
                              return tmp;
                            }}
                          />
                          <Line
                            id="flowRate"
                            yAxisId="flowRate"
                            dataKey="flowRate"
                            stroke={theme.palette.primary.main}
                            // type="linear"
                            dot={false}
                            name={translate('generic.nameWithUnits.flowRate')}
                          />
                          <Line
                            id="pressure"
                            yAxisId="pressure"
                            dataKey="pressure"
                            stroke={theme.palette.error.main}
                            // type="linear"
                            dot={false}
                            name={translate('generic.nameWithUnits.pressure')}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                      <PressureNotifyList data={this.getNotificationByLogger(logger)} />
                    </Fragment>
                  ) : (
                    translate('generic.noLogData')
                  )}
                </Typography>
              </Fragment>
            );
          })}
        </CardContent>
      </Card>
    );
  }
}

DmaLoggerChartHour.propTypes = {
  dmaData: PropTypes.object.isRequired,
  translate: PropTypes.func,
  theme: PropTypes.object,
};

const enhance = compose(translate, withTheme)(DmaLoggerChartHour);

export default enhance;
