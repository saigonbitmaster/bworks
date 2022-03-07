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
import { formatClientStatus } from '../../../src/util/formatShow';
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

class ByGeo extends Component {
  refController = React.createRef();
  formRefFilter = React.createRef();
  state = {
    filter: {
      time: moment().toDate(),
    },
    totalDebt: 0,
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
      .dataProvider(CUSTOM, 'clients/reportDebtClientByGeo', {
        query: { filter: JSON.stringify(filter) },
      })
      .then(res => {
        // console.log(res);
        if (res && res.data) {
          let { totalDebt } = res.data;
          this.setState({ totalDebt });
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
    const { classes, refreshView, translate, dataProvider, ...rest } = this.props;
    const { filter, totalDebt } = this.state;
    let subTitle = [
      { id: 1, content: translate('resources.clients.report.sumTotalDebt', { val: format.number(totalDebt) }) },
    ];
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
    return (
      <Paper className={classes.paper}>
        <HeaderWithExportButton
          title="generic.report.titleReportDebtClientByGeo"
          apis={[{ model: 'Client', method: 'reportDebtClientByGeo' }]}
          formReference={this.refController}
          templateId={'DebtClientByGeoReport'}
          permission={{ name: 'reportDebtClient', action: 'exportDebtClientByGeoAsPDF' }}
        />
        <Grid container>
          <Grid item xs={12} sm={12}>
            <Grid middle="true" container>
              <FilterTimeGeo getFilter={this.getFilter} formName="formFilterDebtGeo" />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <List
              refController={this.refController}
              {...rest}
              resource="customreportdebtclientbygeos"
              fixUrl="clients/reportDebtClientByGeo"
              title={translate('generic.pages.geo')}
              filter={filter || {}}
              bulkActionButtons={false}
              subTitle={subTitle}
            >
              <Datagrid>
                <TextField source="code" label={translate('resources.clients.fields.code')} />
                <TextField source="name" label={translate('resources.clients.fields.name')} />
                <TextField source="formattedAddress" label={translate('resources.clients.fields.formattedAddress')} />
                <TextField
                  source={keyNameGeoChild}
                  label={translate(`resources.clients.fields.${keyNameGeoChild}Id`)}
                />
                <NumberField source="debt" label={translate('resources.clients.report.debt')} />
                <FunctionField
                  source="status"
                  label={translate('resources.clients.fields.status')}
                  render={record => {
                    return formatClientStatus(translate, record.status);
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
ByGeo.propTypes = {
  translate: PropTypes.func,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
  refreshView: PropTypes.func,
};
ByGeo.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const mapStateToProps = state => {
  return {
    report: state.admin.resources.customreportdebtclientbygeos,
  };
};
const enhance = compose(
  withDataProvider,
  connect(mapStateToProps, { refreshView }),
  withTheme,
  withStyles(styles),
  translate,
);

export default enhance(ByGeo);
