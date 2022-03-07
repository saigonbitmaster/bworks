import React, { PureComponent } from 'react';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import classNames from 'classnames';
import { FieldTitle } from 'react-admin';
import 'moment/locale/vi';
import PropTypes from 'prop-types';
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import withLocales from '../data/withLocales';
import RaCustomInput from './RaCustomInput';
import '../style/date-time.css';

const TimeInputRender = ({ value, className, ...props }) => {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils} locale={props.locale} moment={moment}>
      <TimePicker
        value={value || null}
        format="LT"
        clearable
        {...props}
        className={classNames('date-input-fix', className)}
        animateYearScrolling={false}
      />
    </MuiPickersUtilsProvider>
  );
};
TimeInputRender.propTypes = {
  locale: PropTypes.string,
  value: PropTypes.any,
  className: ProcessingInstruction.string,
};
class TimeInput extends PureComponent {
  render() {
    const { options: rawOptions, inputProps: rawInputProps, className, label, ...props } = this.props;
    const options = {
      ...rawOptions,
      InputProps: {
        inputComponent: TimeInputRender,
        completeUI: true,
        inputProps: {
          label: (
            <FieldTitle label={label} source={props.source} resource={props.resource} isRequired={props.isRequired} />
          ),
        },
      },
    };
    const inputProps = {
      ...rawInputProps,
    };
    return (
      <RaCustomInput label="" {...props} className={classNames(className)} inputProps={inputProps} options={options} />
    );
  }
}
TimeInput.propTypes = {
  inputProps: PropTypes.object,
  options: PropTypes.object,
  className: PropTypes.string,
  classes: PropTypes.object,
  label: PropTypes.string,
};

const FixTimeInput = compose(withLocales)(TimeInput);

export default FixTimeInput;
