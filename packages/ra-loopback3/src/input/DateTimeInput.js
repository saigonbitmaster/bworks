import React, { PureComponent } from 'react';
import moment from 'moment-timezone';
import { compose } from 'recompose';
import classNames from 'classnames';
// import { FieldTitle } from 'react-admin';
import 'moment/locale/vi';
import PropTypes from 'prop-types';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import withLocales from '../data/withLocales';
import RaCustomInput from './RaCustomInput';
import '../style/date-time.css';

const DateTimeInputRender = ({ value, className, ...props }) => {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils} locale={props.locale} moment={moment}>
      <DateTimePicker
        value={value || null}
        format="L LT"
        clearable
        {...props}
        className={classNames('date-input-fix', className)}
        animateYearScrolling={false}
      />
    </MuiPickersUtilsProvider>
  );
};
DateTimeInputRender.propTypes = {
  locale: PropTypes.string,
  value: PropTypes.any,
  className: PropTypes.string,
};
class DateTimeInput extends PureComponent {
  render() {
    const { options: rawOptions, inputProps: rawInputProps, className, label, ...props } = this.props;
    const options = {
      ...rawOptions,
      InputLabelProps: {
        shrink: true,
      },
      InputProps: {
        inputComponent: DateTimeInputRender,
        completeUI: true,
        // inputProps: {
        //   label: (
        //     <FieldTitle label={label} source={props.source} resource={props.resource} isRequired={props.isRequired} />
        //   ),
        // },
      },
    };
    const inputProps = {
      ...rawInputProps,
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
DateTimeInput.propTypes = {
  inputProps: PropTypes.object,
  options: PropTypes.object,
  className: PropTypes.string,
  classes: PropTypes.object,
  label: PropTypes.string,
};

export default compose(withLocales)(DateTimeInput);
