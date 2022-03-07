import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RealtimeWidget from './RealtimeWidget';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CustomerIcon } from '../../../styles/Icons';

const data = [
  {
    name: '07/19',
    ward1: 4000,
    ward2: 2400,
    ward3: 2400,
  },
  {
    name: '08/19',
    ward1: 3000,
    ward2: 1398,
    ward3: 2210,
  },
  {
    name: '09/19',
    ward1: 3000,
    ward2: 4800,
    ward3: 2290,
  },
  {
    name: '10/19',
    ward1: 3780,
    ward2: 3908,
    ward3: 2500,
  },
  {
    name: '11/19',
    ward1: 2890,
    ward2: 3800,
    ward3: 2181,
  },
];

export default class CtmWidget extends Component {
  static propTypes = {
    project: PropTypes.string,
  };

  render() {
    const { project } = this.props;
    return (
      <RealtimeWidget
        project={project}
        headers={{ title: 'Customer', subheader: 'Khách hàng sử dụng nước' }}
        icon={CustomerIcon}
      >
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer debounce={500}>
            <BarChart
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
              <Bar type="monotone" dataKey="ward1" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Bar type="monotone" dataKey="ward2" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              <Bar type="monotone" dataKey="ward3" stackId="1" stroke="#ffc658" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </RealtimeWidget>
    );
  }
}

CtmWidget.defaultProps = {
  project: 'ctm',
};
