import React, { Component } from 'react';
import PropTypes from 'prop-types';
import slug from 'slug';
import uniq from 'lodash/uniq';
import RawChipInput from './raw/RawChipInput';
import RaCustomInput from './RaCustomInput';

class TagInput extends Component {
  renderInput = ({ value: rawValue, onChange, onBlur, onKeyDown, onKeyUp, ...props }) => {
    let value = rawValue || [];
    return (
      <RawChipInput
        value={value}
        onAdd={chip => {
          onChange(uniq([...value, slug(chip)]));
        }}
        onDelete={(chip, index) => {
          let newValue = [...value];
          newValue.splice(index, 1);
          onChange(newValue);
        }}
        blurBehavior="add"
        onBlur={() => onBlur(value)}
        {...props}
      />
    );
  };

  inputNormalize = data => {
    return slug(data);
  };

  render() {
    const { options: rawOptions, inputProps: rawInputProps, ...props } = this.props;
    const options = {
      ...rawOptions,
      InputProps: { inputComponent: this.renderInput },
      InputLabelProps: {
        shrink: true,
      },
    };
    const inputProps = {
      ...rawInputProps,
      // inputNormalize: this.inputNormalize,
    };
    return <RaCustomInput {...props} inputProps={inputProps} options={options} />;
  }
}

TagInput.propTypes = {
  options: PropTypes.object,
  inputProps: PropTypes.object,
};

export default TagInput;
