import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import get from 'lodash/get';
import moment from 'moment-timezone';
import {
  List,
  TextField,
  Datagrid,
  withDataProvider,
  FunctionField,
  translate,
  CUSTOM,
  refreshView,
  showNotification,
} from 'ra-loopback3';
import { connect } from 'react-redux';
import InvoiceLockActions from './InvoiceLockActions';
import InvoiceLockFilters from './InvoiceLockFilters';
import InvoiceLockSelectedButton from './InvoiceLockSelectedButton';

class InvoiceList extends Component {
  refFilter = React.createRef();
  currentFilter = {};
  state = {
    termMeterNumber: moment()
      .startOf('month')
      .toDate(),
  };
  formatStatusInvoice = record => {
    if (record.isNotUse) {
      return this.props.translate('generic.notUse');
    }
    let { termMeterNumber } = this.state;
    let { termInvoice, lastTimeMeterNumberUpdate, paymentStatus, status, currentNumber } = record;

    // kiem tra xem da co so nuoc hien tai?
    if (isNaN(parseInt(currentNumber))) {
      return this.props.translate('generic.cannot');
    }

    const termInvoiceObj = moment(termInvoice).startOf('month');

    // kiem tra da ghi nuoc?
    let distMonth1 = moment(lastTimeMeterNumberUpdate)
      .startOf('month')
      .diff(termMeterNumber, 'month');

    // kiem tra ki hoa don cuoi
    let distMonth2 = moment(termMeterNumber)
      .startOf('month')
      .diff(termInvoiceObj, 'month');

    // console.log('distMonth', distMonth1, distMonth2, termMeterNumber, record);
    if (
      status === 'ACTIVE' &&
      !paymentStatus &&
      termInvoiceObj &&
      distMonth1 >= 0 &&
      (distMonth2 === 0 || distMonth2 === 1)
    ) {
      return this.props.translate('generic.can');
    }
    return this.props.translate('generic.cannot');
  };

  formatStatus = record => {
    if (record.isLock) {
      return this.props.translate('generic.lockedInvoice');
    }
    return this.props.translate('generic.unLockedInvoice');
  };

  lockInvoices = async (filterValues, ids, saving, eInvoiceOptions) => {
    const { dataProvider, refreshView, showNotification } = this.props;
    saving && saving(true);
    return dataProvider(
      CUSTOM,
      'clientmeternumbers',
      {
        body: { month: filterValues.termMeterNumber, ids, filterValues: filterValues, eInvoiceOptions },
        method: 'POST',
        subUrl: 'calculateInvoices',
      },
      {},
      {
        notification: {
          body: 'ra.notification.http_error',
          level: 'warning',
        },
      },
    )
      .then(res => {
        const jobId = get(res, 'data.jobId', '');
        if (jobId) {
          showNotification('generic.messages.invoiceLockInprogress', 'info');
        }
        refreshView();
        return res;
      })
      .finally(() => {
        saving && saving(false);
      });
  };

