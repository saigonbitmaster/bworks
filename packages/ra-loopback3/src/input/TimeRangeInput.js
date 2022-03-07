import React, { PureComponent } from 'react';
import { compose } from 'recompose';
import 'moment/locale/vi';
import PropTypes from 'prop-types';
import withLocales from '../data/withLocales';
import RawTimeRangeInput from './raw/RawTimeRangeInput';
import RaCustomInput from './RaCustomInput';

class TimeRangeInput extends PureComponent {
  render() {
    const { options: rawOptions, inputProps: rawInputProps, types, defaultValue, defaultType, ...props } = this.props;
    const options = {
      ...rawOptions,
      InputProps: {
        inputComponent: RawTimeRangeInput,
        completeUI: true,
        inputProps: { types, defaultValue },
      },
      InputLabelProps: {
        shrink: true,
      },
    };
    const inputProps = {
      ...rawInputProps,
    };
    return <RaCustomInput {...props} inputProps={inputProps} options={options} />;
  }
}
TimeRangeInput.propTypes = {
  inputProps: PropTypes.object,
  options: PropTypes.object,
  className: PropTypes.string,
  classes: PropTypes.object,
  label: PropTypes.string,
  types: PropTypes.arrayOf(PropTypes.string),
  defaultType: PropTypes.string,
  defaultValue: PropTypes.any,
};
const FixTimeRangInput = compose(withLocales)(TimeRangeInput);
export default FixTimeRangInput;
