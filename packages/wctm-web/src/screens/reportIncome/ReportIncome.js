import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  CustomPage,
  FlexFormFilter,
  List,
  Datagrid,
  TextField,
  translate,
  NumberField,
  MonthInput,
  SelectInput,
  FunctionField,
  withDataProvider,
  refreshView,
  CUSTOM,
} from 'ra-loopback3';
import Typography from '@material-ui/core/Typography';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Paper, Grid } from '@material-ui/core';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import FilterTimeGeo from '../../../src/components/common/filter/FilterTimeGeo';
import { formatClientType } from '../../../src/util/formatShow';
import format from '../../util/format';
import HeaderWithExportButton from '../../components/common/button/HeaderWithExportButton';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  chartTitle: {
    marginLeft: theme.spacing(2),
  },
});

const choices = [
  { id: 'geo', name: 'generic.pages.geo' },
  { id: 'provider', name: 'generic.provider' },
  { id: 'clientType', name: 'resources.clients.fields.clientType' },
];

class ReportIncome extends Component {
  refController = React.createRef();
  formRef = React.createRef();
  state = {
    filter: {
      incomeBy: 'geo',
      time: moment().toDate(),
    },
    sumTotalInvoice: 0,
    sumTotalWaterUsage: 0,
    data: [],
  };

  // componentDidMount() {
  //   let { filter } = this.state;
  //   // console.log('componentDidMount', filter);
  //   this.getTotal(filter);
  // }

  getTotal = arg => {
    const { dataProvider, refreshView } = this.props;
    const filter = { where: Object.assign({ flgTotal: true }, arg) };

    Promise.all([
      dataProvider(CUSTOM, 'Clients/reportIncome', {
        query: { filter: JSON.stringify(filter) },
      }),
      dataProvider(CUSTOM, 'Clients/reportIncome', { query: { filter: JSON.stringify({ where: arg }) } }),
    ]).then(([resSum, resData]) => {
      if (resSum && resSum.data) {
        let { sumTotalInvoice, sumTotalWaterUsage } = resSum.data;
        this.setState({ sumTotalInvoice, sumTotalWaterUsage });
      }

      if (resData && resData.data) {
        this.setState({ data: resData.data });
      }

      this.setState({ filter: arg });

      refreshView();
    });
  };

  // eslint-disable-next-line
  onChangeIncomeBy = () => {
    this.formRef.current.props.change('time', moment().toDate());
  };

  getFilter = val => {
    let tmp = Object.assign({}, val);
    tmp.incomeBy = this.state.filter.incomeBy;
    // this.setState({ filter: tmp });
    // let refController = this.refController;
    // refController.current.updateFilter();
    this.getTotal(tmp);
  };

  onChangeFilter = filter => {
    // this.setState({ filter });
    // let refController = this.refController;
    // refController.current.updateFilter();
    this.getTotal(filter);
  };

  renderFilter = incomeBy => {
    if (incomeBy === 'geo') {
      return <FilterTimeGeo getFilter={this.getFilter} formName="formFilterIncomeGeo" />;
    } else if (incomeBy === 'provider' || incomeBy === 'clientType') {
      return (
        <MonthInput
          date
          source={'time'}
          label={this.props.translate('generic.typeTime.month')}
          style={{ marginLeft: '10px', width: '130px' }}
        />
      );
    }
  };

