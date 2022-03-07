import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate, List, Datagrid, TextField, withDataProvider, NumberField, refreshView, CUSTOM } from 'ra-loopback3';
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

class ByGeo extends Component {
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
      .dataProvider(CUSTOM, 'clients/reportQuantityClientByGeo', {
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
  getFilter = filter => {
    if (this.refController.current) {
      this.setState({ filter });
      let refController = this.refController;
      refController.current.updateFilter();
      this.getTotal(filter);
    }
  };
  render() {
    const { classes, translate, refreshView, dataProvider, ...rest } = this.props;
    const { filter, totalClient } = this.state;
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
      { id: 1, content: translate('resources.clients.report.sumTotalClient', { val: format.number(totalClient) }) },
    ];
    return (
      <Paper className={classes.paper}>
        <HeaderWithExportButton
          title="generic.report.titleReportQuantityClientByGeo"
          apis={[{ model: 'Client', method: 'reportQuantityClientByGeo' }]}
          formReference={this.refController}
          templateId="QuantityClientByGeoReport"
          permission={{ name: 'reportQuantityClient', action: 'exportQuantityClientByGeoAsPDF' }}
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
              resource="customreportquantityclientbygeos"
              fixUrl="clients/reportQuantityClientByGeo"
              title={translate('generic.pages.geo')}
              filter={filter || {}}
              bulkActionButtons={false}
              subTitle={subTitle}
            >
              <Datagrid>
                <TextField
                  source={keyNameGeoChild}
                  label={translate(`resources.clients.fields.${keyNameGeoChild}Id`)}
                />
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
    report: state.admin.resources.customreportquantityclientbygeos,
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
