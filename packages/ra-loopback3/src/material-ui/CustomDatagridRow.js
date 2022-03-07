import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import classnames from 'classnames';
import { linkToRecord } from 'ra-core';

import DatagridCell from './CustomDatagridCell';

const sanitizeRestProps = ({
  basePath,
  children,
  classes,
  className,
  rowClick,
  id,
  isLoading,
  onToggleItem,
  push,
  record,
  resource,
  selected,
  style,
  styles,
  ...rest
}) => rest;

class DatagridRow extends Component {
  state = {
    expanded: false,
  };

  handleToggle = event => {
    this.props.onToggleItem(this.props.id);
    event.stopPropagation();
  };

  handleClick = () => {
    const { basePath, rowClick, id, push } = this.props;

    if (!rowClick) return;

    if (rowClick === 'edit') {
      push(linkToRecord(basePath, id));
    }
    if (rowClick === 'show') {
      push(linkToRecord(basePath, id, 'show'));
    }
    if (typeof rowClick === 'function') {
      push(rowClick(id, basePath));
    }
  };

  render() {
    const {
      basePath,
      children,
      classes,
      className,
      hasBulkActions,
      hover,
      id,
      record,
      resource,
      selected,
      style,
      styles,
      expand,
      ...rest
    } = this.props;
    const { expanded } = this.state;
    return (
      <Fragment>
        <TableRow
          className={className}
          key={id}
          style={style}
          hover={hover}
          onClick={this.handleClick}
          {...sanitizeRestProps(rest)}
        >
          {hasBulkActions && (
            <TableCell padding="none">
              <Checkbox
                color="primary"
                className={`select-item ${classes.checkbox}`}
                checked={selected}
                onClick={this.handleToggle}
              />
            </TableCell>
          )}
          {React.Children.map(children, (field, index) =>
            field ? (
              field.props.expandPanel ? (
                <DatagridCell
                  key={`${id}-${field.props.source || index}`}
                  className={classnames(`column-${field.props.source}`, classes.rowCell)}
                  record={record}
                  id={id}
                  onClick={() => {
                    this.setState({ expanded: !this.state.expanded });
                  }}
                  {...{ field, basePath, resource }}
                />
              ) : (
                <DatagridCell
                  key={`${id}-${field.props.source || index}`}
                  className={classnames(`column-${field.props.source}`, classes.rowCell)}
                  record={record}
                  id={id}
                  {...{ field, basePath, resource }}
                />
              )
            ) : null,
          )}
        </TableRow>
        {expand && expanded && (
          <TableRow key={`${id}-expand`}>
            <TableCell colSpan={10} role="expand-content">
              {React.cloneElement(expand, {
                record,
                basePath,
                resource,
                id: String(id),
              })}
            </TableCell>
          </TableRow>
        )}
      </Fragment>
    );
  }
}

DatagridRow.propTypes = {
  basePath: PropTypes.string,
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  hasBulkActions: PropTypes.bool.isRequired,
  hover: PropTypes.bool,
  id: PropTypes.any,
  onToggleItem: PropTypes.func,
  push: PropTypes.func,
  record: PropTypes.object.isRequired,
  resource: PropTypes.string,
  rowClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  selected: PropTypes.bool,
  style: PropTypes.object,
  styles: PropTypes.object,
  expand: PropTypes.node,
};

DatagridRow.defaultProps = {
  hasBulkActions: false,
  hover: true,
  record: {},
  selected: false,
};

// wat? TypeScript looses the displayName if we don't set it explicitly
DatagridRow.displayName = 'DatagridRow';

export default connect(null, { push })(DatagridRow);
