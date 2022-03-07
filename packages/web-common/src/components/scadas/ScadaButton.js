import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Popover, IconButton, Button, withStyles, Tooltip } from '@material-ui/core';
import { compose } from 'recompose';
// import { push as pushAction } from 'react-router-redux';
import { Link } from 'react-router-dom';
import { DeveloperBoard as DeveloperBoardIcon, LocationCity as FactoryIcon } from '@material-ui/icons';

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});

class ScadaButton extends Component {
  static propTypes = {
    project: PropTypes.string,
    classes: PropTypes.object,
  };

  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  itemClick = () => {
    this.handleClose();
  };

  render() {
    const { anchorEl } = this.state;
    const { classes } = this.props;
    return (
      <Fragment>
        <Popover
          id="simple-popper"
          open={!!anchorEl}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Button component={Link} to="/scada" variant="contained" color="secondary" onClick={this.itemClick}>
            <FactoryIcon className={classes.leftIcon} />
            Factory
          </Button>
        </Popover>
        <Tooltip title="Scada" placement="bottom">
          <IconButton aria-label="Scada" onClick={this.handleClick}>
            <DeveloperBoardIcon style={{ color: 'white' }} />
          </IconButton>
        </Tooltip>
      </Fragment>
    );
  }
}

const ScadaButtonEnhance = compose(withStyles(styles))(ScadaButton);

export default ScadaButtonEnhance;
