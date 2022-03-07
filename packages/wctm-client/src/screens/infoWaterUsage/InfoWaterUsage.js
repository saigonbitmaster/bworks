import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Datagrid,
  TextField,
  FunctionField,
  translate,
  Header,
  CUSTOM,
  withDataProvider,
  YearInput,
  FlexFormFilter,
  List,
  showNotification,
} from 'ra-loopback3';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Paper, Grid } from '@material-ui/core';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ComposedChart, ResponsiveContainer } from 'recharts';
import get from 'lodash/get';
import queryString from 'query-string';
import PayButton from './PayButton';
import format from '../../util/format';

const styles = {
  unPaid: { color: 'red' },
  paid: { color: 'blue' },
};

const CustomFunctionField = withStyles(styles)(
  ({ classes, translate, hasList, hasShow, hasEdit, hasCreate, dataProvider, ...props }) => {
    if (!props.record || props.record.paymentStatus === undefined) {
      return <FunctionField render={() => translate('generic.infoWaterUsage.errorData')} {...props} />;
    } else {
      let className = props.record.paymentStatus === true ? classes.paid : classes.unPaid;
      return (
        <FunctionField
          className={className}
          render={record =>
            record.paymentStatus === true
              ? translate('generic.infoWaterUsage.paid')
              : translate('generic.infoWaterUsage.unPaid')
          }
          {...props}
        />
      );
    }
  },
);
class InfoWaterUsage extends Component {
  refController = React.createRef();
  formRef = React.createRef();
  state = {
    filter: {
      time: moment().format('YYYY'),
    },
  };

  componentDidMount = () => {
    const { showNotification, translate } = this.props;
    // Check the query params for possible transaction notification
    const parsedQuerystring = queryString.parse(location.search);
    const transactionSignal = get(parsedQuerystring, 'transactionSignal');
    const service = get(parsedQuerystring, 'service');
    if (service) {
      switch (service) {
        case 'vnpay': {
          if (transactionSignal) {
            if (transactionSignal === '00') {
              showNotification(translate(`resources.einvoicedata.responseCode.vnpay.${transactionSignal}`), 'info');
            } else {
              let translatedFailedMessage = translate(`resources.einvoicedata.responseCode.vnpay.${transactionSignal}`);
              if (translatedFailedMessage === `resources.einvoicedata.responseCode.vnpay.${transactionSignal}`) {
                translatedFailedMessage = translate(`resources.einvoicedata.responseCode.vnpay.failed`);
              }
              showNotification(translatedFailedMessage, 'warning');
            }
          }
          break;
        }
        case 'momo': {
          const transactionMessage = get(parsedQuerystring, 'message');
          if (transactionSignal && transactionMessage) {
            if (transactionSignal === '0') {
              showNotification(translate(`resources.einvoicedata.responseCode.momo.${transactionSignal}`), 'info');
            } else {
              if (
                transactionSignal === '2129' ||
                transactionSignal === '99' ||
                Number.isNaN(parseInt(transactionSignal, 10))
              ) {
                showNotification(translate(`resources.einvoicedata.responseCode.momo.${transactionSignal}`), 'warning');
              } else {
                showNotification(transactionMessage, 'warning');
              }
            }
            break;
          }
        }
      }
      window.history.pushState({}, '', window.location.origin + window.location.pathname);
    }
  };

  UNSAFE_componentWillMount() {
    this.getData(this.state.filter);
  }

  onChangeFilter = filter => {
    if (this.refController.current){
    this.setState({ filter });
    this.getData(filter);
    let refController = this.refController;
    refController.current.updateFilter();}
  };

