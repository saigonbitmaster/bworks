import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CardContent, Typography, withStyles } from '@material-ui/core';
import classnames from 'classnames';

const styles = () => ({
  title: {},
});
@withStyles(styles)
class ViewTitle extends Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  };

  render() {
    const { className, title, classes, ...rest } = this.props;
    return (
      <CardContent className={classnames('title', className)} {...rest}>
        <Typography className={classes.title} variant="h6">
          {title}
        </Typography>
      </CardContent>
    );
  }
}

export default ViewTitle;
