import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import DeleteIcon from '@material-ui/icons/Delete';
import classnames from 'classnames';

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

// button Delete: xoa 1 hoac nhieu record, su dung cho BulkActionButtons cua List
class BulkDeleteButton extends Component {
  render() {
    const { classes = {}, className, onDelete, selectedIds, permission } = this.props;
    return (
      <Button
        className={classnames('ra-delete-button', classes.deleteButton, className)}
        onClick={() => onDelete(selectedIds)}
        label="generic.delete"
        permission={permission}
      >
        <DeleteIcon />
      </Button>
    );
  }
}
BulkDeleteButton.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.object,
  onDelete: PropTypes.func.isRequired,
  selectedIds: PropTypes.array,
  permission: PropTypes.object,
};

export default compose(withStyles(styles))(BulkDeleteButton);
