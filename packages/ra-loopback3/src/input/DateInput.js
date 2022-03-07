import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import withLocales from '../data/withLocales';
import RawDateInput from './raw/RawDateInput';
import RaCustomInput from './RaCustomInput';

class DateInput extends PureComponent {
  render() {
    const { options: rawOptions, inputProps: rawInputProps, className, label, disableFuture, ...props } = this.props;
    const options = {
      ...rawOptions,
      InputLabelProps: {
        shrink: true,
      },
      InputProps: {
        inputComponent: RawDateInput,
        completeUI: true,
        // inputProps: {
        //   label: <div style={{ width: '100%', height: 5 }} />,
        // },
      },
    };
    const inputProps = {
      ...rawInputProps,
      disableFuture,
    };
    return (
      <RaCustomInput
        label={label}
        {...props}
        className={classNames(className)}
        inputProps={inputProps}
        options={options}
      />
    );
  }
}
DateInput.propTypes = {
  inputProps: PropTypes.object,
  options: PropTypes.object,
  className: PropTypes.string,
  classes: PropTypes.object,
  label: PropTypes.string,
  disableFuture: PropTypes.bool,
};
const FixDateIput = compose(withLocales)(DateInput);
export default FixDateIput;
