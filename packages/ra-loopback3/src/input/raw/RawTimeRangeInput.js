import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import classNames from 'classnames';
import { translate } from 'react-admin';
import { Select, MenuItem, withStyles, FormControl, InputLabel } from '@material-ui/core';
// import SpIcon from '@material-ui/icons/Remove';

import RawDateTimeInput from './RawDateTimeInput';
import RawDateInput from './RawDateInput';
import RawMonthInput from './RawMonthInput';
import get from 'lodash/get';

const styles = () => ({
  typeInput: {
    marginRight: '8px',
  },
  dateInput: {
    float: 'left',
    display: 'inline',
    marginRight: '8px',
    paddingTop: '4px',
  },
  monthInput: {
    float: 'left',
    display: 'inline',
    marginRight: '8px',
    paddingTop: '5px',
  },
  yearInput: {
    float: 'left',
    display: 'inline',
    marginRight: '8px',
    paddingTop: '4px',
  },
  yearInputElement: {
    marginTop: '6px !important',
  },
});
class RawTimeRangeInput extends Component {
  constructor(props) {
    super(props);
  }

  onChangeType = e => {
    const { from, to } = this.props.value;
    let type = e.target.value;
    let fixFrom = from
      ? moment(from)
          .startOf(type)
          .toDate()
      : from;
    let fixTo = to
      ? moment(to)
          .startOf(type)
          .toDate()
      : to;
    this.props.onChange({ from: fixFrom, to: fixTo, type });
  };
  renderTypes = ({ value, types, classes }) => {
    if (!types || types.length === 1) return null;
    const { type } = value;
    if (!type) return null;
    return (
      <div style={{ float: 'left' }}>
        <div style={{ width: '100%', height: 10 }} />
        <Select onChange={this.onChangeType} value={type} className={classes.typeInput}>
          {types.map(key => {
            return (
              <MenuItem dense key={key} value={key}>
                {this.props.translate(`ra.input.timeRanges.${key}`)}
              </MenuItem>
            );
          })}
        </Select>
      </div>
    );
  };

  onChangeHourFromTo = valFrom => {
    const { onChange, value } = this.props;
    if (!valFrom) {
      onChange({ ...value, from: null, to: null });
    } else {
      let time = moment(valFrom);
      onChange(this.fixFromTo({ ...value, from: time.startOf('day').toDate(), to: time.endOf('day').toDate() }));
    }
  };

  onChangeFrom = valFrom => {
    const { onChange, value } = this.props;
    const { to } = value;

    if (!valFrom) {
      onChange({ ...value, from: null, to: null });
    } else {
      onChange(this.fixFromTo({ ...value, from: valFrom, to }));
    }
  };

  onChangeTo = valTo => {
    const { onChange, value } = this.props;
    const { from } = value;

    if (!valTo) {
      onChange({ ...value, from: null, to: null });
    } else {
      onChange(this.fixFromTo({ ...value, from, to: valTo }));
    }
  };

  fixFromTo = value => {
    const { from, to, type } = value;
    if (from && to && from.getTime() > to.getTime()) {
      return { type, from: to, to: from };
    }
    return value;
  };

  renderFromTo = ({
    className,
    value,
    translate,
    yearCenter,
    yearRange,
    classes,
    allowEmpty,
    // ...rest
  }) => {
    // eslint-disable-next-line no-unused-vars
    const { from, to } = value;
    const type = get(value, 'type');
    switch (type) {
      case 'hour':
        return this.renderDay({
          key: 'from',
          value,
          onChange: this.onChangeHourFromTo,
          className,
          classes,
          translate,
          format: 'L',
          type,
        });
      case 'day':
        return [
          this.renderDay({
            key: 'from',
            value,
            onChange: this.onChangeFrom,
            className,
            classes,
            translate,
            format: 'L',
            type,
          }),
          // <span key="s">&nbsp;&nbsp;_&nbsp;&nbsp;</span>,
          this.renderDay({
            key: 'to',
            value,
            onChange: this.onChangeTo,
            className,
            classes,
            translate,
            format: 'L',
            type,
          }),
        ];
      case 'month':
        return [
          this.renderMonth({
            key: 'from',
            value,
            onChange: this.onChangeFrom,
            className,
            classes,
            translate,
          }),
          // <span key="s">&nbsp;&nbsp;_&nbsp;&nbsp;</span>,
          this.renderMonth({
            key: 'to',
            value,
            onChange: this.onChangeTo,
            className,
            classes,
            translate,
          }),
        ];
      case 'year':
        return [
          this.renderYear({
            key: 'from',
            translate,
            className,
            yearValue: from,
            yearCenter,
            yearRange,
            allowEmpty,
            classes,
            onChange: this.onChangeFrom,
          }),
          // <span key="s">&nbsp;&nbsp;_&nbsp;&nbsp;</span>,
          this.renderYear({
            translate,
            key: 'to',
            className,
            yearValue: to,
            yearCenter,
            yearRange,
            allowEmpty,
            classes,
            onChange: this.onChangeTo,
          }),
        ];
      default:
        return null;
      // return <RawDateInput date="true" value={from} {...rest} className={classNames(className)} />;
    }
  };