  render() {
    const { classes, dataProvider, refreshView, translate, theme, ...rest } = this.props;
    const { filter, sumTotalInvoice, sumTotalWaterUsage, data } = this.state;
    let subTitle, source, label, title;

    switch (filter.incomeBy) {
      case 'geo': {
        title = translate('generic.pages.geo');
        source = 'district';
        if (filter.districtId) {
          source = 'ward';
        }
        if (filter.wardId) {
          source = 'ward';
        }
        label = translate(`resources.clients.fields.${source}Id`);
        break;
      }
      case 'provider': {
        source = 'provider';
        label = translate('generic.provider');
        title = translate('generic.provider');
        break;
      }
      case 'clientType': {
        source = 'clientType';
        label = translate('resources.clients.fields.clientType');
        title = translate('resources.clients.fields.clientType');
        break;
      }
    }

    subTitle = [
      {
        id: 1,
        content: translate('resources.clients.report.sumTotalWaterUsage', {
          val: format.number(sumTotalWaterUsage),
        }),
      },
      {
        id: 2,
        content: translate('resources.clients.report.sumTotalInvoice', { val: format.number(sumTotalInvoice) }),
      },
    ];

    return (
      <CustomPage title={'generic.pages.reportIncome'} header={false}>
        <Grid container spacing={2 * 2}>
          <Grid item xs={12} sm={12}>
            <Paper className={classes.paper}>
              <HeaderWithExportButton
                title="generic.report.titleReportIncome"
                apis={[{ model: 'Client', method: 'reportIncome' }]}
                formReference={this.refController}
                templateId={'IncomeReport'}
                permission={{ name: 'reportIncome', action: 'exportPDF' }}
              />
              <Grid container>
                <Grid item xs={12} sm={12}>
                  <FlexFormFilter
                    formName="formFilterIncomeProviderType"
                    onChange={this.onChangeFilter}
                    formRef={this.formRef}
                    defaultValue={{ time: moment().toDate(), incomeBy: 'geo' }}
                  >
                    <Grid middle container>
                      <SelectInput
                        source="incomeBy"
                        choices={choices}
                        onChange={this.onChangeIncomeBy}
                        label={translate('resources.clients.report.by')}
                      />
                      {this.renderFilter(filter.incomeBy)}
                    </Grid>
                  </FlexFormFilter>
                </Grid>
                <Grid item xs={12} sm={12} style={{ maxWidth: '50%' }}>
                  <Typography variant="h6" gutterBottom className={classes.chartTitle}>
                    {translate('resources.clients.report.totalWaterUsage')}
                  </Typography>
                  <BarChart width={600} height={300} data={data} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    {filter.incomeBy === 'clientType' ? (
                      <XAxis dataKey={source} tickFormatter={tick => formatClientType(translate, tick)} />
                    ) : (
                      <XAxis dataKey={source} />
                    )}
                    <YAxis tickFormatter={value => format.number(value)} />
                    <Tooltip
                      formatter={value => [format.number(value), translate('resources.clients.report.totalWaterUsage')]}
                      labelFormatter={value =>
                        filter.incomeBy === 'clientType' ? formatClientType(translate, value) : value
                      }
                    />
                    <Bar dataKey={'totalWaterUsage'} fill="#8884d8" />
                  </BarChart>
                </Grid>
                <Grid item xs={12} sm={12} style={{ maxWidth: '50%' }}>
                  <Typography variant="h6" gutterBottom className={classes.chartTitle}>
                    {translate('resources.clients.report.totalInvoice')}
                  </Typography>
                  <BarChart width={600} height={300} data={data} margin={{ top: 10, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    {filter.incomeBy === 'clientType' ? (
                      <XAxis dataKey={source} tickFormatter={tick => formatClientType(translate, tick)} />
                    ) : (
                      <XAxis dataKey={source} />
                    )}
                    <YAxis tickFormatter={value => format.number(value)} />
                    <Tooltip
                      formatter={value => [format.number(value), translate('resources.clients.report.totalInvoice')]}
                      labelFormatter={value =>
                        filter.incomeBy === 'clientType' ? formatClientType(translate, value) : value
                      }
                    />
                    <Bar dataKey={'totalInvoice'} fill="#82ca9d" />
                  </BarChart>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <List
                    {...rest}
                    refController={this.refController}
                    resource="customreportincomes"
                    fixUrl="clients/reportIncome"
                    title={title}
                    filter={filter || {}}
                    bulkActionButtons={false}
                    subTitle={subTitle}
                  >
                    <Datagrid>
                      {filter.incomeBy === 'geo' && <TextField source={source} label={label} />}
                      {filter.incomeBy === 'provider' && <TextField source={source} label={label} />}
                      {filter.incomeBy === 'clientType' && (
                        <FunctionField
                          source={source}
                          label={label}
                          render={record => {
                            return formatClientType(translate, record.clientType);
                          }}
                        />
                      )}
                      <NumberField
                        source="totalWaterUsage"
                        label={translate('resources.clients.report.totalWaterUsage')}
                        sortable={false}
                      />
                      <NumberField
                        source="totalInvoice"
                        label={translate('resources.clients.report.totalInvoice')}
                        sortable={false}
                      />
                    </Datagrid>
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </CustomPage>
    );
  }
}
ReportIncome.propTypes = {
  theme: PropTypes.object,
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
  refreshView: PropTypes.func,
  classes: PropTypes.object,
};
ReportIncome.defaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const mapStateToProps = state => {
  return {
    report: state.admin.resources.customreportincomes,
  };
};
const enhance = compose(
  withDataProvider,
  connect(mapStateToProps, { refreshView }),
  withTheme,
  translate,
  withStyles(styles),
);

export default enhance(ReportIncome);
