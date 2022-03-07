import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showRightDrawer as showRightDrawerAction } from '../actions/rightDrawerAction';

const withRightDrawer = () => BaseComponent => {
  class WithRightDrawerComponent extends Component {
    static propTypes = {
      dispatch: PropTypes.func,
      startUndoable: PropTypes.func,
    };
    render() {
      const { dispatch, showRightDrawer, ...rest } = this.props;
      return <BaseComponent {...rest} rightDrawer={showRightDrawer} />;
    }
  }
  WithRightDrawerComponent.propTypes = {
    showRightDrawer: PropTypes.func,
  };
  return connect(null, { showRightDrawer: showRightDrawerAction })(WithRightDrawerComponent);
};

export default withRightDrawer();
