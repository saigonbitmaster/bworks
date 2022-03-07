import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import { translate } from 'ra-loopback3';
import { withTheme } from '@material-ui/core';
import { Tooltip, ResponsiveContainer, LineChart, XAxis, YAxis, Line, CartesianGrid, Label, Legend } from 'recharts';
import format from '../../util/format';
// import config from '../../Config';
const FONT_SIZE = '0.8em';
class SubChartFlowPressure extends Component {
  // formatData = data => {
  //   let res = [];
  //   for (let i = 0; i < data.length; i++) {
  //     let item = Object.assign({}, data[i]);
  //     item.flowRate = format.formatWithDec(item.flowRate, config.numberDec);
  //     item.pressure = format.formatWithDec(item.pressure, config.numberDec);
  //     res.push(item);
  //   }
  //   return res;
  // };
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
  render() {
    const { theme, translate, data } = this.props;
    // console.log('render SubChartFlowPressure: ', data);
    // let formatData = this.formatData(data);
    if (!data.length) {
      return null;
    }
    return (
      <ResponsiveContainer width={'100%'} aspect={3}>
        <LineChart data={data} margin={{ top: 30, right: 5, bottom: 30, left: 5 }}>
          <XAxis
            dataKey="logTime"
            tickFormatter={time => moment(time).format('HH')}
            label={{
              value: translate('generic.time'),
              position: 'insideBottomRight',
              fontSize: FONT_SIZE,
              offset: 0,
            }}
            tick={{ fontSize: FONT_SIZE }}
            ticks={this.getTicks(data)}
          />
          <YAxis yAxisId="flowRate" scale="auto" tick={{ fontSize: FONT_SIZE }}>
            <Label value={translate('generic.units.flowRate')} position="top" offset={10} fontSize={FONT_SIZE} />
          </YAxis>
          <YAxis yAxisId="pressure" scale="auto" orientation="right" tick={{ fontSize: FONT_SIZE }}>
            <Label value={translate('generic.units.pressure')} position="top" offset={10} fontSize={FONT_SIZE} />
          </YAxis>
          <CartesianGrid strokeDasharray="3 3" />
          <Legend />
          <Line
            id="flowRate"
            yAxisId="flowRate"
            dataKey="flowRate"
            stroke={theme.palette.primary.main}
            type="linear"
            dot={false}
            name={translate('generic.nameWithUnits.flowRate')}
          />
          <Line
            id="pressure"
            yAxisId="pressure"
            dataKey="pressure"
            stroke={theme.palette.error.main}
            type="linear"
            dot={false}
            name={translate('generic.nameWithUnits.pressure')}
          />
          <Tooltip
            labelStyle={{ fontSize: FONT_SIZE }}
            itemStyle={{ fontSize: FONT_SIZE }}
            labelFormatter={val => {
              return moment(val).format('HH:mm');
            }}
            // eslint-disable-next-line
              formatter={(name, value, props) => {
              let tmp = props.dataKey === 'flowRate' ? `${format.formatNumber(name, 0)}` : name;
              return tmp;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}

SubChartFlowPressure.propTypes = {
  theme: PropTypes.object,
  translate: PropTypes.func,
  data: PropTypes.array,
};
const enhance = compose(withTheme, translate);
export default enhance(SubChartFlowPressure);