  getData = filter => {
    let tmp = {};
    tmp.where = filter;
    this.props
      .dataProvider(CUSTOM, 'clients/getInfoWaterUsage', {
        query: { filter: JSON.stringify(tmp) },
      })
      .then(res => {
        if (res && res.data && res.data.length) {
          this.setState({ dataCollect: res.data });
        }
      });
  };
  formatInvoice = val => {
    return format.number(val) + ' ' + this.props.translate('generic.units.vnd');
  };
  formatWater = val => {
    return format.number(val) + ' ' + this.props.translate('generic.units.meter3');
  };
  render() {
    const { dataProvider, translate, theme, classes, ...rest } = this.props;
    const { filter, dataCollect } = this.state;
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <Paper>
            <Header title={translate('generic.infoWaterUsage.titleChart')} />
            <Grid container>
              <Grid item xs={12} sm={12}>
                <FlexFormFilter
                  formName={'filterFormInfoWaterUsage'}
                  onChange={this.onChangeFilter}
                  formRef={this.formRef}
                  defaultValue={{
                    time: moment().format('YYYY'),
                  }}
                >
                  <YearInput
                    source={'time'}
                    label={this.props.translate('generic.typeTime.year')}
                    style={{ width: 50, marginLeft: '0px' }}
                  />
                </FlexFormFilter>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ResponsiveContainer width="100%" aspect={2}>
                  <ComposedChart data={dataCollect} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis
                      dataKey="time"
                      label={{
                        value: translate('generic.infoWaterUsage.timeInvoice'),
                        position: 'insideBottomRight',
                        fontSize: '0.8em',
                        offset: 0,
                      }}
                      tick={{ fontSize: '0.8em' }}
                    />
                    <YAxis
                      padding={{ top: 10 }}
                      label={{ value: translate('generic.units.meter3'), position: 'top', fontSize: '0.8em' }}
                      tick={{ fontSize: '0.8em' }}
                      tickFormatter={value => format.number(value)}
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip labelStyle={{ fontSize: '0.8em' }} itemStyle={{ fontSize: '0.8em' }} />
                    <Legend wrapperStyle={{ fontSize: '0.8em' }} />
                    <Bar
                      dataKey="totalWaterUsage"
                      stackId="a"
                      fill={'#4dbd74'}
                      name={translate('generic.infoWaterUsage.totalWaterUsage')}
                      formatter={this.formatWater}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ResponsiveContainer width="100%" aspect={2}>
                  <ComposedChart data={dataCollect} margin={{ top: 20, right: 10, left: 20, bottom: 5 }}>
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis
                      dataKey="time"
                      label={{
                        value: translate('generic.infoWaterUsage.timeInvoice'),
                        position: 'insideBottomRight',
                        fontSize: '0.8em',
                        offset: 0,
                      }}
                      tick={{ fontSize: '0.8em' }}
                    />
                    <YAxis
                      padding={{ top: 10 }}
                      label={{ value: translate('generic.units.vnd'), position: 'top', fontSize: '0.8em' }}
                      tick={{ fontSize: '0.8em' }}
                      tickFormatter={value => format.number(value)}
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip labelStyle={{ fontSize: '0.8em' }} itemStyle={{ fontSize: '0.8em' }} />
                    <Legend wrapperStyle={{ fontSize: '0.8em' }} />
                    <Bar
                      dataKey="totalInvoice"
                      stackId="b"
                      fill={'#2962FF'}
                      name={translate('generic.infoWaterUsage.totalInvoice')}
                      formatter={this.formatInvoice}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Grid>
              <Grid item xs={12} sm={12}>
                <List
                  refController={this.refController}
                  {...rest}
                  className="subheader"
                  resource="custominfowaterusages"
                  fixUrl="clients/getInfoWaterUsage"
                  title={translate('generic.infoWaterUsage.titleList')}
                  filter={filter || {}}
                  bulkActions={false}
                  perPage={12}
                >
                  <Datagrid>
                    <TextField source="time" label={translate('generic.infoWaterUsage.timeInvoice')} sortable={false} />
                    <FunctionField
                      label={translate('generic.infoWaterUsage.previousNumber')}
                      render={record =>
                        record.previousNumber ? record.previousNumber : translate('generic.infoWaterUsage.errorData')
                      }
                    />
                    <FunctionField
                      label={translate('generic.infoWaterUsage.currentNumber')}
                      render={record =>
                        'currentNumber' in record ? record.currentNumber : translate('generic.infoWaterUsage.errorData')
                      }
                    />
                    <FunctionField
                      label={`${translate('generic.infoWaterUsage.totalWaterUsage')} (${translate(
                        'generic.units.meter3',
                      )})`}
                      render={record =>
                        'totalWaterUsage' in record
                          ? format.number(record.totalWaterUsage)
                          : translate('generic.infoWaterUsage.errorData')
                      }
                    />
                    <FunctionField
                      label={`${translate('generic.infoWaterUsage.totalInvoice')} (${translate('generic.units.vnd')})`}
                      render={record =>
                        'totalInvoice' in record
                          ? format.number(record.totalInvoice)
                          : translate('generic.infoWaterUsage.errorData')
                      }
                    />
                    <CustomFunctionField
                      source="paymentStatus"
                      label={translate('generic.infoWaterUsage.paymentStatus')}
                      {...this.props}
                    />
                    <TextField
                      source="invoiceNo"
                      label={translate('generic.infoWaterUsage.invoiceNo')}
                      sortable={false}
                    />
                    <PayButton />
                  </Datagrid>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}
InfoWaterUsage.propTypes = {
  theme: PropTypes.object,
  translate: PropTypes.func,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
  showNotification: PropTypes.func,
};

InfoWaterUsage.defaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const mapStateToProps = () => {
  return {};
};
const enhance = compose(
  withDataProvider,
  connect(mapStateToProps, { showNotification }),
  withTheme,
  withStyles(styles),
  translate,
);

export default enhance(InfoWaterUsage);
