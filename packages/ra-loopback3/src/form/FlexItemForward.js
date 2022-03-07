import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlexFormItem from './FlexFormItem';

class FlexItemForward extends Component {
  static propTypes = {
    forward: PropTypes.object,
    subFlex: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  };
  static defaultProps = {
    subFlex: true,
  };
  render() {
    const { children, forward } = this.props;
    return <FlexFormItem elements={children} forward={forward} />;
  }
}

export default FlexItemForward;
