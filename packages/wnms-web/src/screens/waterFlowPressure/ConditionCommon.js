import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlexFormFilter, translate, SelectInput } from 'ra-loopback3';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Grid, Paper } from '@material-ui/core';
import moment from 'moment-timezone';
import SelectHourDayMonthYearFromTo from '../../components/commons/SelectHourDayMonthYearFromTo';
const styles = theme => {
  return {
    paper: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  };
};
let choices = [
  { id: 'flow', name: 'generic.flow' },
  { id: 'pressure', name: 'generic.pressure' },
];
class ConditionCommon extends Component {
  state = {
    typeStatistic: 'flow',
    typeTime: 'month',
    valueTimeFrom: moment(new Date())
      .subtract(6, 'month')
      .format('YYYY-MM'),
    valueTimeTo: moment(new Date()).format('YYYY-MM'),
  };

  UNSAFE_componentWillMount() {
    this.onChangeConditionCommon(
      this.state.typeStatistic,
      this.state.typeTime,
      this.state.valueTimeFrom,
      this.state.valueTimeTo,
    );
  }
  onChangeTime = dataTime => {
    this.setState({
      typeTime: dataTime.typeTime,
      valueTimeFrom: dataTime.valueTimeFrom,
      valueTimeTo: dataTime.valueTimeTo,
    });
    this.onChangeConditionCommon(
      this.state.typeStatistic,
      dataTime.typeTime,
      dataTime.valueTimeFrom,
      dataTime.valueTimeTo,
    );
  };
  onChangeFlowPressure = (e, val) => {
    this.setState({ typeStatistic: val });
    this.onChangeConditionCommon(val, this.state.typeTime, this.state.valueTimeFrom, this.state.valueTimeTo);
  };
  onChangeConditionCommon = (typeStatistic, typeTime, valueTimeFrom, valueTimeTo) => {
    let tmp = {};
    tmp.typeStatistic = typeStatistic;
    tmp.typeTime = typeTime;
    tmp.valueTimeFrom = valueTimeFrom;
    tmp.valueTimeTo = valueTimeTo;
    this.props.onChangeConditionCommon(tmp);
  };
  render() {
    const { classes, translate } = this.props;
    return (
      <Paper className={classes.paper}>
        <FlexFormFilter formName={'filter-form-flow-pressure-common'}>
          <Grid middle container>
            <SelectInput
              source="levelPipe"
              label={translate('resources.customwaterflowpressures.selectFlowPressure')}
              choices={choices}
              style={{ marginLeft: '5px' }}
              defaultValue={'flow'}
              onChange={this.onChangeFlowPressure}
            />
            <SelectHourDayMonthYearFromTo
              onChangeTime={this.onChangeTime}
              sourceTypeTime={'typeTime'}
              sourceDayFrom={'dayFrom'}
              sourceDayTo={'dayTo'}
              sourceMonthFrom={'monthFrom'}
              sourceMonthTo={'monthTo'}
              sourceYearFrom={'yearFrom'}
              sourceYearTo={'yearTo'}
              sourceHour={'hour'}
            />
          </Grid>
        </FlexFormFilter>
      </Paper>
    );
  }
}

ConditionCommon.propTypes = {
  translate: PropTypes.func,
  classes: PropTypes.object,
  onChangeConditionCommon: PropTypes.func,
};
ConditionCommon.defaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const enhance = compose(connect(null, {}), withTheme, withStyles(styles), translate);

export default enhance(ConditionCommon);
