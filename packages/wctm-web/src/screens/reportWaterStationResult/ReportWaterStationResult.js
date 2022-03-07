import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography, Grid } from '@material-ui/core';
import { PictureAsPdf, CloudDownload } from '@material-ui/icons';
import {
  withDataProvider,
  CUSTOM,
  FlexFormFilter,
  Button,
  translate,
  Header,
  MonthInput,
  showNotification,
} from 'ra-loopback3';
import moment from 'moment';
import numeral from 'numeral';

const fillUntilReachLimit = (array, placeholder, limit) => {
  const arrayLength = array.length;
  if (arrayLength >= limit) {
    return array;
  } else {
    const newArray = [...array];
    const sizeDifference = Math.abs(arrayLength - limit);
    for (let step = 0; step < sizeDifference; step++) {
      newArray.push(placeholder);
    }
    return newArray;
  }
};

const styles = theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  table: {
    width: '100%',
  },
  borderedCell: {
    borderLeft: '1px solid rgba(224, 224, 224, 1)',
  },
  topCell: {
    borderTop: '1px solid rgba(224, 224, 224, 1)',
  },
  monthInput: {
    justifyContent: 'flex-start',
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
    alignItems: 'flex-end',
  },
  actionBar: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  button: {
    margin: theme.spacing(1),
    marginTop: 0,
  },
  iconInButton: {
    marginRight: '0.5em',
  },
  statisticsBox: {
    margin: theme.spacing(1),
    marginTop: 0,
    padding: '1rem',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'flex-start',
  },
  statisticsText: {
    textAlign: 'center',
  },
  individualStatisticsBox: {
    margin: '1rem',
  },
});

// Each of them should have 12 fields [DONE]
// Fields that have data should be displayed on top [TODO]
// Load new data based on user selection of new date [DONE]
@withDataProvider
@translate
@connect(null, { showNotification })
class ReportWaterStationResult extends Component {
  refController = React.createRef();
  formRefFilter = React.createRef();

  state = {
    date: moment().toDate(),
    waterStationData: null,
    processingPDF: false,
    processingExcel: false,
    saving: false,
  };

  changeDate = filter => {
    // Check if water station schema has been imported to database
    this.setState({ date: filter.time.toString() });
    this.loadWaterStationResult(moment(filter.time));
  };

  componentDidMount() {
    const { date } = this.state;
    this.validateExistenceOfGeoGroupSchema();
    this.loadWaterStationResult(date);
  }

  validateExistenceOfGeoGroupSchema = () => {
    this.setState({ saving: true });
    this.props
      .dataProvider(CUSTOM, 'GeoQuarters', { subUrl: 'validateExistenceOfGeoGroupSchema', fullUrl: true })
      .then(({ data: { result } }) => {
        if (!result) {
          this.props.showNotification('error.NON_EXISTENT_GEO_GROUP_SCHEMA', 'warning');
        }
        this.setState({
          geoGroupHasBeenImported: result,
        });
      })
      .finally(() => this.setState({ saving: false }));
  };

  loadWaterStationResult = date => {
    this.props
      .dataProvider(CUSTOM, 'ExcelUtils', {
        subUrl: 'getWaterStationData',
        fullUrl: true,
        query: { date },
      })
      .then(({ data: { waterStationData } }) => {
        this.setState({ waterStationData });
      });
  };

  exportPDF = () => {
    this.setState({ processingPDF: true });
    this.props
      .dataProvider(CUSTOM, 'CtmTemplates', {
        fullUrl: true,
        subUrl: 'exportWaterStationReportResult',
        query: { date: this.state.date },
        stream: 'file',
      })
      .finally(() => this.setState({ processingPDF: false }));
  };

  exportExcel = () => {
    this.setState({ processingExcel: true });
    this.props
      .dataProvider(CUSTOM, 'ExcelUtils', {
        fullUrl: true,
        subUrl: 'exportWaterStationReport',
        query: { date: this.state.date },
        stream: 'file',
      })
      .finally(() => this.setState({ processingExcel: false }));
  };

