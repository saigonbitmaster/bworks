import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import ContentCreate from '@material-ui/icons/Create';
import { Link } from 'react-router-dom';
import { linkToRecord } from 'ra-core';

import Button from './Button';

class EditButton extends React.Component {
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
      basePath = '',
      label = 'ra.action.edit',
      record = {},
      customDisabled,
      fieldToShowNull,
      ...rest
    } = this.props;
    if (!record[fieldToShowNull]) {
      return (
        <Button
          component={Link}
          to={linkToRecord(basePath, record.id)}
          label={label}
          disabled={this.customDisabled()}
          {...rest}
        >
          <ContentCreate />
        </Button>
      );
    } else {
      return null;
    }
  }
}

EditButton.propTypes = {
  basePath: PropTypes.string,
  className: PropTypes.string,
  classes: PropTypes.object,
  label: PropTypes.string,
  record: PropTypes.object,
  customDisabled: PropTypes.func,
  records: PropTypes.arrayOf(PropTypes.object),
  fieldToShowNull: PropTypes.any,
};

const enhance = shouldUpdate(
  (props, nextProps) =>
    props.translate !== nextProps.translate ||
    (props.record && nextProps.record && props.record.id !== nextProps.record.id) ||
    props.basePath !== nextProps.basePath ||
    (props.record == null && nextProps.record != null),
);

export default enhance(EditButton);
