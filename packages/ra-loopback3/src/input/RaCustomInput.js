import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addField, FieldTitle } from 'react-admin';
import sanitizeRestProps from 'ra-ui-materialui/lib/input/sanitizeRestProps';
import CustomField from '../material-ui/CustomField';
// override from material-ui, add value type object and array object

/**
 * An Input component for a string
 *
 * @example
 * <RaCustomInput source="first_name" />
 *
 * You can customize the `type` props (which defaults to "text").
 * Note that, due to a React bug, you should use `<NumberField>` instead of using type="number".
 * @example
 * <RaCustomInput source="email" type="email" />
 * <NumberInput source="nb_views" />
 *
 * The object passed as `options` props is passed to the material-ui <TextField> component
 */

class RaCustomInput extends Component {
  handleBlur = eventOrValue => {
    this.props.onBlur(eventOrValue);
    this.props.input.onBlur(eventOrValue);
  };

  handleFocus = event => {
    this.props.onFocus(event);
    this.props.input.onFocus(event);
  };

  handleChange = eventOrValue => {
    this.props.onChange(eventOrValue);
    this.props.input.onChange(eventOrValue);
  };

  render() {
    const { className, input, isRequired, label, meta, options, resource, source, type, ...rest } = this.props;
    if (typeof meta === 'undefined') {
      throw new Error(
        "The TextInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details.",
      );
    }
    const { touched, error } = meta;

    return (
      <CustomField
        margin="normal"
        type={type}
        label={<FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />}
        error={!!(touched && error)}
        helperText={touched && error}
        className={className}
        {...options}
        {...sanitizeRestProps(rest)}
        {...input}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onChange={this.handleChange}
      />
    );
  }
}

RaCustomInput.propTypes = {
  className: PropTypes.string,
  input: PropTypes.object,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  meta: PropTypes.object,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  options: PropTypes.object,
  resource: PropTypes.string,
  source: PropTypes.string,
  type: PropTypes.string,
};

RaCustomInput.defaultProps = {
  onBlur: () => {},
  onChange: () => {},
  onFocus: () => {},
  options: {},
};

export default addField(RaCustomInput);
