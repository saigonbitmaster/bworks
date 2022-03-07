import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ActionDelete from '@material-ui/icons/Delete';
import classnames from 'classnames';
import { translate, crudDelete, startUndoable } from 'ra-core';

import Button from './Button';

const styles = theme => ({
  deleteButton: {
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

class DeleteButton extends Component {
  handleDelete = event => {
    event.preventDefault();
    const { record } = this.props;
    this.props.handleDelete(record.id);
  };

  customDisabled = () => {
    const { record, records } = this.props;
    if (this.props.customDisabled && records) {
      return this.props.customDisabled(record, records);
    } else {
      return false;
    }
  };

  render() {
    const {
      label = 'ra.action.delete',
      classes = {},
      className,
      basePath,
      dispatchCrudDelete,
      undoable,
      handleDelete,
      ...rest
    } = this.props;
    rest.undoable = undoable.toString();
    return (
      <Button
        onClick={this.handleDelete}
        label={label}
        disabled={this.customDisabled()}
        className={classnames('ra-delete-button', classes.deleteButton, className)}
        key="button"
        {...rest}
      >
        <ActionDelete />
      </Button>
    );
  }
}

DeleteButton.propTypes = {
  basePath: PropTypes.string,
  classes: PropTypes.object,
  className: PropTypes.string,
  dispatchCrudDelete: PropTypes.func.isRequired,
  label: PropTypes.string,
  record: PropTypes.object,
  redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.func]),
  resource: PropTypes.string.isRequired,
  startUndoable: PropTypes.func,
  translate: PropTypes.func,
  undoable: PropTypes.bool,
  handleDelete: PropTypes.func,
  customDisabled: PropTypes.func,
  records: PropTypes.arrayOf(PropTypes.object),
};

DeleteButton.defaultProps = {
  redirect: 'list',
  undoable: true,
};

export default compose(
  connect(null, { startUndoable, dispatchCrudDelete: crudDelete }),
  translate,
  withStyles(styles),
)(DeleteButton);