  render() {
    const { classes, translate } = this.props;
    const { waterStationData, processingExcel, processingPDF } = this.state;
    const waterStationStatistics = waterStationData
      ? waterStationData.filter(wst => !Array.isArray(wst))[0]
      : {
          previousMeterNumber: 0,
          currentMeterNumber: 0,
          ratioClient: 0,
          ratioMeterNumber: 0,
          ratioWaterUsedClient: 0,
          totalClient: 0,
          totalLastMonthClient: 0,
          totalLastMonthWaterUsedClient: 0,
          totalWaterUsedClient: 0,
        };
    const rows = waterStationData
      ? waterStationData
          .filter(wst => Array.isArray(wst))
          .map((station, stationIndex) => (
            <TableRow key={stationIndex}>
              {
                fillUntilReachLimit(station, '', 13)
                  .map((cellData, cellIndex) => {
                    let colSpan = 1;

                    return (
                      <TableCell key={`${stationIndex}.${cellIndex}`} colSpan={colSpan}>
                        {typeof cellData === 'number'
                          ? numeral(cellData).format('0,0.[00]')
                          : cellData.toString().indexOf('.') !== -1
                          ? numeral(parseFloat(cellData)).format('0,0.[00]')
                          : cellData}
                      </TableCell>
                    );
                  })
                  .reduce(
                    (acc, val) => {
                      const currentElementSpace = parseInt(val.props.colSpan);
                      if (acc.spaces < 13) {
                        acc.elements.push(val);
                        acc.spaces += currentElementSpace;
                      }
                      return acc;
                    },
                    { spaces: 0, elements: [] },
                  ).elements
              }
            </TableRow>
          ))
      : null;
    return (
      <Paper className={classes.root}>
        <div className={classes.actionBar}>
          <Header title="generic.report.titleReportWaterStationResult" />
          <div>
            <Button
              onClick={this.exportPDF}
              className={classes.button}
              label={translate('generic.exportPdf')}
              saving={processingPDF}
              permission={{ name: 'reportWaterStationReport', action: 'exportPDF' }}
            >
              <PictureAsPdf className={classes.iconInButton} />
            </Button>
            <Button
              onClick={this.exportExcel}
              className={classes.button}
              label={translate('generic.exportExcel')}
              saving={processingExcel}
              permission={{ name: 'reportWaterStationReport', action: 'exportExcel' }}
            >
              <CloudDownload className={classes.iconInButton} />
            </Button>
          </div>
        </div>
        <Grid container>
          <Grid middle="true" item xs={12} sm={12}>
            <FlexFormFilter
              onChange={this.changeDate}
              formRef={this.formRefFilter}
              defaultValue={{ time: moment().toDate() }}
              formName="formFilterWaterStationResult"
            >
              <Grid middle="true" container>
                <MonthInput
                  date
                  source={'time'}
                  label={this.props.translate('generic.typeTime.month')}
                  style={{ marginLeft: '10px', width: '130px' }}
                  disabled={!this.state.geoGroupHasBeenImported}
                />
              </Grid>
            </FlexFormFilter>
          </Grid>
        </Grid>
        <div className={classes.statisticsBox}>
          <div className={classes.individualStatisticsBox} style={{ marginLeft: 0 }}>
            <Typography variant="subtitle1" gutterBottom>
              Số tiêu thụ kỳ đầu: {numeral(waterStationStatistics.previousMeterNumber).format('0,0.[00]')} (m
              <sup>3</sup>)
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Số tiêu thụ kỳ sau: {numeral(waterStationStatistics.currentMeterNumber).format('0,0.[00]')} (m
              <sup>3</sup>)
            </Typography>
            <hr />
            {waterStationStatistics.ratioMeterNumber ? (
              <Typography variant="subtitle1" gutterBottom>
                Phần trăm hoàn thành: {numeral(parseFloat(waterStationStatistics.ratioMeterNumber)).format('0,0.[00]')}{' '}
                (%)
              </Typography>
            ) : null}
          </div>
          <div className={classes.individualStatisticsBox}>
            <Typography variant="subtitle1" gutterBottom>
              Số đấu nối thực tế kỳ đầu: {numeral(waterStationStatistics.totalLastMonthClient).format('0,0.[00]')} (KH)
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Số đấu nối thực tế kỳ sau: {numeral(waterStationStatistics.totalClient).format('0,0.[00]')} (KH)
              <sup />
            </Typography>
            <hr />
            {waterStationStatistics.ratioClient ? (
              <Typography variant="subtitle1" gutterBottom>
                Phần trăm hoàn thành: {numeral(parseFloat(waterStationStatistics.ratioClient)).format('0,0.[00]')} (%)
              </Typography>
            ) : null}
          </div>
          <div className={classes.individualStatisticsBox}>
            <Typography variant="subtitle1" gutterBottom>
              Tổng số đầu nối có hoá đơn kỳ đầu:{' '}
              {numeral(waterStationStatistics.totalLastMonthWaterUsedClient).format('0,0.[00]')} (KH)
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Tổng số đầu nối có hoá đơn kỳ sau:{' '}
              {numeral(waterStationStatistics.totalWaterUsedClient).format('0,0.[00]')} (KH)
              <sup />
            </Typography>
            <hr />
            {waterStationStatistics.ratioWaterUsedClient ? (
              <Typography variant="subtitle1" gutterBottom>
                Phần trăm hoàn thành:{' '}
                {numeral(parseFloat(waterStationStatistics.ratioWaterUsedClient)).format('0,0.[00]')} (%)
              </Typography>
            ) : null}
          </div>
        </div>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.topCell}>STT</TableCell>
              <TableCell className={classes.topCell}>Trạm</TableCell>
              <TableCell className={classes.topCell}>Mã thôn / khu phố</TableCell>
              <TableCell className={classes.topCell}>Tên thôn / khu phố</TableCell>
              <TableCell className={classes.topCell} colSpan={3} style={{ textAlign: 'center' }}>
                Tiêu thụ
              </TableCell>
              <TableCell className={classes.topCell} colSpan={3} style={{ textAlign: 'center' }}>
                Số đầu nối thực tế
              </TableCell>
              <TableCell className={classes.topCell} colSpan={3} style={{ textAlign: 'center' }}>
                Tổng số đầu nối có hoá đơn
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell className={classes.borderedCell}>Kỳ đầu </TableCell>
              <TableCell>Kỳ sau</TableCell>
              <TableCell>(Kỳ sau / Kỳ đầu) %</TableCell>
              <TableCell className={classes.borderedCell}>Kỳ đầu </TableCell>
              <TableCell>Kỳ sau</TableCell>
              <TableCell>(Kỳ sau / Kỳ đầu) %</TableCell>
              <TableCell className={classes.borderedCell}>Kỳ đầu </TableCell>
              <TableCell>Kỳ sau</TableCell>
              <TableCell>(Kỳ sau / Kỳ đầu) %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </Paper>
    );
  }
}

ReportWaterStationResult.propTypes = {
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
  showNotification: PropTypes.func,
  translate: PropTypes.func,
};

export default withStyles(styles)(ReportWaterStationResult);
