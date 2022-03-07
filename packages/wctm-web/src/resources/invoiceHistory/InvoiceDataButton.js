import React from 'react';
import PropTypes from 'prop-types';
import { Button, linkToRecord } from 'ra-loopback3';
import shouldUpdate from 'recompose/shouldUpdate';
import ImageEye from '@material-ui/icons/RemoveRedEye';
import { Link } from 'react-router-dom';

const ShowButton = ({ basePath = '', subPath = 'invoiceData', label = 'ra.action.show', record = {}, ...rest }) => (
  <Button component={Link} to={`${linkToRecord(`${basePath}/${subPath}`, record.id)}`} label={label} {...rest}>
    <ImageEye />
  </Button>
);

ShowButton.propTypes = {
  basePath: PropTypes.string,
  label: PropTypes.string,
  record: PropTypes.object,
  subPath: PropTypes.string,
};

const enhance = shouldUpdate(
  (props, nextProps) =>
    props.translate !== nextProps.translate ||
    (props.record && nextProps.record && props.record.id !== nextProps.record.id) ||
    props.basePath !== nextProps.basePath ||
    (props.record == null && nextProps.record != null),
);

export default enhance(ShowButton);
