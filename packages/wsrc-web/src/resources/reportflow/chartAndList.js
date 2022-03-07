import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  translate,
  List,
  Datagrid,
  TextField,
  CUSTOM,
  withDataProvider,
  DateField,
  NumberField,
  showDialog,
  PdfView,
} from 'ra-loopback3';
import { Grid, Paper } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import format from '../../util/format';
import config from '../../Config';
import ColoredFunctionField from './colorField';

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

  componentDidMount() {
    const { refChart } = this.props;
    if (refChart) {
      refChart.current = this;
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let { report, filter } = nextProps;
    if (report && report.list && report.data && report.list.ids.length > 0) {
      let sumTotalWaterSource = 0;
      // let avgFunc = array => array.reduce((a, b) => a + b, 0) / array.length;
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
    }
  }

  dataForChart() {
    let { sourceList, data } = this.state;
    let legendPayload = [];
    let scatterArray = [];
    let chartData = {};
    let key;
    switch (this.state.filter.typeTime) {
      case 'hour': {
        key = 'H:mm';
        break;
      }
      case 'day': {
        key = 'DD/MM/YYYY';
        break;
      }
      case 'month': {
        key = 'MM/YYYY';
        break;
      }
      case 'year': {
        key = 'MM/YYYY';
        break;
      }
    }
    let filteredData = data.filter(item => item.alert !== '5');
    let dataTemp = filteredData.map(item => Object.assign({}, item, { logTime: moment(item.logTime).format(key) }));
    for (let i = 0; i < sourceList.length; i++) {
      legendPayload.push({ id: sourceList[i], value: sourceList[i], type: 'cross', color: config.color.basicChart[i] });
      scatterArray.push(
        <Scatter
          name={sourceList[i]}
          data={dataTemp.filter(item => item.waterSourceName == sourceList[i])}
          fill={config.color.basicChart[i]}
          line
          shape="cross"
        />,
      );
    }

    chartData.legendPayload = legendPayload;
    chartData.scatterArray = scatterArray;
    return chartData;
  }

  // conduct data and print pdf
  handlePrint = () => {
    const {
      sumTotalWaterSource,
      numberAlertCriticalHigh,
      numberAlertHigh,
      numberAlertLow,
      numberAlertCriticalLow,
      data,
      sourceList,
      filter,
    } = this.state;
    const { translate } = this.props;
    let templateData = {};
    templateData.reportName = translate('generic.report.titleReportFlow');
    templateData.reportFilter = `${sourceList} || ${filter.valueTimeFrom}-${filter.valueTimeTo}`;
    templateData.sumData01 = translate('resources.reportflows.sumWaterSource', {
      val: format.number(sumTotalWaterSource, 2),
    });
    templateData.sumData02 = translate('resources.reportflows.numberAlertCriticalHigh', {
      val: format.number(numberAlertCriticalHigh, 2),
    });
    templateData.sumData03 = translate('resources.reportflows.numberAlertHigh', {
      val: format.number(numberAlertHigh, 2),
    });
    templateData.sumData04 = translate('resources.reportflows.numberAlertLow', {
      val: format.number(numberAlertLow, 2),
    });
    templateData.sumData05 = translate('resources.reportflows.numberAlertCriticalLow', {
      val: format.number(numberAlertCriticalLow, 2),
    });
    templateData.tableHeader = {
      column01: translate('resources.reportflows.fields.waterSourceName'),
      column02: translate('resources.reportflows.fields.logTime'),
      column03: translate('resources.reportflows.fields.flowRate'),
      column04: translate('resources.reportflows.fields.alert'),
    };

    templateData.data = data.map(item =>
      Object.assign(
        {},
        item,
        { logTime: moment(item.logTime).format('DD-MM-YYYY HH:mm') },
        { alert: translate(`resources.reportflows.alert${item.alert}`) },
      ),
    );
    this.props
      .dataProvider(CUSTOM, 'ReportEngines', {
        method: 'POST',
        subUrl: 'generatePDF',
        body: {
          data: templateData,
          templateId: 'FlowReportTemplate',
          templateModel: 'SourceTemplate',
          fileModel: 'SourceFile',
        },
      })
      .then(res => this.props.showDialog(<PdfView url={`/api/PDFGetters/getPDF?filename=${res.data}`} />));
  };

  render() {
    const { classes, translate, refController } = this.props;
    const {
      sumTotalWaterSource,
      numberAlertCriticalHigh,
      numberAlertHigh,
      numberAlertLow,
      numberAlertCriticalLow,
    } = this.state;
    // let optionFormat;
    let subTitle = [
      {
        id: 1,
        content: translate('resources.reportflows.sumWaterSource', { val: format.number(sumTotalWaterSource, 2) }),
      },
      {
        id: 2,
        content: translate('resources.reportflows.numberAlertCriticalHigh', {
          val: format.number(numberAlertCriticalHigh, 2),
        }),
      },
      {
        id: 3,
        content: translate('resources.reportflows.numberAlertHigh', { val: format.number(numberAlertHigh, 2) }),
      },
      { id: 4, content: translate('resources.reportflows.numberAlertLow', { val: format.number(numberAlertLow, 2) }) },
      {
        id: 5,
        content: translate('resources.reportflows.numberAlertCriticalLow', {
          val: format.number(numberAlertCriticalLow, 2),
        }),
      },
    ];
    return (
      <Grid container>
        {/* <Grid item xs={12} sm={12}>
          <Paper>
            <ResponsiveContainer width="99%" aspect={3}>
              <ScatterChart margin={{ top: 20, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="category"
                  dataKey="logTime"
                  name={translate('resources.reportflows.time')}
                  padding={{ bottom: 20 }}
                  label={{
                    value: translate('resources.reportflows.time'),
                    position: 'insideBottomRight',
                    fontSize: '0.8em',
                    offset: 0,
                  }}
                  tick={{ fontSize: '0.8em' }}
                />
                <YAxis
                  type="number"
                  dataKey="flowRate"
                  name={translate('resources.reportflows.value')}
                  padding={{ top: 20 }}
                  label={{
                    value: translate('resources.reportflows.value'),
                    position: 'top',
                    fontSize: '0.8em',
                    offset: 0,
                  }}
                  tick={{ fontSize: '0.8em' }}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend payload={this.dataForChart().legendPayload} />
                {this.dataForChart().scatterArray}
              </ScatterChart>
            </ResponsiveContainer>
          </Paper>
        </Grid> */}
        <Grid item xs={12} sm={12}>
          <Paper className={classes.paper}>
            <List
              {...this.props}
              refController={refController}
              className="subheader"
              resource="reportflows"
              fixUrl="WaterSources/reportFlow"
              title={translate('generic.report.titleReportFlow')}
              bulkActions={false}
              subTitle={subTitle}
              sort={{ field: 'logTime', order: 'DESC' }}
              perPage={25}
            >
              <Datagrid>
                <TextField source="waterSourceName" />
                <DateField source="logTime" showTime={this.state.filter.typeTime == 'hour'} />
                <NumberField source="flowRate" />
                <ColoredFunctionField
                  source="alert"
                  render={record => translate(`resources.reportflows.alert${record.alert}`)}
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
  translate: PropTypes.func,
  classes: PropTypes.object,
  filter: PropTypes.object,
  refController: PropTypes.any,
  refChart: PropTypes.object,
  showDialog: PropTypes.func,
  dataProvider: PropTypes.any,
};

const mapStateToProps = state => {
  return {
    report: state.admin.resources.reportflows,
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
