import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import {
  List,
  TextField,
  Datagrid,
  NumberField,
  withDataProvider,
  showDialog,
  showNotification,
  PdfView,
  CUSTOM,
  translate,
  BooleanField,
  URL_ONLY,
  FunctionField,
} from 'ra-loopback3';
import queryString from 'query-string';
import { get } from 'lodash';
import InvoiceExportActions from './InvoiceExportActions';
import InvoiceExportFilters from './InvoiceExportFilters';
import InvoiceExportBulkActions from './InvoiceExportBulkActions';
import PrintInvoiceButton from './PrintInvoiceButton';

class InvoiceExportList extends Component {
  refFilter = React.createRef();
  currentFilter = {};

  getRefClientMeterNumber = async (dataProvider, record) => {
    let termInvoice = this.refFilter.current.props.values.termInvoice;
    if (!termInvoice) return {};
    let res = await dataProvider(CUSTOM, 'clientmeternumbers', {
      rawFilter: { where: { id: `${record.id}-${moment(termInvoice.gte).format('YYYY-MM')}` } },
    });
    return res && res.data && res.data[0] ? res.data[0] : {};
  };

  componentDidMount = () => {
    const {
      dataProvider,
      showNotification,
      translate,
      location: { search },
    } = this.props;
    // Check the query params for possible transaction notification
    const parsedQuerystring = queryString.parse(search);
    const transactionSignal = get(parsedQuerystring, 'transactionSignal');
    const service = get(parsedQuerystring, 'service');
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

    // Check if there is any active einvoice range
    dataProvider(CUSTOM, 'EinvoiceRanges', {
      fullUrl: true,
      method: 'GET',
      query: { filter: JSON.stringify({ where: { isActive: true } }) },
    }).then(({ data }) => {
      if (!data || data.length === 0) {
        showNotification('generic.messages.noActiveEinvoiceRangeAvailable', 'warning');
      }
    });
  };

  exportInvoices = (filterValues, selectedIds, saving) => {
    let fixFilter = this.fixFilter(filterValues);
    saving && saving(true);
    this.props
      .dataProvider(CUSTOM, 'clientmeternumbers', {
        method: 'GET',
        subUrl: 'exportInvoices',
        query: { filterValues: JSON.stringify(fixFilter), selectedIds: JSON.stringify(selectedIds) },
      })
      .then(res => {
        // console.log(res);
        if (res && res.data) {
          this.props
            .dataProvider(URL_ONLY, 'pdfgetters', { subUrl: 'getPdf', query: { filename: res.data } })
            .then(({ data }) => {
              this.props.showDialog(<PdfView name="generic.pages.invoice" url={data.url} />);
            });
        }
      })
      .finally(() => {
        saving && saving(false);
      });
  };

  fixFilter = filter => {
    if (filter.termInvoice) {
      return {
        ...filter,
        startMeterDate: { lt: filter.termInvoice.gte },
      };
    }
    return filter;
  };

  onFilterChange = filter => {
    this.currentFilter = filter;
  };

  getTermMonthFormat = () => moment(get(this.currentFilter, 'termInvoice.gte')).format('YYYY-MM');
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
    const { dataProvider, dispatch, translate, showDialog, showNotification, ...rest } = this.props;
    let currentMonth = moment().startOf('month');
    return (
      <List
        fixUrl={'clients/joinWithMeterNumber'}
        actions={
          <InvoiceExportActions
            exportInvoices={this.exportInvoices}
            showNotification={showNotification}
            dataProvider={dataProvider}
            translate={translate}
            history={this.props.history}
          />
        }
        refFilter={this.refFilter}
        filters={
          <InvoiceExportFilters
            handleDistrictChange={this.handleDistrictChange}
            handleWardChange={this.handleWardChange}
          />
        }
        filterDefaultValues={{ termInvoice: { gte: currentMonth.toDate() } }}
        {...rest}
        fixFilter={this.fixFilter}
        onFilterChange={this.onFilterChange}
        bulkActionButtons={<InvoiceExportBulkActions exportInvoices={this.exportInvoices} />}
        resource="clientaliasinvoiceexports"
        sort={{ field: 'code', order: 'ASC' }}
      >
        <Datagrid>
          <TextField source="code" label="resources.clientmeternumbers.fields.code" />
          <TextField source="name" label="resources.clientmeternumbers.fields.name" />
          <TextField
            source="formattedAddress"
            sortable={false}
            label="resources.clientmeternumbers.fields.formattedAddress"
          />
          <FunctionField
            source="status"
            label={'resources.clients.fields.status'}
            render={record => translate(`resources.clients.clientStatus.${record.status}`)}
          />
          <NumberField
            source="clientMeterNumber.totalWaterUsed"
            label="resources.clientmeternumbers.fields.totalWaterUsed"
          />
          <NumberField source="clientMeterNumber.totalFee" label="resources.clientmeternumbers.fields.totalFee" />
          <BooleanField
            source="clientMeterNumber.paymentStatus"
            label="resources.clientmeternumbers.fields.paymentStatus"
          />
          <FunctionField
            label="resources.clientmeternumbers.fields.eInvoiceCode"
            source="einvoice"
            sortable={false}
            allowEmpty
            render={record => {
              let canceled = null;
              let scrapped = null;
              if (record.einvoice) {
                if (record.einvoice.canceled) {
                  canceled = <span style={{ textDecoration: 'line-through' }}>{record.einvoice.eInvoiceNo}</span>;
                } else {
                  canceled = record.einvoice.eInvoiceNo;
                }
                if (record.einvoice.scrappedEinvoice) {
                  const scrappedEinvoiceNo = record.einvoice.scrappedEinvoice.map(i => (
                    <Fragment key={i}>
                      <span style={{ textDecoration: 'line-through' }}>{i}</span>
                      <br />
                    </Fragment>
                  ));
                  scrapped = <Fragment>{scrappedEinvoiceNo}</Fragment>;
                }
              }
              return (
                <Fragment>
                  {scrapped}
                  {canceled}
                </Fragment>
              );
            }}
          />
          <FunctionField
            source="einvoice"
            label={'generic.print'}
            render={record => <PrintInvoiceButton record={record} />}
          />
        </Datagrid>
      </List>
    );
  }
}

InvoiceExportList.propTypes = {
  dataProvider: PropTypes.func,
  dispatch: PropTypes.func,
  translate: PropTypes.func,
  history: PropTypes.any,
  showDialog: PropTypes.func,
  showNotification: PropTypes.func,
};

const enhance = compose(withDataProvider, translate, connect(null, { showDialog, showNotification }));
export default enhance(InvoiceExportList);
