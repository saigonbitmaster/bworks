import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RealtimeWidget from './RealtimeWidget';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { NmsIcon } from '../../../styles/Icons';

const data = [
  {
    name: '07/19',
    dma1: 4000,
    dma2: 2400,
    dma3: 2400,
  },
  {
    name: '08/19',
    dma1: 3000,
    dma2: 3398,
    dma3: 2210,
  },
  {
    name: '09/19',
    dma1: 2000,
    dma2: 3800,
    dma3: 2290,
  },
  {
    name: '10/19',
    dma1: 2780,
    dma2: 3908,
    dma3: 2000,
  },
  {
    name: '11/19',
    dma1: 1890,
    dma2: 4800,
    dma3: 2181,
  },
];

export default class NmsWidget extends Component {
  static propTypes = {
    project: PropTypes.string,
  };

  render() {
    const { project } = this.props;
    return (
      <RealtimeWidget
        project={project}
        headers={{ title: 'Network', subheader: 'Mạng lưới phân phối nước sạch' }}
        icon={NmsIcon}
      >
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
              <Area type="monotone" dataKey="dma1" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="dma2" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="dma3" stackId="1" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </RealtimeWidget>
    );
  }
}

NmsWidget.defaultProps = {
  project: 'nms',
};
