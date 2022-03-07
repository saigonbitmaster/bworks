import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import { compose } from 'recompose';
import classNames from 'classnames';
import { FlexFormFilter, MaterialSelectInput, SelectInput } from 'ra-loopback3';
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

let choices = [
  { id: 'MaterialUse', name: 'resources.customstatisticmatbylifespans.statistic.MaterialUse' },
  { id: 'MaterialExport', name: 'resources.customstatisticmatbylifespans.statistic.MaterialExport' },
  { id: 'MaterialStock', name: 'resources.customstatisticmatbylifespans.statistic.MaterialStock' },
];

class ConditionStatistic extends Component {
  formRef = React.createRef();
  defaultValue = {
    typeMat: 'AllMat',
    typeTime: 'month',
    month: new Date(),
    year: moment().format('YYYY'),
    statisticWhere: 'MaterialUse',
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
    let { typeTime, month, year, typeMat, statisticWhere } = filter;
    let valueTime = '';
    if (typeTime === 'month') {
      valueTime = moment(month).format('YYYY-MM');
    } else if (typeTime === 'year') {
      valueTime = year;
    }
    this.props.onStatistic({ typeMat, typeTime, valueTime, statisticWhere });
  };
  render() {
    const { classes, translate } = this.props;
    return (
      <FlexFormFilter
        formName="filter-form-statistic-mat-life-span"
        formRef={this.formRef}
        defaultValue={this.defaultValue}
        onChange={this.onChangeFilter}
      >
        <Grid middle container spacing={2}>
          <SelectInput
            source="statisticWhere"
            label={translate('resources.customstatisticmatbylifespans.statisticWhere')}
            choices={choices}
            style={{ marginLeft: '20px' }}
          />
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
