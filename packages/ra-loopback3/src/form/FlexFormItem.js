import React, { Children, Component } from 'react';
import FormInput from 'ra-ui-materialui/lib/form/FormInput';
import PropTypes from 'prop-types';

class FlexFormItem extends Component {
  renderItem = (child, forward) => {
    if (!child) return null;
    const { middle, decorate, subFlex, children, ...props } = child.props;
    let fixForward = forward;
    if (subFlex) {
      return React.cloneElement(child, { forward: fixForward, ...props });
    } else if (middle) {
      return React.createElement(
        child.type,
        props,
        <FlexFormItem elements={child.props.children} forward={fixForward} />,
      );
    } else if (decorate) {
      const { basePath, ...rest } = props;
      return React.cloneElement(child, { forward: fixForward, ...rest });
    } else {
      return <FormInput input={child} {...fixForward} />;
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

FlexFormItem.propTypes = {
  forward: PropTypes.object,
  elements: PropTypes.any,
};

export default FlexFormItem;
