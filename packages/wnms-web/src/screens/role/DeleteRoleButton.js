import React, { Component } from 'react';
import {
  Button,
  withDataProvider,
  CUSTOM,
  showNotification,
  translate,
  crudDelete,
  startCustomUndoable,
} from 'ra-loopback3';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { DeleteIcon } from '../../styles/Icons';

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

@connect(null, { showNotification })
@withDataProvider
class DeleteRoleButton extends Component {
  handleDelete = async () => {
    const {
      dataProvider,
      showNotification,
      undoable,
      record,
      startCustomUndoable,
      dispatchCrudDelete,
      resource,
      basePath,
      translate,
      redirect,
    } = this.props;
    const {
      data: { result },
    } = await dataProvider(CUSTOM, 'Roles', {
      subUrl: 'isDeletable',
      fullUrl: true,
      query: { id: record.id },
    });

    if (!result) {
      showNotification(translate('error.data.remainedAppUser'), 'warning');
    } else {
      if (undoable) {
        startCustomUndoable(crudDelete(resource, record.id, record, basePath, redirect));
      } else {
        dispatchCrudDelete(resource, record.id, record, basePath, redirect);
      }
    }
  };

  render() {
    const { label = 'ra.action.delete', classes = {}, className, permission } = this.props;
    return (
      <Button
        onClick={this.handleDelete}
        label={label}
        className={classnames('ra-delete-button', classes.deleteButton, className)}
        key="button"
        permission={permission}
      >
        <DeleteIcon />
      </Button>
    );
  }
}

DeleteRoleButton.propTypes = {
  basePath: PropTypes.string,
  classes: PropTypes.object,
  className: PropTypes.string,
  dispatchCrudDelete: PropTypes.func.isRequired,
  label: PropTypes.string,
  record: PropTypes.object,
  redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.func]),
  resource: PropTypes.string.isRequired,
  startCustomUndoable: PropTypes.func,
  translate: PropTypes.func,
  undoable: PropTypes.bool,
  permission: PropTypes.object,
  dataProvider: PropTypes.func,
  showNotification: PropTypes.any,
};

DeleteRoleButton.defaultProps = {
  redirect: 'list',
  undoable: true,
};

export default compose(
  connect(null, { startCustomUndoable, dispatchCrudDelete: crudDelete }),
  translate,
  withStyles(styles),
)(DeleteRoleButton);
