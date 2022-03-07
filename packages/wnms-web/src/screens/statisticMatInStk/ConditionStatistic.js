import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import { compose } from 'recompose';
import classNames from 'classnames';
import { FlexFormFilter, MaterialSelectInput } from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import SelectMonthYear from '../../util/SelectMonthYear';

const styles = () => ({
  model: {
    float: 'right',
  },
});

class ConditionStatistic extends Component {
  formRef = React.createRef();
  defaultValue = {
    typeMat: 'AllMat',
    typeTime: 'month',
    month: new Date(),
    year: moment().format('YYYY'),
  };
  constructor(props) {
    super(props);
    this.state = {
      filter: this.defaultValue,
    };
  }
  // eslint-disable-next-line
  onChangeTime = dataTime => {
  };
  onChangeFilter = filter => {
    let { typeTime, month, year, typeMat } = filter;
    let valueTime = '';
    if (typeTime === 'month') {
      valueTime = moment(month).format('YYYY-MM');
    } else if (typeTime === 'year') {
      valueTime = year;
    }
    this.props.onStatistic({ typeMat, typeTime, valueTime });
  };
  render() {
    const { classes, translate } = this.props;
    return (
      <FlexFormFilter
        formName="filter-form-statistic-mat-stock"
        onChange={this.onChangeFilter}
        formRef={this.formRef}
        defaultValue={this.defaultValue}
      >
        <Grid middle container spacing={2}>
          <MaterialSelectInput
            source={'typeMat'}
            label={translate('generic.selectGroupMat')}
            className={classNames(classes.model)}
            style={{ marginLeft: '20px' }}
            allmat={'true'}
          />
          <SelectMonthYear onChangeTime={this.onChangeTime} />
        </Grid>
      </FlexFormFilter>
    );
  }
}

ConditionStatistic.propTypes = {
  push: PropTypes.func,
  translate: PropTypes.func,
  onStatistic: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

const enhance = compose(
  withStyles(styles),
  connect(null, {
    push,
  }),
);

export default enhance(ConditionStatistic);
