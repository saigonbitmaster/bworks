/* eslint-disable react/prop-types */
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
// import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import format from '../../util/format';
// import config from '../../Config';
import ColoredFunctionField from './colorField';
// import CustomTooltip from './customTooltip';
// import PdfViewData from '../reportflow/pdfView';

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
    domain: ['auto', 'auto'],
    key: 'DD-MM-YYYY',
  };
  componentDidMount() {
    // this.setState({ filter: this.props.filter });
    // const { refChart } = this.props;
    // if (refChart) {
    //   refChart.current = this;
    // }
  }
  handlePrint() {
    this.props.showDialog(<PdfView name="generic.report.titleReportVolume" />);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    let { report, filter } = nextProps;
    let key;
    switch (filter.typeTime) {
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
        key = 'YYYY';
        break;
      }
      default:
        return;
    }
    if (report && report.list && report.data && report.list.ids.length > 0) {
      let sumTotalWaterSource = 0;
      //   minValue = 0,
      //   maxValue = 0,
      //   avgValue = 0;
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
        domain: [moment(filter.valueTimeFrom).valueOf(), moment(filter.valueTimeTo).valueOf()],
        key: key,
      });
    }
  }

  // dataForChart() {
  //   let { sourceList, data } = this.state;
  //   let legendPayload = [];
  //   let scatterArray = [];
  //   let chartData = {};

  //   // let filteredData = data.filter(item => item.alert !== '5');
  //   let filteredData = data;
  //   let dataTemp = filteredData.map(item => Object.assign({}, item, { logTime: moment(item.logTime).valueOf() }));
  //   for (let i = 0; i < sourceList.length; i++) {
  //     legendPayload.push({ id: sourceList[i], value: sourceList[i], type: 'cross', color: config.color.basicChart[i] });
  //     scatterArray.push(
  //       <Scatter
  //         name={sourceList[i]}
  //         data={dataTemp.filter(item => item.waterSourceName == sourceList[i])}
  //         fill={config.color.basicChart[i]}
  //         line
  //         shape="cross"
  //       />,
  //     );
  //   }

  //   chartData.legendPayload = legendPayload;
  //   chartData.scatterArray = scatterArray;
  //   return chartData;
  // }

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
    } = this.state;
    const { filter } = this.props;
    const { translate } = this.props;
    let templateData = {};
    templateData.reportName = translate('generic.report.titleReportVolume');
    templateData.reportFilter = `${sourceList} || ${filter.valueTimeFrom}-${filter.valueTimeTo}`;
    templateData.sumData01 = translate('resources.reportvolumes.sumWaterSource', {
      val: format.number(sumTotalWaterSource, 2),
    });
    templateData.sumData02 = translate('resources.reportvolumes.numberAlertCriticalHigh', {
      val: format.number(numberAlertCriticalHigh, 2),
    });
    templateData.sumData03 = translate('resources.reportvolumes.numberAlertHigh', {
      val: format.number(numberAlertHigh, 2),
    });
    templateData.sumData04 = translate('resources.reportvolumes.numberAlertLow', {
      val: format.number(numberAlertLow, 2),
    });
    templateData.sumData05 = translate('resources.reportvolumes.numberAlertCriticalLow', {
      val: format.number(numberAlertCriticalLow, 2),
    });
    templateData.tableHeader = {
      column01: translate('resources.reportvolumes.fields.waterSourceName'),
      column02: translate('resources.reportvolumes.fields.waterUsage'),
      column03: translate('resources.reportvolumes.fields.logTime'),
      column04: translate('resources.reportvolumes.fields.alert'),
    };

    templateData.data = data.map(item =>
      Object.assign(
        {},
        item,
        { logTime: moment(item.logTime).format('DD-MM-YYYY HH:mm') },
        { alert: translate(`resources.reportvolumes.alert${item.alert}`) },
      ),
    );
    this.props
      .dataProvider(CUSTOM, 'ReportEngines', {
        method: 'POST',
        subUrl: 'generatePDF',
        body: {
          data: templateData,
          templateId: 'VolumeReportTemplate',
          templateModel: 'SourceTemplate',
          fileModel: 'SourceFile',
        },
      })
      .then(res => this.props.showDialog(<PdfView url={`/api/PDFGetters/getPDF?filename=${res.data}`} />));
  };

  render() {
    const { classes, translate, refController, refChart, showDialog, basePath, ...rest } = this.props;
    // const XAxisName = translate('resources.reportvolumes.time');
    // const YAxisName = translate('resources.reportvolumes.value');
    const {
      sumTotalWaterSource,
      numberAlertCriticalHigh,
      numberAlertHigh,
      numberAlertLow,
      numberAlertCriticalLow,
      // key,
    } = this.state;
    // let optionFormat;
    let subTitle = [
      {
        id: 1,
        content: translate('resources.reportvolumes.sumWaterSource', { val: format.number(sumTotalWaterSource, 2) }),
      },
      {
        id: 2,
        content: translate('resources.reportvolumes.numberAlertCriticalHigh', {
          val: format.number(numberAlertCriticalHigh, 2),
        }),
      },
      {
        id: 3,
        content: translate('resources.reportvolumes.numberAlertHigh', { val: format.number(numberAlertHigh, 2) }),
      },
      {
        id: 4,
        content: translate('resources.reportvolumes.numberAlertLow', { val: format.number(numberAlertLow, 2) }),
      },
      {
        id: 5,
        content: translate('resources.reportvolumes.numberAlertCriticalLow', {
          val: format.number(numberAlertCriticalLow, 2),
        }),
      },
    ];
    return (
      <Grid>
        {/* <Grid item xs={12} sm={12}>
          <Paper>
            <ResponsiveContainer width="99%" aspect={3}>
              <ScatterChart margin={{ top: 20, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="logTime"
                  name={XAxisName}
                  padding={{ bottom: 20 }}
                  label={{
                    value: XAxisName,
                    position: 'insideBottomRight',
                    fontSize: '0.8em',
                    offset: 0,
                  }}
                  domain={this.state.domain}
                  tickFormatter={unixTime => moment(unixTime).format(key)}
                  tick={{ fontSize: '0.8em' }}
                />

                <YAxis
                  type="number"
                  dataKey="waterUsage"
                  name={YAxisName}
                  padding={{ top: 20 }}
                  label={{
                    value: YAxisName,
                    position: 'top',
                    fontSize: '0.8em',
                    offset: 0,
                  }}
                  tickFormatter={value => format.number(value)}
                  tick={{ fontSize: '0.8em' }}
                />
                <Tooltip
                  content={<CustomTooltip translate={translate} name={XAxisName} value={YAxisName} formatTime={key} />}
                />
                <Legend payload={this.dataForChart().legendPayload} />
                {this.dataForChart().scatterArray}
              </ScatterChart>
            </ResponsiveContainer>
          </Paper>
        </Grid> */}
        <Grid item xs={12} sm={12}>
          <Paper className={classes.paper}>
            <List
              {...rest}
              refController={refController}
              className="subheader"
              resource="reportvolumes"
              fixUrl="WaterSources/reportVolume"
              title={translate('generic.report.titleReportVolume')}
              bulkActions={false}
              subTitle={subTitle}
              sort={{ field: 'logTime', order: 'DESC' }}
              perPage={25}
            >
              <Datagrid>
                <TextField source="waterSourceName" />
                <NumberField source="waterUsage" />
                <DateField source="logTime" showTime={this.props.filter.typeTime == 'hour'} />
                <ColoredFunctionField
                  source="alert"
                  render={record => translate(`resources.reportvolumes.alert${record.alert}`)}
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
  dataProvider: PropTypes.any,
};

const mapStateToProps = state => {
  return {
    report: state.admin.resources.reportvolumes,
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
