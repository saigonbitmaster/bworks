import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles, Chip, withTheme } from '@material-ui/core';
import moment from 'moment-timezone';

const styles = theme => ({
  chipLabel: {
    margin: theme.spacing(0.5),
  },
});
class ChipSymbolStatus extends Component {
  static propTypes = {
    time: PropTypes.oneOf(PropTypes.object, PropTypes.number),
    symbol: PropTypes.string,
    value: PropTypes.number,
    valueStatus: PropTypes.string,
    timeStatus: PropTypes.string,
    color: PropTypes.string,
    unit: PropTypes.string,
    className: PropTypes.any,
    icon: PropTypes.any,
    classes: PropTypes.object,
    theme: PropTypes.object,
  };

  render() {
    const { classes, value, symbol, time, timeStatus, valueStatus, theme } = this.props;
    return (
      <Chip
        className={classes.chipLabel}
        onClick={this.onChipClick}
        variant="outlined"
        color="primary"
        style={{
          backgroundColor: theme.status[valueStatus],
        }}
        clickable
        label={
          <span>
            {symbol}: {value} - <span style={{ color: theme.status[timeStatus] }}>{moment(time).fromNow()}</span>
          </span>
        }
      />
    );
  }
}

export default compose(withStyles(styles), withTheme)(ChipSymbolStatus);
