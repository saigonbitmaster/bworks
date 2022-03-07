import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { translate } from 'react-admin';
import ViewTitle from './ViewTitle';

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
};

@withStyles(styles)
@translate
class Header extends Component {
  static propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    title: PropTypes.any,
    actions: PropTypes.element,
    actionProps: PropTypes.object,
    translate: PropTypes.func,
  };

  render() {
    const { classes, className, title, actions, actionProps, translate, ...rest } = this.props;
    return (
      <div className={classnames(classes.root, className)} {...rest}>
        <ViewTitle title={typeof title === 'string' ? translate(title, { _: title }) : title} />
        {actions && React.cloneElement(actions, actionProps)}
      </div>
    );
  }
}

export default Header;
