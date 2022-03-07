import React, { Component } from 'react';
import moment from 'moment-timezone';
import classNames from 'classnames';
import 'moment/locale/vi';
import PropTypes from 'prop-types';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import '../../style/date-time.css';

class RawDateTimeInput extends Component {
  render() {
    const { value, className, format, onChange, date, ...props } = this.props;
    const fixValue = typeof value === 'string' ? moment(value, format.length <= 18 ? format : undefined) : value;
    return (
      <MuiPickersUtilsProvider utils={MomentUtils} locale={props.locale} moment={moment}>
        <DateTimePicker
          value={fixValue || null}
          format={format}
          clearable
          {...props}
          onChange={val =>
            val ? onChange(typeof val === 'string' ? moment(val, format) : val.toDate()) : onChange(val)
          }
          className={classNames('date-input-fix', className)}
          animateYearScrolling={false}
        />
      </MuiPickersUtilsProvider>
    );
  }
}
RawDateTimeInput.propTypes = {
  locale: PropTypes.string,
  value: PropTypes.any,
  className: PropTypes.string,
  format: PropTypes.string,
  date: PropTypes.bool,
  onChange: PropTypes.func,
};
RawDateTimeInput.defaultProps = {
  format: 'L LT',
};
export default RawDateTimeInput;
