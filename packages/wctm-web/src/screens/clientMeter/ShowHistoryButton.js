import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, linkToRecord, Button } from 'ra-loopback3';
import { HistoryIcon } from '../../styles/Icons';

class ShowHistoryButton extends Component {
  render() {
    const { basePath = '', record = {}, ...rest } = this.props;
    return (
      <Button
        disabled={record.status !== 'ACTIVE' && !record.startMeterDate}
        component={Link}
        to={linkToRecord(`${basePath}/histories`, record.id)}
        {...rest}
        label="generic.history"
      >
        <HistoryIcon />
      </Button>
    );
  }
}

ShowHistoryButton.propTypes = {
  basePath: PropTypes.string,
  className: PropTypes.string,
  classes: PropTypes.object,
  record: PropTypes.object,
  translate: PropTypes.func,
};

export default ShowHistoryButton;
