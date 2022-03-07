import React, { PureComponent } from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import withLocales from '../data/withLocales';
import RawMonthInput from './raw/RawMonthInput';
import RaCustomInput from './RaCustomInput';

class MonthInput extends PureComponent {
  render() {
    const {
      options: rawOptions,
      inputProps: rawInputProps,
      yearCenter,
      yearRange,
      date,
      allowEmpty,
      fixUI,
      ...props
    } = this.props;
    const options = {
      ...rawOptions,
      InputProps: {
        inputComponent: RawMonthInput,
        completeUI: true,
        inputProps: { yearCenter, yearRange, date, allowEmpty, fixUI },
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
MonthInput.propTypes = {
  inputProps: PropTypes.object,
  options: PropTypes.object,
  className: PropTypes.string,
  classes: PropTypes.object,
  label: PropTypes.string,
  yearCenter: PropTypes.number,
  yearRange: PropTypes.number,
  date: PropTypes.bool,
  allowEmpty: PropTypes.any,
  fixUI: PropTypes.bool,
};
const FixMonthInput = compose(withLocales)(MonthInput);
FixMonthInput.defaultProps = {
  yearCenter: moment().year(),
  yearRange: 4,
  allowEmpty: true,
};

export default MonthInput;
