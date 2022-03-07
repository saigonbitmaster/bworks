import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  translate,
  List,
  Datagrid,
  TextField,
  withDataProvider,
  NumberField,
  FunctionField,
  refreshView,
  CUSTOM,
} from 'ra-loopback3';
import moment from 'moment-timezone';
import { Grid, Paper } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import FilterTimeGeo from '../../../src/components/common/filter/FilterTimeGeo';
import format from '../../util/format';
import HeaderWithExportButton from '../../components/common/button/HeaderWithExportButton';

const styles = theme => {
  return {
    paper: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  };
};
class RevenuesLoss extends Component {
  refController = React.createRef();
  formRefFilter = React.createRef();
  state = {
    filter: {
      time: moment().toDate(),
    },
    sumInvoiceLoss: 0,
    sumWaterLoss: 0,
    sumRateLoss: 0,
  };
  componentDidMount() {
    let { filter } = this.state;
    // console.log('componentDidMount', filter);
    this.getTotal(filter);
  }

  getTotal = arg => {
    let filter = {};
    filter.where = Object.assign({}, arg);
    filter.where.flgTotal = true;
    // console.log('getTotal', filter);
    this.props
      .dataProvider(CUSTOM, 'clients/reportRevenueLoss', {
        query: { filter: JSON.stringify(filter) },
      })
      .then(res => {
        // console.log(res);
        if (res && res.data) {
          let { sumInvoiceLoss, sumWaterLoss, sumRateLoss } = res.data;
          this.setState({ sumInvoiceLoss, sumWaterLoss, sumRateLoss });
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
    const { translate, refreshView, classes, paper, dispatch, dataProvider, ...rest } = this.props;
    const { filter, sumInvoiceLoss, sumWaterLoss, sumRateLoss } = this.state;
    let keyNameGeoChild = 'province';
    if (filter.provinceId) {
      keyNameGeoChild = 'district';
    }
    if (filter.districtId) {
      keyNameGeoChild = 'ward';
    }
    if (filter.wardId) {
      keyNameGeoChild = 'ward';
    }
    let subTitle = [
      {
        id: 1,
        content: translate('resources.clients.report.sumTotalInvoiceWaterRevenueLoss', {
          val: format.number(sumInvoiceLoss),
        }),
      },
      {
        id: 2,
        content: translate('resources.clients.report.sumTotalWaterRevenueLoss', {
          val: format.number(sumWaterLoss),
        }),
      },
      {
        id: 3,
        content: translate('resources.clients.report.sumRateWaterRevenueLoss', {
          val: format.number(sumRateLoss, 3),
        }),
      },
    ];
    return (
      <Paper className={classes.paper}>
        <HeaderWithExportButton
          title="generic.report.titleReportRevenueLoss"
          apis={[{ model: 'Client', method: 'reportRevenueLoss' }]}
          formReference={this.refController}
          templateId={'RevenueLossReport'}
          permission={{ name: 'reportRevenueLossWater', action: 'exportRevenueLossAsPDF' }}
        />
        <Grid container>
          <Grid item xs={12} sm={12}>
            <Grid middle="true" container>
              <FilterTimeGeo getFilter={this.getFilter} formName="formFilterRevenueLoss" />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <List
              refController={this.refController}
              {...rest}
              resource="customreportrevenuelosses"
              fixUrl="clients/reportRevenueLoss"
              title={translate('resources.clients.report.revenueLoss')}
              filter={this.state.filter || {}}
              bulkActionButtons={false}
              subTitle={subTitle}
            >
              <Datagrid>
                <TextField
                  source={keyNameGeoChild}
                  label={translate(`resources.clients.fields.${keyNameGeoChild}Id`)}
                />
                <NumberField
                  source="totalInvoiceWaterRevenueLoss"
                  label={translate('resources.clients.report.invoiceWaterRevenueLoss')}
                />
                <NumberField
                  source="totalWaterRevenueLoss"
                  label={translate('resources.clients.report.waterRevenueLoss')}
                />
                <FunctionField
                  source="rateWaterRevenueLoss"
                  label={translate('resources.clients.report.rateWaterRevenueLoss')}
                  render={record => {
                    return format.number(record.rateWaterRevenueLoss, 3);
                  }}
                />
              </Datagrid>
            </List>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}
RevenuesLoss.propTypes = {
  translate: PropTypes.func,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
  refreshView: PropTypes.func,
};
const mapStateToProps = state => {
  return {
    report: state.admin.resources.customreportrevenuelosses,
  };
};
RevenuesLoss.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(
  withDataProvider,
  connect(mapStateToProps, { refreshView }),
  withTheme,
  withStyles(styles),
  translate,
);

export default enhance(RevenuesLoss);
