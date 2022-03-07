import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withDataProvider } from 'ra-loopback3';
import compose from 'recompose/compose';
import InvoicePaymentSelectedButton from './InvoicePaymentSelectedButton';
// import InvoiceExportSelectedIds from './InvoiceExportSelectedIds';
import EinvoiceExportDecorator from './EinvoiceExportDecorator';
import ExportEinvoiceButton from './ExportEinvoiceButton';
import EinvoiceDownloadButton from './EinvoiceDownloadButton';
import CancelInvoiceButton from './CancelInvoiceButton';
class InvoiceExportBulkActions extends Component {
  render() {
    const { exportInvoices, dataProvider, ...rest } = this.props;
    return (
      <Fragment>
        {/* <InvoiceExportSelectedIds
          {...rest}
          exportInvoices={exportInvoices}
          permission={{ name: 'invoiceExport', action: 'printInvoice' }}
        /> */}
        <InvoicePaymentSelectedButton {...rest} permission={{ name: 'invoiceExport', action: 'payInvoice' }} />
        <EinvoiceDownloadButton
          permission={{ name: 'invoiceExport', action: 'exportEinvoice' }}
          dataProvider={dataProvider}
          filterValues={rest.filterValues}
          selectedIds={rest.selectedIds}
          data={rest.data}
          label={'generic.downloadEinvoice'}
        />
        
        <EinvoiceExportDecorator
          dataProvider={dataProvider}
          month={rest.filterValues.termInvoice.gte}
          filterValues={rest.filterValues}
          selectedIds={rest.selectedIds}
        >
          <ExportEinvoiceButton
            label="generic.exportSelectedEinvoice"
            filterValues={rest.filterValues}
            dataProvider={dataProvider}
            month={rest.filterValues.termInvoice.gte}
            selectedIds={rest.selectedIds}
            permission={{ name: 'invoiceExport', action: 'exportEinvoice' }}
          />
          
        </EinvoiceExportDecorator>
        <CancelInvoiceButton {...rest} permission={{ name: 'invoiceExport', action: 'payInvoice' }} />
      </Fragment>
    );
  }
}

InvoiceExportBulkActions.propTypes = {
  exportInvoices: PropTypes.any,
  dataProvider: PropTypes.func,
};

export default compose(withDataProvider)(InvoiceExportBulkActions);
