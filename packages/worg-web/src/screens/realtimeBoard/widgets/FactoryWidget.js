import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RealtimeWidget from './RealtimeWidget';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FactoryIcon } from '../../../styles/Icons';

const data = [
  {
    name: '07/19',
    factory1: 3000,
    factory2: 2400,
    factory3: 2400,
  },
  {
    name: '08/19',
    factory1: 4000,
    factory2: 1398,
    factory3: 2210,
  },
  {
    name: '09/19',
    factory1: 2500,
    factory2: 3800,
    factory3: 2290,
  },
  {
    name: '10/19',
    factory1: 1780,
    factory2: 3908,
    factory3: 2000,
  },
  {
    name: '11/19',
    factory1: 2890,
    factory2: 4800,
    factory3: 2181,
  },
];

export default class FactoryWidget extends Component {
  static propTypes = {
    project: PropTypes.string,
  };

  render() {
    const { project } = this.props;
    return (
      <RealtimeWidget
        project={project}
        headers={{ title: 'Plant', subheader: 'Lượng nước sản xuất' }}
        icon={FactoryIcon}
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
              <Area type="monotone" dataKey="factory1" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="factory2" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="factory3" stackId="1" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </RealtimeWidget>
    );
  }
}

FactoryWidget.defaultProps = {
  project: 'nms',
};
