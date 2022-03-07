import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import { compose } from 'recompose';
import { MonthInput, YearInput, SelectInput, translate } from 'ra-loopback3';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
const typeTime = [
  { id: 'month', name: 'generic.typeTime.month' },
  { id: 'year', name: 'generic.typeTime.year' },
];

class SelectMonthYear extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'month',
      monthFrom: moment(new Date())
        .subtract(6, 'month')
        .format('YYYY-MM'),
      monthTo: moment(new Date()).format('YYYY-MM'),
      yearFrom: '',
      yearTo: '',
    };
  }
  onTypeChange = (event, value) => {
    let from, to;
    if (value === 'month') {
      from = this.state.monthFrom;
      to = this.state.monthTo;
    } else {
      from = this.state.yearFrom;
      to = this.state.yearTo;
    }
    this.setState({
      type: value,
    });
    this.setTime(value, from, to);
  };
  setTime = (type, from, to) => {
    if (from && to && from > to) {
      let t = from;
      from = to;
      to = t;
    }
    let tmp = {};
    tmp.typeTime = type;
    tmp.valueTimeFrom = from;
    tmp.valueTimeTo = to;
    this.props.onChangeTime(tmp);
  };
  onChangeYearFrom = (e, val) => {
    this.setState({ yearFrom: val });
    this.setTime(this.state.type, val, this.state.yearTo);
  };
  onChangeYearTo = (e, val) => {
    this.setState({ yearTo: val });
    this.setTime(this.state.type, this.state.yearFrom, val);
  };
  onChangeMonthFrom = (e, val) => {
    this.setState({ monthFrom: val });
    this.setTime(this.state.type, val, this.state.monthTo);
  };
  onChangeMonthTo = (e, val) => {
    this.setState({ monthTo: val });
    this.setTime(this.state.type, this.state.monthFrom, val);
  };
  renderInputType() {
    if (this.state.type === 'month') {
      return (
        <div style={{ float: 'right' }}>
          <MonthInput
            source={this.props.sourceMonthFrom}
            onChange={this.onChangeMonthFrom}
            label={this.props.translate('generic.typeTime.monthFrom')}
            style={{ marginLeft: '10px' }}
            defaultValue={moment(new Date())
              .subtract(6, 'month')
              .format('YYYY-MM')}
          />
          <MonthInput
            source={this.props.sourceMonthTo}
            onChange={this.onChangeMonthTo}
            label={this.props.translate('generic.typeTime.monthTo')}
            style={{ marginLeft: '10px' }}
            defaultValue={moment(new Date()).format('YYYY-MM')}
          />
        </div>
      );
    } else if (this.state.type === 'year') {
      return (
        <div style={{ float: 'right' }}>
          <YearInput
            source={this.props.sourceYearFrom}
            onChange={this.onChangeYearFrom}
            label={this.props.translate('generic.typeTime.yearFrom')}
            style={{ width: 50, marginLeft: '20px' }}
          />
          <YearInput
            source={this.props.sourceYearTo}
            onChange={this.onChangeYearTo}
            label={this.props.translate('generic.typeTime.yearTo')}
            style={{ width: 50, marginLeft: '20px' }}
          />
        </div>
      );
    }
  }
  render() {
    return (
      <div>
        <SelectInput
          onChange={this.onTypeChange}
          choices={typeTime}
          label={this.props.translate('generic.statistic.selectTime')}
          style={{ marginLeft: '5px' }}
          translateChoice={true}
          source={this.props.sourceTypeTime}
          defaultValue={'month'}
        />
        {this.renderInputType()}
      </div>
    );
  }
}

SelectMonthYear.defaultProps = {};

SelectMonthYear.propTypes = {
  onChangeTime: PropTypes.func,
  translate: PropTypes.func,
  sourceTypeTime: PropTypes.string.isRequired,
  sourceMonthFrom: PropTypes.string.isRequired,
  sourceMonthTo: PropTypes.string.isRequired,
  sourceYearFrom: PropTypes.string.isRequired,
  sourceYearTo: PropTypes.string.isRequired,
};
const enhance = compose(
  translate,
  connect(null, {
    push,
  }),
);

export default enhance(SelectMonthYear);