  renderHour({ translate, value, key, allowEmpty, className, classes, ...rest }) {
    let hourValue = value[key];
    return (
      <FormControl key={key} className={classNames(classes.dateInput, className)}>
        <InputLabel shrink htmlFor="age-label-placeholder">
          {translate(`ra.input.timeRanges.${key}`)}
        </InputLabel>
        <RawDateTimeInput
          key={key}
          date
          value={hourValue}
          fixUI={false}
          {...rest}
          className={classNames(classes.dateInput, className)}
        />
      </FormControl>
    );
  }

  renderDay({ translate, value, key, allowEmpty, className, classes, type, ...rest }) {
    let dateValue = value[key];
    const label = type === 'hour' ? translate(`ra.input.timeRanges.day`) : translate(`ra.input.timeRanges.${key}`);
    return (
      <FormControl key={key} className={classNames(classes.dateInput, className)}>
        <InputLabel shrink htmlFor="age-label-placeholder">
          {label}
        </InputLabel>
        <RawDateInput
          fixUI={false}
          key={key}
          date
          value={dateValue}
          {...rest}
          className={classNames(classes.dateInput, className)}
        />
      </FormControl>
    );
  }

  renderMonth({ translate, value, key, allowEmpty, className, classes, ...rest }) {
    let dateValue = value[key];
    return (
      <FormControl key={key} className={classNames(classes.monthInput, className)}>
        <InputLabel shrink htmlFor="age-label-placeholder">
          {translate(`ra.input.timeRanges.${key}`)}
        </InputLabel>
        <RawMonthInput
          key={key}
          date
          fixUI={false}
          value={dateValue}
          {...rest}
          className={classNames(classes.monthInput, className)}
        />
      </FormControl>
    );
  }

  renderYear({ yearValue, yearCenter, yearRange, translate, key, allowEmpty, onChange, classes, className, ...rest }) {
    let fixYear = yearValue ? moment(yearValue).year() : '';
    let yearItems = [];
    if (allowEmpty) {
      yearItems.push(<MenuItem dense key={0} value={''} />);
    }

    for (let i = yearCenter - yearRange; i < yearCenter + yearRange; i++) {
      yearItems.push(
        <MenuItem dense key={i} value={i}>
          {i}
        </MenuItem>,
      );
    }
    const handleOnChane = e => {
      let val = e.target.value;
      if (val) {
        onChange(moment(val, 'YYYY').toDate());
      } else {
        onChange(val);
      }
    };
    return (
      <FormControl key={key} className={classNames(classes.dateInput, className)}>
        <InputLabel shrink htmlFor="age-label-placeholder">
          {translate(`ra.input.timeRanges.${key}`)}
        </InputLabel>
        <Select value={fixYear} className={classNames(classes.yearInputElement)} {...rest} onChange={handleOnChane}>
          {yearItems}
        </Select>
      </FormControl>
    );
  }

  render() {
    const { className } = this.props;
    return (
      <div style={{ flexWrap: 'wrap' }} className={className}>
        {this.renderTypes(this.props)}
        {this.renderFromTo(this.props)}
      </div>
    );
  }
}

RawTimeRangeInput.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  value: PropTypes.any,
  types: PropTypes.arrayOf(PropTypes.string),
  defaultType: PropTypes.string,
  onChange: PropTypes.func,
  translate: PropTypes.func,
  yearCenter: PropTypes.number,
  yearRange: PropTypes.number,
  allowEmpty: PropTypes.bool,
};
RawTimeRangeInput.defaultProps = {
  yearCenter: moment().year(),
  yearRange: 4,
  defaultType: 'date',
  type: 'date',
};
const enhance = compose(translate, withStyles(styles));
export default enhance(RawTimeRangeInput);
