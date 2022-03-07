import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import { translate } from 'ra-loopback3';
import { withTheme } from '@material-ui/core';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, CartesianGrid, Label, Legend, Tooltip } from 'recharts';
import format from '../../util/format';

const FONT_SIZE = '0.8em';
class SubChartSumFlow extends Component {
  formatTime = (type, time) => {
    switch (type) {
      case 'hour': {
        const timeFormat = moment(time);
        return `${timeFormat.format('HH:mm')} - ${timeFormat.endOf('hour').format('HH:mm')}`;
      }
      case 'day':
        return moment(time).format('L');
      case 'month': {
        const timeFormat = moment(time);
        return `${timeFormat.format('L')} - ${timeFormat.endOf('month').format('L')}`;
      }
      case 'year':
        return moment(time).format('YYYY');
      default:
        return time;
    }
  };
  // formatData = data => {
  //   let res = [];
  //   for (let i = 0; i < data.length; i++) {
  //     let item = Object.assign({}, data[i]);
  //     item.maxFlow = format.formatWithDec(item.maxFlow, config.numberDec);
  //     res.push(item);
  //   }
  //   return res;
  // };
  render() {
    const { theme, translate, data, type } = this.props;
    // console.log('render SubChartSumFlow', data);
    // let formatData = this.formatData(data);
    if (!data.length) {
      return null;
    }
    return (
      <ResponsiveContainer width={'100%'} aspect={3}>
        <BarChart data={data} margin={{ top: 30, right: 5, bottom: 30, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="logTime"
            domain={['dataMin', 'dataMax']}
            tickFormatter={time => this.formatTime(type, time)}
            label={{
              value: translate('generic.time'),
              position: 'insideBottomRight',
              fontSize: FONT_SIZE,
              offset: 0,
            }}
            tick={{ fontSize: FONT_SIZE }}
          />
          <YAxis yAxisId="maxFlow" tick={{ fontSize: FONT_SIZE }}>
            <Label value={translate('generic.units.flow')} offset={10} position="top" fontSize={FONT_SIZE} />
          </YAxis>
          <Tooltip
            labelStyle={{ fontSize: FONT_SIZE }}
            itemStyle={{ fontSize: FONT_SIZE }}
            labelFormatter={time => this.formatTime(type, time)}
            // eslint-disable-next-line
            formatter={(name, value, props) => {
              return `${format.formatNumber(name, 0)}`;
            }}
          />
          <Legend />
          <Bar
            yAxisId="maxFlow"
            dataKey="maxFlow"
            fill={theme.palette.primary.main}
            // type="linear"
            dot={false}
            name={`${translate('generic.sumFlow')} (m³)`}
            maxBarSize={30}
            strokeOpacity={1}
            margin={{ left: 0 }}
            hide={false}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

SubChartSumFlow.propTypes = {
  dataProvider: PropTypes.func,
  theme: PropTypes.object,
  translate: PropTypes.func,
  data: PropTypes.array,
  type: PropTypes.string,
};
const enhance = compose(withTheme, translate);
export default enhance(SubChartSumFlow);
