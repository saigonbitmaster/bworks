import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

export default class TimeCounter extends Component {
  static propTypes = {
    start: PropTypes.object,
  };
  interval = null;

  constructor(props) {
    super(props);
    const { start } = props;
    this.state = {
      start,
      count: 0,
      current: moment('2000-01-01'),
    };
    this.interval = setInterval(this.intervalRefreshView, 1000);
  }

  intervalRefreshView = () => {
    const { current } = this.state;
    current.add(1, 'seconds');
    this.setState({ current });
  };

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    const { current } = this.state;
    return <label style={{ paddingLeft: 8 }}>{current.format('mm:ss')}</label>;
  }
}
