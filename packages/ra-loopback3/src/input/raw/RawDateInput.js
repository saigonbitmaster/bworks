import React, { Component } from 'react';
import moment from 'moment-timezone';
import classNames from 'classnames';
import 'moment/locale/vi';
import PropTypes from 'prop-types';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
// import '../../style/date-time.css';

class RawDateInput extends Component {
  render() {
    const { value, className, format, date, onChange, fixUI, disableFuture, maxDate, children, ...props } = this.props;
    const fixValue = typeof value === 'string' ? moment(value, value.length <= 10 ? format : undefined) : value;
    return (
      <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={props.locale}>
        <div style={{ width: '100%', height: fixUI !== false ? 10 : 0 }} />
        <DatePicker
          value={fixValue || null}
          format={format}
          clearable
          disableFuture={disableFuture}
          maxDate={maxDate}
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
RawDateInput.propTypes = {
  locale: PropTypes.string,
  value: PropTypes.any,
  className: PropTypes.string,
  format: PropTypes.string,
  date: PropTypes.bool,
  onChange: PropTypes.func,
  fixUI: PropTypes.any,
  disableFuture: PropTypes.any,
  maxDate: PropTypes.any,
  children: PropTypes.any,
};
RawDateInput.defaultProps = {
  format: 'L',
};
export default RawDateInput;
