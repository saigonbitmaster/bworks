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
  refreshView,
  CUSTOM,
} from 'ra-loopback3';
import { Grid, Paper } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
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
    totalClient: 0,
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
      .dataProvider(CUSTOM, 'clients/reportQuantityClientByProvider', {
        query: { filter: JSON.stringify(filter) },
      })
      .then(res => {
        // console.log(res);
        if (res && res.data) {
          let { totalClient } = res.data;
          this.setState({ totalClient });
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
    const { classes, refreshView, translate, paper, dataProvider, ...rest } = this.props;
    const { filter, totalClient } = this.state;
    // console.log('this.props', totalClient);
    let subTitle = [
      { id: 1, content: translate('resources.clients.report.sumTotalClient', { val: format.number(totalClient) }) },
    ];
    return (
      <Paper className={classes.paper}>
        <HeaderWithExportButton
          title="generic.report.titleReportQuantityClientByProvider"
          apis={[{ model: 'Client', method: 'reportQuantityClientByProvider' }]}
          formReference={this.refController}
          templateId={'QuantityClientByProviderReport'}
          permission={{ name: 'reportQuantityClient', action: 'exportQuantityClientByProviderAsPDF' }}
        />
        <Grid container>
          <Grid item xs={12} sm={12}>
            <FlexFormFilter
              onChange={this.onChangeFilter}
              formName="formFilterQuantityProvider"
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
              resource="customreportquantityclientbyproviders"
              fixUrl="clients/reportQuantityClientByProvider"
              title={translate('generic.provider')}
              filter={filter || {}}
              bulkActionButtons={false}
              sub
              subTitle={subTitle}
            >
              <Datagrid>
                <TextField source="provider" label={translate('generic.provider')} />
                <NumberField source="activeClient" label={translate('resources.clients.report.activeClient')} />
                <NumberField source="pauseClient" label={translate('resources.clients.report.pauseClient')} />
                <NumberField source="stopClient" label={translate('resources.clients.report.stopClient')} />
                <NumberField source="totalClient" label={translate('resources.clients.report.totalClient')} />
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
    report: state.admin.resources.customreportquantityclientbyproviders,
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
