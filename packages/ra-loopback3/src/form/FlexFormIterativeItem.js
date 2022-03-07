import React, { cloneElement, Children, Component } from 'react';
import FormInput from 'ra-ui-materialui/lib/form/FormInput';
import PropTypes from 'prop-types';

class FlexFormItem extends Component {
  renderItem = (child, forward) => {
    if (!child || !forward) return null;
    const { member, index, record, resource } = forward;
    const { middle, children, ...props } = child.props;
    if (middle) {
      const createdElementProps = { ...props, record };
      if (createdElementProps.onClick) {
        const newOnClick = createdElementProps.onClick();
        createdElementProps.onClick = () => newOnClick(member);
      }
      return React.createElement(
        child.type,
        createdElementProps,
        <FlexFormItem elements={children} forward={forward} />,
      );
    } else {
      return (
        <FormInput
          input={cloneElement(child, {
            source: child.props.source ? `${member}.${child.props.source}` : member,
            index: !child.props.source || !index ? undefined : index,
            label: child.props.label || child.props.source,
          })}
          record={record}
          resource={resource}
        />
      );
    }
  };

  render() {
    const { elements, forward } = this.props;

    if (elements) {
      if (Array.isArray(elements)) {
        return Children.map(elements, (child, index) => {
          return this.renderItem(child, { ...forward, index });
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
