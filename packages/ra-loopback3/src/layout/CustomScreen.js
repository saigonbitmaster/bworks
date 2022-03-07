import React, { Component, Children, isValidElement, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
class CustomScreen extends Component {
  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.any,
    fowardFilterProps: PropTypes.bool,
    card: PropTypes.bool,
    spacing: PropTypes.any,
  };

  renderChildren = children => {
    const { fowardFilterProps, ...rest } = this.props;
    return Children.map(children, element => {
      if (!isValidElement(element)) return;
      const { categorize, xs = 12, sm = 12 } = element.props;
      const fowardedFilterPropsElement = fowardFilterProps ? cloneElement(element, { ...rest }) : element;
      switch (categorize) {
        case 'filter':
          return (
            <Grid item xs={12} sm={12}>
              {fowardedFilterPropsElement}
            </Grid>
          );
        default:
          return (
            <Grid item xs={xs} sm={sm}>
              {element}
            </Grid>
          );
      }
    });
  };

  render() {
    const { children, spacing } = this.props;
    return (
      <Grid container spacing={spacing}>
        {this.renderChildren(children)}
      </Grid>
    );
  }
}

CustomScreen.defaultProps = {
  fowardFilterProps: false,
};

export default CustomScreen;
