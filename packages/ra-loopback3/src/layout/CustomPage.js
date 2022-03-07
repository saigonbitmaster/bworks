import React, { Component } from 'react';
import { translate } from 'react-admin';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Card, withStyles } from '@material-ui/core';
import Header from '../layout/Header';
import { checkRegister as checkRegisterActions } from '../actions/customPageActions';
import { compose } from 'recompose';

@translate
class CustomPage extends Component {
  static propTypes = {
    // xsmall: PropTypes.element,
    // small: PropTypes.element,
    // medium: PropTypes.element,
    // large: PropTypes.element,
    title: PropTypes.string,
    children: PropTypes.any,
    rawTitle: PropTypes.string,
    translate: PropTypes.func,
    className: PropTypes.any,
    actions: PropTypes.element,
    card: PropTypes.bool,
    header: PropTypes.bool,
    screen: PropTypes.string,
    checkRegister: PropTypes.func,
    classes: PropTypes.object,
  };

  UNSAFE_componentWillMount() {
    const { screen, checkRegister } = this.props;
    if (screen) checkRegister(screen);
  }

  render() {
    const { children, rawTitle, title, translate, classes, className, actions, card, header } = this.props;
    const fixTitle = rawTitle ? rawTitle : translate(title, { _: title });
    const Box = card ? Card : 'div';
    return (
      <Box className={classnames(classes.root, className)}>
        {header && <Header title={fixTitle} actions={actions} />}
        {children}
      </Box>
    );
  }
}
CustomPage.defaultProps = {
  header: false,
};

const mapDispatchToProps = dispatch => ({
  checkRegister: screen => dispatch(checkRegisterActions(screen)),
});

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

export default compose(withStyles(styles), connect(null, mapDispatchToProps))(CustomPage);
