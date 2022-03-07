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
  CUSTOM,
  refreshView,
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

class WaterLoss extends Component {
  refController = React.createRef();
  formRefFilter = React.createRef();
  state = {
    filter: {
      time: moment().toDate(),
    },
    sumLoss: 0,
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
    this.props
      .dataProvider(CUSTOM, 'clients/reportWaterLoss', {
        query: { filter: JSON.stringify(filter) },
      })
      .then(res => {
        // console.log(res);
        if (res && res.data) {
          let { sumLoss, sumRateLoss } = res.data;
          this.setState({ sumLoss, sumRateLoss });
          this.props.refreshView();
        }
      });
  };
  onChangeFilter = filter => {
    this.setState({ filter });
    if (this.refController.current) {
      let refController = this.refController;
      refController.current.updateFilter();
      this.getTotal(filter);
    }
  };
  render() {
    const { classes, refreshView, translate, paper, dispatch, dataProvider, ...rest } = this.props;
    const { filter, sumRateLoss, sumLoss } = this.state;
    let subTitle = [
      { id: 1, content: translate('resources.clients.report.sumWaterLoss', { val: format.number(sumLoss, 3) }) },
      {
        id: 2,
        content: translate('resources.clients.report.sumRateWaterLoss', { val: format.number(sumRateLoss, 3) }),
      },
    ];
    return (
      <Paper className={classes.paper}>
        <HeaderWithExportButton
          title="generic.report.titleReportWaterLoss"
          apis={[{ model: 'Client', method: 'reportWaterLoss' }]}
          formReference={this.refController}
          templateId={'WaterLossReport'}
          permission={{ name: 'reportRevenueLossWater', action: 'exportWaterLossAsPDF' }}
        />
        <Grid container>
          <Grid item xs={12} sm={12}>
            <FlexFormFilter
              formRef={this.formRefFilter}
              defaultValue={{ time: moment().toDate() }}
              onChange={this.onChangeFilter}
              formName="formFilterWaterLoss"
            >
              <Grid middle="true" container>
                <MonthInput
                  date
                  source={'time'}
                  label={this.props.translate('generic.typeTime.month')}
                  style={{ marginLeft: '10px', width: '130px' }}
                />
              </Grid>
            </FlexFormFilter>
          </Grid>
          <Grid item xs={12} sm={12}>
            <List
              refController={this.refController}
              {...rest}
              resource="customreportwaterlosses"
              fixUrl="clients/reportWaterLoss"
              title={translate('resources.clients.report.titleWaterLoss')}
              filter={filter || {}}
              bulkActionButtons={false}
              subTitle={subTitle}
            >
              <Datagrid>
                <TextField source="dma" label={'DMA'} />
                <NumberField source="totalSupply" label={translate('resources.clients.report.totalSupply')} />
                <NumberField source="totalWaterUsage" label={translate('resources.clients.report.totalWaterUsed')} />
                <NumberField source="totalLoss" label={translate('resources.clients.report.waterLoss')} />
                <FunctionField
                  source="rateLoss"
                  label={translate('resources.clients.report.rateWaterLoss')}
                  render={record => {
                    return format.number(record.rateLoss, 3);
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
WaterLoss.propTypes = {
  translate: PropTypes.func,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
  refreshView: PropTypes.func,
};
WaterLoss.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const mapStateToProps = state => {
  return {
    report: state.admin.resources.customreportwaterlosses,
  };
};
const enhance = compose(
  withDataProvider,
  connect(mapStateToProps, { refreshView }),
  withTheme,
  withStyles(styles),
  translate,
);

export default enhance(WaterLoss);
