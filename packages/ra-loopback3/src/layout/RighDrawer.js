import React, { cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Drawer } from '@material-ui/core';
import { hideRightDrawer as hideRightDrawerAction } from '../actions/rightDrawerAction';

class RightDrawer extends Component {
  state = {
    open: false,
    drawer: null,
    options: null,
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.drawer && state.open) {
      return { ...state, open: false };
    }
    return state;
  }

  onClose = () => {
    this.props.hideRightDrawer();
  };

  componentDidUpdate() {
    const { drawer, options } = this.props;
    if (this.props.drawer && !this.state.open) {
      this.setState({ open: true, drawer, options });
    }
  }

  componentWillUnmount() {
    this.unmount = true;
  }

  render() {
    const { drawer, options, open } = this.state;
    if (drawer) {
      return (
        <Drawer anchor="right" open={open} onClose={this.onClose}>
          {options ? cloneElement(drawer, options) : drawer}
        </Drawer>
      );
    }
    return null;
  }
}

RightDrawer.propTypes = {
  options: PropTypes.any,
  drawer: PropTypes.any,
  updateCount: PropTypes.number,
  hideRightDrawer: PropTypes.func,
};

const mapStateToProps = state => ({
  drawer: state.rightDrawer.element,
  options: state.rightDrawer.options,
  updateCount: state.rightDrawer.updateCount,
});

export default compose(connect(mapStateToProps, { hideRightDrawer: hideRightDrawerAction }))(RightDrawer);
