import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import classnames from 'classnames';
import { translate, crudDelete, startUndoable, Button } from 'ra-loopback3';

const styles = theme => ({
  CustomButton: {
    color: theme.palette.error.main,
    '&:hover': {
      backgroundColor: fade(theme.palette.error.main, 0.12),
      // Reset on mouse devices
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
});

class CustomButton extends Component {
  handleClick = event => {
    event.preventDefault();
    this.props.onClick(this.props);
  };

  render() {
    const { text, classes = {}, className, icon } = this.props;
    return (
      <Button
        onClick={this.handleClick}
        className={classnames('ra-delete-button', classes.CustomButton, className)}
        label={text}
      >
        {icon}
      </Button>
    );
  }
}

CustomButton.propTypes = {
  basePath: PropTypes.string,
  classes: PropTypes.object,
  className: PropTypes.string,
  dispatchCrudDelete: PropTypes.func.isRequired,
  label: PropTypes.string,
  record: PropTypes.object,
  redirect: PropTypes.string,
  resource: PropTypes.string.isRequired,
  startUndoable: PropTypes.func,
  translate: PropTypes.func,
  undoable: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.any,
  text: PropTypes.string,
};

CustomButton.defaultProps = {
  redirect: 'list',
  undoable: true,
};

export default compose(
  connect(null, { startUndoable, dispatchCrudDelete: crudDelete }),
  translate,
  withStyles(styles),
)(CustomButton);
