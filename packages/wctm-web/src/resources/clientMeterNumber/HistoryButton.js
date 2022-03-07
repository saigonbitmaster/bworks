import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Button, linkToRecord, translate } from 'ra-loopback3';
import shouldUpdate from 'recompose/shouldUpdate';
import ImageEye from '@material-ui/icons/RemoveRedEye';
import { Link } from 'react-router-dom';

const ShowButton = ({
  basePath = '',
  subPath = 'history',
  label = 'generic.history',
  record = {},
  translate,
  ...rest
}) => (
  <Button component={Link} to={`${linkToRecord(`${basePath}/${subPath}`, record.id)}`} label={label} {...rest}>
    <ImageEye />
  </Button>
);

ShowButton.propTypes = {
  basePath: PropTypes.string,
  label: PropTypes.string,
  record: PropTypes.object,
  subPath: PropTypes.string,
  translate: PropTypes.func,
};

const enhance = compose(
  shouldUpdate(
    (props, nextProps) =>
      props.translate !== nextProps.translate ||
      (props.record && nextProps.record && props.record.id !== nextProps.record.id) ||
      props.basePath !== nextProps.basePath ||
      (props.record == null && nextProps.record != null),
  ),
  translate,
);

export default enhance(ShowButton);
