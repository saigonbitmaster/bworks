import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate } from 'ra-loopback3';
import { Card, CardHeader, CardContent, withTheme } from '@material-ui/core';
import moment from 'moment-timezone';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import config from '../../Config';
class BarChartVolume extends Component {
  getKeyBarChart = data => {
    if (!data || !data.length) {
      return [];
    }
    let res = [];
    for (let key in data[0]) {
      if (key === 'time') continue;
      res.push(key);
    }
    return res;
  };
  render() {
    const { data, translate } = this.props;
    if (!data || !data.length) return null;
    let keyBars = this.getKeyBarChart(data);
    let index = 0;
    return (
      <Card>
        <CardHeader title={data.name} style={{ paddingBottom: 0 }} />
        <CardContent>
          <ResponsiveContainer width="100%" minHeight={500}>
            <ComposedChart data={data} margin={{ top: 20, right: 0, left: 30, bottom: 5 }}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis
                dataKey="time"
                label={{
                  value: translate('generic.time'),
                  position: 'insideBottomRight',
                  fontSize: '0.8em',
                  offset: 0,
                }}
                tick={{ fontSize: '0.8em' }}
                tickFormatter={time => moment(time).format('MM/YYYY')}
              />
              <YAxis
                padding={{ top: 10 }}
                label={{ value: translate('generic.units.meter3'), position: 'top', fontSize: '0.8em' }}
                tick={{ fontSize: '0.8em' }}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip
                labelFormatter={time => moment(time).format('MM/YYYY')}
                labelStyle={{ fontSize: '0.8em' }}
                itemStyle={{ fontSize: '0.8em' }}
                // eslint-disable-next-line
                formatter={(value, name, props) => {
                  return `${value} ${translate('generic.units.meter3')}`;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '0.8em' }} />
              {keyBars.map(key => {
                return (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={config.color.basicChart[index++]}
                    name={key}
                    formatter={this.format}
                  />
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }
}

BarChartVolume.propTypes = {
  data: PropTypes.array.isRequired,
  translate: PropTypes.func,
  theme: PropTypes.object,
};

const enhance = compose(translate, withTheme)(BarChartVolume);

export default enhance;
