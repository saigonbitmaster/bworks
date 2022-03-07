import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Link, linkToRecord, translate, Button } from 'ra-loopback3';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { ChangeClientMeterIcon } from '../../styles/Icons';

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
@withStyles(styles)
@translate
class ReplaceMeterButton extends Component {
  render() {
    const { basePath = '', record = {}, classes = {}, className, translate, ...rest } = this.props;
    return (
      <Button
        disabled={record.status !== 'ACTIVE' || !record.startMeterDate}
        component={Link}
        to={linkToRecord(`${basePath}/changeClientMeter`, record.id)}
        className={classnames('ra-delete-button', classes.CustomButton, className)}
        {...rest}
        label={translate('resources.clientmeters.fields.changeClientMeter')}
      >
        <ChangeClientMeterIcon />
      </Button>
    );
  }
}

ReplaceMeterButton.propTypes = {
  basePath: PropTypes.string,
  className: PropTypes.string,
  classes: PropTypes.object,
  record: PropTypes.object,
  translate: PropTypes.func,
};

export default ReplaceMeterButton;
