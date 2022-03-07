import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import { compose } from 'recompose';
import { MonthInput, YearInput, SelectInput, translate } from 'ra-loopback3';
import { connect } from 'react-redux';
// import moment from 'moment-timezone';
const typeTime = [
  { id: 'month', name: 'generic.typeTime.month' },
  { id: 'year', name: 'generic.typeTime.year' },
];

class SelectMonthYear extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'month',
    };
  }
  onTypeChange = (event, value) => {
    this.setState({
      type: value,
    });
  };

  setTime = value => {
    let tmp = {};
    tmp.typeTime = this.state.type;
    tmp.valueTime = value;
    this.props.onChangeTime(tmp);
  };

  handleChangeTimeMonth = (event, value) => {
    this.setTime(value);
  };

  handleChangeTimeYear = (event, value) => {
    this.setTime(value);
  };
  renderInputType() {
    if (this.state.type === 'month') {
      return (
        <MonthInput
          source={'month'}
          onChange={this.handleChangeTimeMonth}
          label={this.props.translate('generic.typeTime.month')}
          style={{ marginLeft: '20px', paddingTop: '10px' }}
          fixUI={false}
          date
        />
      );
    } else if (this.state.type === 'year') {
      return (
        <YearInput
          source={'year'}
          onChange={this.handleChangeTimeYear}
          label={this.props.translate('generic.typeTime.year')}
          style={{ width: 50, marginLeft: '20px' }}
        />
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
          style={{ marginLeft: '20px' }}
          translateChoice={true}
          source={'typeTime'}
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
};
const enhance = compose(
  translate,
  connect(null, {
    push,
  }),
);

export default enhance(SelectMonthYear);
