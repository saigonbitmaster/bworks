import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SelectInput } from 'react-admin';
import moment from 'moment-timezone';

export default class YearInput extends PureComponent {
  static propTypes = {
    center: PropTypes.number,
    range: PropTypes.number,
    date: PropTypes.any,
  };
  static defaultProps = {
    center: moment().year(),
    range: 3,
  };
  choices() {
    const { center, range } = this.props;
    let result = [];
    for (let i = center - range; i < center + range; i++) {
      result.push({ id: `${i}`, name: `${i}` });
    }
    return result;
  }
  render() {
    const { center, range, date, ...rest } = this.props;
    return <SelectInput {...rest} choices={this.choices()} translateChoice={false} />;
  }
}
