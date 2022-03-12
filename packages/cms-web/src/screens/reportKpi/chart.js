import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Create, FlexForm, TextInput, required, translate, EditorInput, DateTimeInput } from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import { PasswordInput } from 'react-admin';
import { Chart } from "react-google-charts";
import {
  RadarChart,
  PolarGrid,
  PolarRadiusAxis,
  PolarAngleAxis,
  Radar,
  AreaChart,
  Area,
  Legend,
  Treemap,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  PieChart,
  Pie,
 
  ResponsiveContainer,
} from 'recharts';

//January, February, March, April, May, June, July, August, September, October, November, December



 const data = [
  ["Status", "Percentage"],
  ["Up time", 360000],
  ["Down time", 800],
  ["Maintain time", 600],
  
];

 const options = {
  backgroundColor: 'transparent',
  title: "System uptime",
};



const data3 = [
  {
    name: '01-01-2022',
    "Post job": 120000,
    "Bid job": 250000,
    "Negotiate contract": 100000,
  },
  {
    name: '02-01-2022',
    "Post job": 150000,
    "Bid job": 270000,
    "Negotiate contract": 80000,
  },
  {
    name: '03-01-2022',
     "Post job": 80000,
    "Bid job": 160000,
    "Negotiate contract": 90000,
  },
  {
    name: '04-01-2022',
   "Post job": 250000,
    "Bid job": 300000,
    "Negotiate contract": 150000,
  },
  {
    name: '05-01-2022',
    "Post job": 280000,
    "Bid job": 400000,
    "Negotiate contract": 130000,
  },
  {
    name: '06-01-2022',
    "Post job": 400000,
    "Bid job": 800000,
    "Negotiate contract": 400000,
  },
  {
    name: '07-01-2022',
    "Post job": 500000,
    "Bid job": 600000,
    "Negotiate contract": 450000,
  },
];

const data4 = [
  {
    name: '01-01-2022',
    "Post job (ms)": 40,
    "Bid job (ms)": 24,
    "Negotiate contract (ms)": 30,
  },
  {
    name: '02-01-2022',
    "Post job (ms)": 45,
    "Bid job (ms)": 16,
    "Negotiate contract (ms)": 38,
  },
  {
    name: '03-01-2022',
     "Post job (ms)": 20,
    "Bid job (ms)": 66,
    "Negotiate contract (ms)": 44,
  },
  {
    name: '04-01-2022',
   "Post job (ms)": 55,
    "Bid job (ms)": 66,
    "Negotiate contract (ms)": 50,
  },
  {
    name: '05-01-2022',
    "Post job (ms)": 23,
    "Bid job (ms)": 44,
    "Negotiate contract (ms)": 33,
  },
  {
    name: '06-01-2022',
    "Post job (ms)": 20,
    "Bid job (ms)": 66,
    "Negotiate contract (ms)": 44,
  },
  {
    name: '07-01-2022',
    "Post job (ms)": 11,
    "Bid job (ms)": 25,
    "Negotiate contract (ms)": 40,
  },
];



const data5 = [
  ["Status", "Percentage"],
  ["Proper access", 1000000],
  ["UnKnown access", 10000],
  ["Dropped access", 30000],
  
 
];

 const options5 = {
  backgroundColor: 'transparent',
  title: "Security",
};


class CreatePostJob extends Component {
  render() {
    const { props } = this;

    return (
      <div>
        <Grid middle container spacing={4} direction="row" justifyContent="center" alignItems="center" >
          <Grid middle item xs={12} sm={6} >
            <div>API calls</div>
            <br />
            <BarChart width={730} height={320} data={data3}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis/>
              <Tooltip />
              <Legend  />
              <Bar dataKey="Post job" fill="#8884d8" />
              <Bar dataKey="Bid job" fill="#82ca9d" />
              <Bar dataKey="Negotiate contract" fill="#82ca9d" />
              
            </BarChart>
          </Grid>
        
          <Grid middle item xs={12} sm={6}>
          <div>API call average latency(ms)</div>
            <br />
            <BarChart width={730} height={320} data={data4}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Post job (ms)" fill="#8884d8" />
              <Bar dataKey="Bid job (ms)" fill="#82ca9d" />
              <Bar dataKey="Negotiate contract (ms)" fill="#8884d8" />
            </BarChart>{' '}
          </Grid>
          <Grid middle item xs={12} sm={6}>


            
          <Chart
         
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"400px"}
    />
          </Grid>
          <Grid right item xs={12} sm={6}>
          <Chart
         
      chartType="PieChart"
      data={data5}
      options={options5}
      width={"100%"}
      height={"400px"}
    />
          </Grid>
        </Grid>
      </div>
    );
  }
}

CreatePostJob.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
};
CreatePostJob.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(translate);
export default enhance(CreatePostJob);