  onFilterChange = filter => (this.currentFilter = filter);
  // getTermMonthFormat = () => moment(get(this.currentFilter, 'termMeterNumber')).format('YYYY-MM');
  getTermMonthFormat = () => moment(this.state.termMeterNumber).format('YYYY-MM');
  // fixFilter = filterValues => {
  //   console.log(filterValues);
  //   let tmp = [];
  //   if (filterValues.termMeterNumber) {
  //     tmp.push({ termMeterNumber: { gte: filterValues.termMeterNumber } });
  //   }
  //   if (filterValues.termInvoice) {
  //     tmp.push({ termMeterNumber: { gte: filterValues.termInvoice } });
  //   }
  //   return {
  //     ...filterValues,
  //     and: tmp,
  //     startMeterDate: { lt: filterValues.termMeterNumber },
  //   };
  // };
  fixFilter = filterValues => {
    // console.log(filterValues);

    let {
      invoiceLock,
      termMeterNumber: termMeterNumberRaw,
      invoiceNo,
      invoiceExportDate,
      canLockInvoice,
      ...rest
    } = filterValues;

    const termMeterNumber = moment(termMeterNumberRaw).toDate();
    const termInvoiceAllow = moment(termMeterNumberRaw)
      .subtract('1', 'month')
      .toDate();

    this.setState({ termMeterNumber });

    let tmp;

    if (canLockInvoice === 'can') {
      tmp = [
        { status: { eq: 'ACTIVE' } },
        { termInvoice: { gte: termInvoiceAllow } },
        { termInvoice: { lte: termMeterNumber } },
        { lastTimeMeterNumberUpdate: { gte: termMeterNumber } },
      ];
      return {
        ...rest,
        invoiceLock,
        canLockInvoice,
        termMeterNumber,
        and: tmp,
        startMeterDate: { lt: termMeterNumber },
      };
    } else if (canLockInvoice === 'cannot') {
      tmp = [
        { status: { neq: 'ACTIVE' } },
        { termInvoice: { lt: termInvoiceAllow } },
        { termInvoice: { gt: termMeterNumber } },
        { lastTimeMeterNumberUpdate: { lt: termMeterNumber } },
      ];
      return {
        ...rest,
        invoiceLock,
        canLockInvoice,
        termMeterNumber,
        or: tmp,
        startMeterDate: { lt: termMeterNumber },
      };
    } else {
      return {
        ...rest,
        invoiceLock,
        canLockInvoice,
        termMeterNumber,
        startMeterDate: { lt: termMeterNumber },
      };
    }
  };
  handleDistrictChange = filterValues => {
    if (filterValues.wardId || filterValues.quarterId) {
      this.refFilter.current.props.change('wardId', '');
      this.refFilter.current.props.change('quarterId', '');
    }
  };
  handleWardChange = filterValues => {
    if (filterValues.quarterId) {
      this.refFilter.current.props.change('quarterId', '');
    }
  };

  render() {
    const { dataProvider, dispatch, refreshView, translate, showNotification, ...rest } = this.props;
    return (
      <List
        refFilter={this.refFilter}
        actions={<InvoiceLockActions dataProvider={dataProvider} lockInvoices={this.lockInvoices} />}
        filters={
          <InvoiceLockFilters
            handleDistrictChange={this.handleDistrictChange}
            handleWardChange={this.handleWardChange}
          />
        }
        fixUrl={'clients/invoiceLockList'}
        tilter={{ status: 'ACTIVE' }}
        fixFilter={this.fixFilter}
        onFilterChange={this.onFilterChange}
        bulkActionButtons={<InvoiceLockSelectedButton lockInvoices={this.lockInvoices} />}
        filterDefaultValues={{
          termMeterNumber: moment()
            .startOf('month')
            .toDate(),
        }}
        {...rest}
        resource="clientaliasinvoicelocks"
        sort={{ field: 'code', order: 'ASC' }}
      >
        <Datagrid>
          <TextField source="code" label={'resources.clients.fields.code'} />
          <TextField source="name" label="resources.clients.fields.name" />
          <TextField source="formattedAddress" label="resources.clients.fields.formattedAddress" />
          <FunctionField
            source="lastTermInvoice"
            label="resources.clients.fields.lastTermInvoice"
            render={record => (record.termInvoice ? moment(record.termInvoice).format('MM/YYYY') : '')}
            sortable={false}
          />
          <FunctionField
            source="termMeterNumber"
            label="resources.clients.fields.lastTermMeterNumber"
            render={record => (record.termMeterNumber ? moment(record.termMeterNumber).format('MM/YYYY') : '')}
            sortable={false}
          />
          <TextField
            source="previousNumber"
            label="resources.clientmeternumbers.fields.previousNumber"
            sortable={false}
          />
          <FunctionField
            source="currentNumber"
            label="resources.clientmeternumbers.fields.currentNumber"
            render={record => {
              if (record.currentNumber === 'N/A') {
                return translate('resources.clientmeternumbers.unWriteWater');
              }
              return record.currentNumber;
            }}
            sortable={false}
          />
          <FunctionField source="invoiceLock" label="generic.status" render={this.formatStatus} sortable={false} />
          <FunctionField
            source="invoiceLock"
            label="generic.invoiceLock"
            render={this.formatStatusInvoice}
            sortable={false}
          />
        </Datagrid>
      </List>
    );
  }
}

InvoiceList.propTypes = {
  dataProvider: PropTypes.func,
  dispatch: PropTypes.func,
  translate: PropTypes.func,
  refreshView: PropTypes.func,
  showNotification: PropTypes.func,
};
// eslint-disable-next-line
const mapStateToProps = state => {
  return {};
};
const enhance = compose(withDataProvider, translate, connect(mapStateToProps, { refreshView, showNotification }));
export default enhance(InvoiceList);
