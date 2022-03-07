import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import Labeled from 'ra-ui-materialui/lib/input/Labeled';
import classnames from 'classnames';

class FlexFieldItem extends Component {
  renderItem = (child, forward) => {
    const { middle, decorate, children, ...props } = child.props;
    if (middle) {
      return React.createElement(
        child.type,
        props,
        <FlexFieldItem elements={child.props.children} forward={forward} />,
      );
    } else {
      if (!child) return null;
      const { addLabel, label, source, className } = child.props;
      return (
        <div key={source} className={classnames(`ra-field ra-field-${source}`, className)}>
          {addLabel ? (
            <Labeled label={label} source={source} disabled={false} {...forward}>
              {child}
            </Labeled>
          ) : typeof child.type === 'string' ? (
            child
          ) : (
            React.cloneElement(child, forward)
          )}
        </div>
      );
    }
  };

  render() {
    const { elements, forward } = this.props;

    if (elements) {
      if (Array.isArray(elements)) {
        return Children.map(elements, child => {
          return this.renderItem(child, forward);
        });
      }
      return this.renderItem(elements, forward);
    }
    return null;
  }
}

FlexFieldItem.propTypes = {
  forward: PropTypes.object,
  elements: PropTypes.any,
};

export default FlexFieldItem;
