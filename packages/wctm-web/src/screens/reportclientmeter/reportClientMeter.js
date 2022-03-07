import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate, List, Datagrid, TextField, withDataProvider, NumberField, refreshView, CUSTOM } from 'ra-loopback3';
import moment from 'moment-timezone';
import { Grid, Paper } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
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

class ReportClientMeter extends Component {
  refController = React.createRef();
  formRefFilter = React.createRef();
  state = {
    filter: {
      time: moment().toDate(),
    },
    totalValid: 0, // trong thoi han
    totalNearExpired: 0, // sap het han
    totalExpired: 0, // qua thoi han
    totalAll: 0, // tong tat ca
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
      .dataProvider(CUSTOM, 'clients/reportClientMeter', {
        query: { filter: JSON.stringify(filter) },
      })
      .then(res => {
        // console.log(res);
        if (res && res.data) {
          let { totalAll, totalValid, totalNearExpired, totalExpired } = res.data;
          this.setState({ totalAll, totalValid, totalNearExpired, totalExpired });
          this.props.refreshView();
        }
      });
  };
  getFilter = filter => {
    if (this.refController.current) {
      this.setState({ filter });
      let refController = this.refController;
      refController.current.updateFilter();
      this.getTotal(filter);
    }
  };
  render() {
    const { refreshView, classes, translate, dataProvider, ...rest } = this.props;
    const { filter, totalAll, totalValid, totalNearExpired, totalExpired } = this.state;
    // console.log('this.props', this.props);
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
      { id: 1, content: translate('resources.clientmeters.report.sumTotalMeter', { val: totalAll }) },
      {
        id: 2,
        content: translate('resources.clientmeters.report.sumTotalValidMeter', { val: totalValid }),
      },
      {
        id: 3,
        content: translate('resources.clientmeters.report.sumTotalNearExpired', { val: totalNearExpired }),
      },
      {
        id: 4,
        content: translate('resources.clientmeters.report.sumTotalExpired', { val: totalExpired }),
      },
    ];
    return (
      <Paper className={classes.paper}>
        <HeaderWithExportButton
          title="generic.report.titleReportClientMeter"
          apis={[{ model: 'Client', method: 'reportClientMeter' }]}
          formReference={this.refController}
          templateId="ClientMeterReport"
          permission={{ name: 'reportClientMeter', action: 'exportPDF' }}
        />
        <Grid container>
          <Grid item xs={12} sm={12}>
            <Grid middle="true" container>
              <FilterTimeGeo getFilter={this.getFilter} formName="formFilterQuantityGeo" />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <List
              refController={this.refController}
              {...rest}
              resource="customreportclientmeters"
              fixUrl="clients/reportClientMeter"
              title={translate('generic.pages.geoMeter')}
              filter={filter || {}}
              bulkActionButtons={false}
              subTitle={subTitle}
            >
              <Datagrid>
                <TextField
                  source={keyNameGeoChild}
                  label={translate(`resources.clients.fields.${keyNameGeoChild}Id`)}
                />
                <NumberField source="valid" label={translate('resources.clientmeters.report.valid')} />
                <NumberField source="nearExpired" label={translate('resources.clientmeters.report.nearExpired')} />
                <NumberField source="expired" label={translate('resources.clientmeters.report.expired')} />
                <NumberField source="total" label={translate('resources.clientmeters.report.totalMeter')} />
              </Datagrid>
            </List>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}
ReportClientMeter.propTypes = {
  translate: PropTypes.func,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
  refreshView: PropTypes.func,
};
ReportClientMeter.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const mapStateToProps = state => {
  return {
    report: state.admin.resources.customreportclientmeters,
  };
};
const enhance = compose(
  withDataProvider,
  connect(mapStateToProps, { refreshView }),
  withTheme,
  withStyles(styles),
  translate,
);

export default enhance(ReportClientMeter);
