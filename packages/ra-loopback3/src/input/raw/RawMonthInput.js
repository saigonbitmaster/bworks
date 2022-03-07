import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import classNames from 'classnames';
import moment from 'moment-timezone';
import { Select, MenuItem, withStyles, FormControl } from '@material-ui/core';

// eslint-disable-next-line no-unused-vars
const styles = theme => ({
  input: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingBottom: '0px',
  },
  month: {
    minWidth: '40px',
  },
  year: {
    minWidth: '70px',
  },
  formControl: {},
});
class RawMonthInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = this.parseMonth(props.value, props.date);
  }
  parseMonth = (value, date) => {
    let year = undefined;
    let month = undefined;
    if (value) {
      if (date && value) {
        let fixDate = moment(value);
        year = fixDate.year();
        month = fixDate.month() + 1;
      } else {
        let fixValue = value || '0-0';
        let fixDate = fixValue.toString().split('-');
        year = parseInt(fixDate[0] || 0) || undefined;
        month = parseInt(fixDate[1] || 0) || undefined;
      }
    }
    return { year, month };
  };
  renderYearItems(yearCenter, yearRange) {
    let yearItems = [];
    if (this.props.allowEmpty) {
      yearItems.push(<MenuItem dense key={0} value={null} />);
    }
    for (let i = yearCenter - yearRange; i < yearCenter + yearRange; i++) {
      yearItems.push(
        <MenuItem dense key={i} value={i}>
          {i}
        </MenuItem>,
      );
    }
    return yearItems;
  }
  renderMonthItems() {
    let monthItems = [];
    if (this.props.allowEmpty) {
      monthItems.push(<MenuItem dense key={0} value={null} />);
    }
    for (let i = 1; i <= 12; i++) {
      monthItems.push(
        <MenuItem dense key={i} value={i}>
          {i}
        </MenuItem>,
      );
    }
    return monthItems;
  }
  handleMonthChange = (month, oldData) => {
    const { date, onChange } = this.props;
    if (!month) {
      onChange(null);
    } else {
      let time = moment().startOf('month');
      time.month(month - 1);
      if (oldData.year) {
        time.year(oldData.year);
      }
      onChange(date ? time.toDate() : time.format('YYYY-MM'));
    }
  };
  handleYearChange = (year, oldData) => {
    const { date, onChange } = this.props;
    if (!year) {
      onChange(null);
    } else {
      let time = moment().startOf('month');
      time.year(year);
      if (oldData.month) {
        time.month(oldData.month - 1);
      }
      onChange(date ? time.toDate() : time.format('YYYY-MM'));
    }
  };
  render() {
    const {
      className,
      value,
      yearCenter,
      yearRange,
      classes,
      date,
      onChange,
      onBlur,
      allowEmpty,
      fixUI,
      ...props
    } = this.props;
    let data = this.parseMonth(value, date);
    return (
      <div className={classNames(classes.input, className)}>
        <FormControl className={classes.formControl}>
          {fixUI !== false && <div style={{ width: '100%', height: 10 }} />}
          <Select
            value={data.month || ''}
            {...props}
            className={classes.month}
            onChange={event => this.handleMonthChange(event.target.value, data)}
          >
            {this.renderMonthItems()}
          </Select>
        </FormControl>

        <FormControl className={classes.formControl}>
          {fixUI !== false && <div style={{ width: '100%', height: 10 }} />}
          <Select
            value={data.year || ''}
            {...props}
            className={classes.year}
            onChange={event => this.handleYearChange(event.target.value, data)}
          >
            {this.renderYearItems(yearCenter, yearRange)}
          </Select>
        </FormControl>
      </div>
    );
  }
}

RawMonthInput.propTypes = {
  className: PropTypes.string,
  value: PropTypes.any,
  yearCenter: PropTypes.number,
  yearRange: PropTypes.number,
  date: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  classes: PropTypes.object,
  allowEmpty: PropTypes.any,
  fixUI: PropTypes.any,
};
RawMonthInput.defaultProps = {
  yearCenter: moment().year(),
  yearRange: 4,
  allowEmpty: true,
};

const enhance = compose(withStyles(styles));
export default enhance(RawMonthInput);
