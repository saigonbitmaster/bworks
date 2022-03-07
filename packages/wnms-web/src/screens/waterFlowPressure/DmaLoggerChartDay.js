import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate } from 'ra-loopback3';
import { groupBy, forEach, minBy, maxBy, get, round } from 'lodash';
import { createSelector } from 'reselect';
import { Card, CardHeader, CardContent, Typography, withTheme } from '@material-ui/core';
import moment from 'moment-timezone';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area, CartesianGrid, Label, Legend, Tooltip } from 'recharts';
import EnhancePressureNotifyList from './PressureNotifyList';

class DmaLoggerChartDay extends Component {
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
    const groupByDaySelector = createSelector(loggerSelector, logItems => {
      return groupBy(logItems, logItem =>
        moment(logItem.logTime)
          .startOf('day')
          .format('x'),
      );
    });
    const flowMinMaxSelector = createSelector(groupByDaySelector, logGroupByDays => {
      const res = [];
      forEach(logGroupByDays, (logGroupByDay, key) => {
        const minP = minBy(logGroupByDay, 'pressure');
        const maxP = maxBy(logGroupByDay, 'pressure');
        if (logGroupByDay) {
          res.push({
            time: parseInt(key),
            min: get(minP, 'pressure[0]'),
            max: get(maxP, 'pressure[1]'),
            minTime: get(minP, 'logTime'),
            maxTime: get(maxP, 'logTime'),
          });
        }
      });
      return res;
    });
    const notifySelector = createSelector(flowMinMaxSelector, configSelector, (pressureMinMaxByDays, config) => {
      let notis = [];
      forEach(pressureMinMaxByDays, item => {
        if (item.min < config.loss) {
          // loss
          notis.push({
            time: item.minTime,
            type: 'loss',
            value: item.min,
          });
        } else if (item.min < config.low) {
          // low
          notis.push({
            time: item.minTime,
            type: 'low',
            value: item.min,
          });
        } else if (item.max > config.high) {
          // high
          notis.push({
            time: item.time,
            type: 'high',
            value: item.maxTime,
          });
        }
      });

      return notis;
    });

    return notifySelector(logger);
  };

  renderChart({ logger, theme, translate }) {
    if (logger.data && logger.data.length) {
      return (
        <Fragment>
          <ResponsiveContainer width={'100%'} height={300}>
            <AreaChart data={logger.data} margin={{ top: 30, right: 5, bottom: 30, left: 5 }}>
              <XAxis
                dataKey="logTime"
                scale="time"
                ticks={this.getTicks(logger.data)}
                tickFormatter={time => moment(time).format('L')}
                type="number"
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
                label="-"
                labelFormatter={val =>
                  `${moment(val).format('L LT')} - ${moment(val)
                    .add(1, 'hours')
                    .format('LT')}`
                }
                formatter={value => `${round(value[0], 1)} ~ ${round(value[1], 1)}`}
              />
              <Area
                id="flowRate"
                yAxisId="flowRate"
                dataKey="flowRate"
                fill={theme.palette.primary.main}
                stroke={theme.palette.primary.main}
                // type="linear"
                dot={false}
                name={translate('generic.nameWithUnits.flowRate')}
              />
              <Area
                id="pressure"
                yAxisId="pressure"
                dataKey="pressure"
                fill={theme.palette.error.main}
                stroke={theme.palette.error.main}
                // type="linear"
                dot={false}
                name={translate('generic.nameWithUnits.pressure')}
              />
            </AreaChart>
          </ResponsiveContainer>
          <EnhancePressureNotifyList data={this.getNotificationByLogger(logger)} durationType="day" />
        </Fragment>
      );
    }

    return translate('generic.noLogData');
  }
  render() {
    const { dmaData, translate, theme } = this.props;
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
                <Typography variant="body1" component="div">
                  {this.renderChart({ logger, theme, translate })}
                </Typography>
              </Fragment>
            );
          })}
        </CardContent>
      </Card>
    );
  }
}

DmaLoggerChartDay.propTypes = {
  dmaData: PropTypes.object.isRequired,
  translate: PropTypes.func,
  theme: PropTypes.object,
};

const enhance = compose(translate, withTheme)(DmaLoggerChartDay);

export default enhance;
