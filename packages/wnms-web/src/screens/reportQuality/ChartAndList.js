import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  translate,
  List,
  Datagrid,
  TextField,
  withDataProvider,
  DateField,
  NumberField,
  showDialog,
  FunctionField,
} from 'ra-loopback3';
import { Grid, Paper } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import ColoredFunctionField from './ColorField';
import get from 'lodash/get';

const styles = theme => {
  return {
    paper: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    relative: {
      position: 'relative !important',
    },
  };
};

/*
  Note: duoc su dung chung voi ../subQualityLogger
 */
class ChartAndList extends Component {
  state = {
    sumTotalWaterSource: 0,
    numberAlertCriticalHigh: 0,
    numberAlertHigh: 0,
    numberAlertLow: 0,
    numberAlertCriticalLow: 0,
    sourceList: [],
    data: [],
    filter: {},
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    let { report, filter } = nextProps;
    if (report && report.list && report.list.total > 0) {
      let sumTotalWaterSource = 0;
      let ids = report.list.ids;
      let data = ids.map(id => report.data[id]);
      let rawSourceList = data.map(item => item.waterSourceName);
      let sourceList = Array.from(new Set(rawSourceList));
      let numberAlertCriticalHigh = data.filter(item => item.alert == '1').length;
      let numberAlertHigh = data.filter(item => item.alert == '2').length;
      let numberAlertLow = data.filter(item => item.alert == '3').length;
      let numberAlertCriticalLow = data.filter(item => item.alert == '4').length;
      sumTotalWaterSource = sourceList.length;
      this.setState({
        sumTotalWaterSource: sumTotalWaterSource,
        numberAlertCriticalHigh: numberAlertCriticalHigh,
        numberAlertHigh: numberAlertHigh,
        numberAlertLow: numberAlertLow,
        numberAlertCriticalLow: numberAlertCriticalLow,
        sourceList: sourceList,
        data: data,
        filter: filter,
      });
    } else {
      this.setState({
        sumTotalWaterSource: 0,
        numberAlertCriticalHigh: 0,
        numberAlertHigh: 0,
        numberAlertLow: 0,
        numberAlertCriticalLow: 0,
        sourceList: [],
        data: [],
        filter: {},
      });
    }
  }
  render() {
    const { classes, translate, filter, refController } = this.props;
    const {
      sumTotalWaterSource,
      numberAlertCriticalHigh,
      numberAlertHigh,
      numberAlertLow,
      numberAlertCriticalLow,
    } = this.state;
    let subTitle = [
      {
        id: 1,
        content: translate('resources.reportqualities.sumLogger', { val: sumTotalWaterSource }),
      },
      {
        id: 2,
        content: translate('resources.reportqualities.numberAlertCriticalHigh', {
          val: numberAlertCriticalHigh,
        }),
      },
      {
        id: 3,
        content: translate('resources.reportqualities.numberAlertHigh', { val: numberAlertHigh }),
      },
      {
        id: 4,
        content: translate('resources.reportqualities.numberAlertLow', { val: numberAlertLow }),
      },
      {
        id: 5,
        content: translate('resources.reportqualities.numberAlertCriticalLow', {
          val: numberAlertCriticalLow,
        }),
      },
    ];
    const selectedParamSymbol = get(this.props.filter, 'waterParameter', '');
    return (
      <Grid>
        <Grid item xs={12} sm={12}>
          <Paper className={classes.paper}>
            <List
              {...this.props}
              refController={refController}
              // className="subheader"
              resource="reportqualities"
              fixUrl="MaterialUses/nmsReportQuality"
              title={translate('generic.report.titleReportQuality')}
              bulkActions={false}
              subTitle={subTitle}
              sort={{ field: 'logTime', order: 'DESC' }}
              perPage={25}
              customFilter={{ where: filter, sort: { field: 'logTime', order: 'DESC' } }}
            >
              <Datagrid>
                <TextField source="dmaName" />
                <FunctionField
                  // eslint-disable-next-line
                  render={record => selectedParamSymbol ? translate(`generic.symbol.${selectedParamSymbol}`): ''}
                  label={translate('resources.reportqualities.fields.waterParameter')}
                />
                <DateField source="logTime" showTime />
                <NumberField
                  source={selectedParamSymbol}
                  label={selectedParamSymbol ? translate(`generic.symbol.${selectedParamSymbol}`) : ''}
                />
                <ColoredFunctionField
                  source="alert"
                  render={record => translate(`resources.reportqualities.alert${record.alert}`)}
                />
              </Datagrid>
            </List>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

ChartAndList.propTypes = {
  classes: PropTypes.object,
  dataProvider: PropTypes.any,
  filter: PropTypes.object,
  refChart: PropTypes.any,
  refController: PropTypes.any,
  showDialog: PropTypes.any,
  translate: PropTypes.func,
  report: PropTypes.object,
};

const mapStateToProps = state => {
  return {
    report: state.admin.resources.reportqualities,
  };
};

const enhance = compose(
  connect(mapStateToProps, { showDialog }),
  withTheme,
  withStyles(styles),
  translate,
  withDataProvider,
);

export default enhance(ChartAndList);
