import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RealtimeWidget from './RealtimeWidget';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  {
    name: '07/19',
    source1: 4000,
    source2: 2400,
    source3: 2400,
  },
  {
    name: '08/19',
    source1: 3000,
    source2: 1398,
    source3: 2210,
  },
  {
    name: '09/19',
    source1: 2000,
    source2: 9800,
    source3: 2290,
  },
  {
    name: '10/19',
    source1: 2780,
    source2: 3908,
    source3: 2000,
  },
  {
    name: '11/19',
    source1: 1890,
    source2: 4800,
    source3: 2181,
  },
];

export default class WaterSourceWidget extends Component {
  static propTypes = {
    project: PropTypes.string,
  };

  render() {
    const { project } = this.props;
    return (
      <RealtimeWidget project={project} headers={{ title: 'Water Source', subheader: 'Nước thô cung cấp cho nhà máy' }}>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer debounce={500}>
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'm3', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend iconType="circle" />
              <Area type="monotone" dataKey="source1" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="source2" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="source3" stackId="1" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </RealtimeWidget>
    );
  }
}

WaterSourceWidget.defaultProps = {
  project: 'src',
};
