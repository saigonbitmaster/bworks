import { Component } from 'react';
import PropTypes from 'prop-types';

export default class DelayedRender extends Component {
  componentDidMount() {
    this.timeoutHandle = setTimeout(() => this.forceUpdate(), this.props.delay);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutHandle);
  }

  render() {
    return this.props.children;
  }
}

DelayedRender.propTypes = {
  children: PropTypes.object,
  delay: PropTypes.number,
};
