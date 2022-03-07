import React from 'react';
import PropTypes from 'prop-types';
import { Link, linkToRecord, translate, Button } from 'ra-loopback3';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { compose, pure } from 'recompose';
import { SetupClientMeterIcon, EditClientMeterIcon } from '../../styles/Icons';
const styles = () => ({
  customButton: {},
});

const CustomEditButton = ({ basePath = '', record = {}, classes = {}, className, icon, translate, ...rest }) => (
  <Button
    component={Link}
    to={linkToRecord(`${basePath}/${record.meterId ? 'update' : 'setup'}`, record.id)}
    className={classnames('ra-delete-button', classes.customButton, className)}
    {...rest}
    label={record.meterId ? translate('ra.action.edit') : translate('generic.setupMeter')}
  >
    {record.meterId ? <EditClientMeterIcon /> : <SetupClientMeterIcon />}
  </Button>
);

CustomEditButton.propTypes = {
  basePath: PropTypes.string,
  className: PropTypes.string,
  classes: PropTypes.object,
  record: PropTypes.object,
  icon: PropTypes.any,
  translate: PropTypes.func,
};

const enhance = compose(pure, withStyles(styles), translate);
export default enhance(CustomEditButton);
