import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { crudDeleteMany, startUndoable, translate } from 'ra-loopback3';

class CustomBulkDeleteAction extends Component {
  componentDidMount = () => {
    /*const { basePath, dispatchCrudDeleteMany, resource, selectedIds, startUndoable, undoable } = this.props;
    if (undoable) {
      let rest = startUndoable(crudDeleteMany(resource, selectedIds, basePath));
      console.log('rest:', rest);
    } else {
      dispatchCrudDeleteMany(resource, selectedIds, basePath);
    }*/
    this.props.onExit();
    this.props.onClickDelete(this.props.selectedIds);
  };

  render() {
    return null;
  }
}

CustomBulkDeleteAction.propTypes = {
  basePath: PropTypes.string,
  dispatchCrudDeleteMany: PropTypes.func.isRequired,
  label: PropTypes.string,
  onExit: PropTypes.func.isRequired,
  resource: PropTypes.string.isRequired,
  startUndoable: PropTypes.func,
  selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
  translate: PropTypes.func.isRequired,
  undoable: PropTypes.bool,
  onClickDelete: PropTypes.func,
};

const EnhancedCustomBulkDeleteAction = compose(
  connect(undefined, {
    startUndoable,
    dispatchCrudDeleteMany: crudDeleteMany,
  }),
  translate,
)(CustomBulkDeleteAction);

EnhancedCustomBulkDeleteAction.defaultProps = {
  label: 'ra.action.delete',
  undoable: true,
};

export default EnhancedCustomBulkDeleteAction;
