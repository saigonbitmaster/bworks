import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  CustomPage,
  List,
  Datagrid,
  TextField,
  translate,
  NumberField,
  CUSTOM,
  withDataProvider,
  refreshView,
} from 'ra-loopback3';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Paper, Grid } from '@material-ui/core';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import format from '../../util/format';
import FilterTimeGeo from '../../../src/components/common/filter/FilterTimeGeo';
import HeaderWithExportButton from '../../components/common/button/HeaderWithExportButton';

const styles = theme => {
  return {
    paper: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  };
};

class ReportRevenueLossClient extends Component {
  refController = React.createRef();
  formRefFilter = React.createRef();
  state = {
    filter: {
      time: moment().toDate(),
    },
    sumWaterRevenueLoss: 0, // tong luong nuoc that thu
    sumInvoiceWaterRevenueLoss: 0, // tong tien that thu
  };
  componentDidMount() {
    let { filter } = this.state;
    // console.log('componentDidMount', filter);
    this.getTotal(filter);
  }
  getTotal = filter => {
    this.props
      .dataProvider(CUSTOM, 'clients/totalReportRevenueLossClient', {
        query: { filter: JSON.stringify(filter) },
      })
      .then(res => {
        // console.log(res);
        if (res && res.data) {
          let { sumWaterRevenueLoss, sumInvoiceWaterRevenueLoss } = res.data;
          this.setState({ sumWaterRevenueLoss, sumInvoiceWaterRevenueLoss });
          this.props.refreshView();
        }
      });
  };

  getFilter = filter => {
    this.setState({ filter });
    if (this.refController.current) {
      let refController = this.refController;

      refController.current.updateFilter();
      this.getTotal(filter);
    }
  };

  render() {
    const { classes, refreshView, dataProvider, translate, theme, paper, ...rest } = this.props;
    let { filter, sumWaterRevenueLoss, sumInvoiceWaterRevenueLoss } = this.state;
    let subTitle = [
      {
        id: 1,
        content: translate('resources.clients.report.sumWaterRevenueLoss', {
          val: format.number(sumWaterRevenueLoss),
        }),
      },
      {
        id: 2,
        content: translate('resources.clients.report.sumInvoiceWaterRevenueLoss', {
          val: format.number(sumInvoiceWaterRevenueLoss),
        }),
      },
    ];
    return (
      <CustomPage title={'generic.pages.reportRevenueLossClient'} header={false}>
        <Grid container spacing={2 * 2}>
          <Grid item xs={12} sm={12}>
            <Paper className={classes.paper}>
              <HeaderWithExportButton
                title="generic.report.titleReportRevenueLossClient"
                apis={[
                  { model: 'Client', method: 'totalReportRevenueLossClient' },
                  { model: 'Client', method: 'reportRevenueLossClient' },
                ]}
                formReference={this.refController}
                templateId={'ClientLossReport'}
                permission={{ name: 'reportRevenueLossClient', action: 'exportPDF' }}
              />
              <Grid container>
                <Grid item xs={12} sm={12}>
                  <FilterTimeGeo getFilter={this.getFilter} formName={'formFilterRevenueLossClient'} />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <List
                    refController={this.refController}
                    {...rest}
                    resource="customreportrevenueslossclients"
                    fixUrl="clients/reportRevenueLossClient"
                    title={translate('resources.clients.report.revenueLoss')}
                    filter={filter || {}}
                    bulkActionButtons={false}
                    subTitle={subTitle}
                  >
                    <Datagrid>
                      <TextField source="code" label={translate('resources.clients.fields.code')} />
                      <TextField source="name" label={translate('resources.clients.fields.name')} />
                      <TextField
                        source="formattedAddress"
                        label={translate('resources.clients.fields.formattedAddress')}
                      />
                      <NumberField
                        source="totalWaterRevenueLoss"
                        label={translate('resources.clients.report.waterRevenueLoss')}
                      />
                      <NumberField
                        source="totalInvoiceWaterRevenueLoss"
                        label={translate('resources.clients.report.invoiceWaterRevenueLoss')}
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
ReportRevenueLossClient.propTypes = {
  theme: PropTypes.object,
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
  refreshView: PropTypes.func,
};
ReportRevenueLossClient.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const mapStateToProps = state => {
  return {
    report: state.admin.resources.customreportrevenueslossclients,
  };
};
const enhance = compose(
  withDataProvider,
  connect(mapStateToProps, { refreshView }),
  withTheme,
  translate,
  withStyles(styles),
);

export default enhance(ReportRevenueLossClient);
