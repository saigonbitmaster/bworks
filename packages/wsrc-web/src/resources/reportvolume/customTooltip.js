import React, { Component } from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

class CustomTooltip extends Component {
  propTypes = {
    active: PropTypes.any,
    payload: PropTypes.object,
    name: PropTypes.name,
    value: PropTypes.any,
    formatTime: PropTypes.string,
  };
  render() {
    const { active, payload, name, value, formatTime } = this.props;
    if (active) {
      return (
        <div>
          <p>{`${name} : ${moment(payload[0].value).format(formatTime)}`} </p>
          <p>{`${value} : ${payload[1].value}`}</p>
        </div>
      );
    }

    return null;
  }
}

export default CustomTooltip;
