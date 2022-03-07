import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  translate,
  FlexFormFilter,
  List,
  Datagrid,
  TextField,
  withDataProvider,
  MonthInput,
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
class ByProvider extends Component {
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
      .dataProvider(CUSTOM, 'clients/reportDebtClientByProvider', {
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
  onChangeFilter = filter => {
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
    return (
      <Paper className={classes.paper}>
        <HeaderWithExportButton
          title="generic.report.titleReportDebtClientByProvider"
          apis={[{ model: 'Client', method: 'reportDebtClientByProvider' }]}
          formReference={this.refController}
          templateId="DebtClientByProviderReport"
          permission={{ name: 'reportDebtClient', action: 'exportDebtClientByProviderAsPDF' }}
        />
        <Grid container>
          <Grid item xs={12} sm={12}>
            <FlexFormFilter
              onChange={this.onChangeFilter}
              formName="formFilterDebtProvider"
              formRef={this.formRefFilter}
              defaultValue={{ time: moment().toDate() }}
            >
              <Grid middle container>
                <Grid middle item xs={12}>
                  <MonthInput
                    date
                    source={'time'}
                    label={this.props.translate('generic.typeTime.month')}
                    style={{ marginLeft: '10px', width: '130px' }}
                  />
                </Grid>
              </Grid>
            </FlexFormFilter>
          </Grid>
          <Grid item xs={12} sm={12}>
            <List
              refController={this.refController}
              {...rest}
              resource="customreportdebtclientbyproviders"
              fixUrl="clients/reportDebtClientByProvider"
              title={translate('generic.provider')}
              filter={filter || {}}
              bulkActionButtons={false}
              subTitle={subTitle}
              sub
            >
              <Datagrid>
                <TextField source="code" label={translate('resources.clients.fields.code')} />
                <TextField source="name" label={translate('resources.clients.fields.name')} />
                <TextField source="formattedAddress" label={translate('resources.clients.fields.formattedAddress')} />
                <TextField source="provider" label={translate('generic.provider')} />
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
ByProvider.propTypes = {
  translate: PropTypes.func,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
  refreshView: PropTypes.func,
};
ByProvider.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const mapStateToProps = state => {
  return {
    report: state.admin.resources.customreportdebtclientbyproviders,
  };
};
const enhance = compose(
  withDataProvider,
  connect(mapStateToProps, { refreshView }),
  withTheme,
  withStyles(styles),
  translate,
);

export default enhance(ByProvider);
