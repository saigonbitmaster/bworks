import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { CardActions, showDialog } from 'ra-loopback3';
// import { Link } from 'react-router-dom';
// import { PrintIcon } from '../../styles/Icons';
import EinvoiceDownloadButton from './EinvoiceDownloadButton';
import ExportExcelButton from './ExportExcelButton';
import ExportEinvoiceButton from './ExportEinvoiceButton';
import EinvoiceExportDecorator from './EinvoiceExportDecorator';
import ImportDataButton from '../../components/common/button/ImportDataButton';
import ExportTemplateButton from '../../components/common/button/ExportTemplateButton';

class InvoiceExportActions extends Component {
  // state = { saving: false };
  // customAction = async (dataProvider, filterValues, selectedIds, history) => {
  //   // console.log(filterValues, selectedIds);
  //   history;
  //   let data = await dataProvider(CUSTOM, 'clientmeternumbers', {
  //     method: 'GET',
  //     subUrl: 'exportInvoices',
  //     query: { filterValues: JSON.stringify(filterValues), selectedIds: JSON.stringify(selectedIds) },
  //   });
  //   dataProvider(URL_ONLY, 'pdfgetters', { subUrl: 'getPdf', query: { filename: data.data } }).then(({ data }) => {
  //     this.props.showDialog(<PdfView name="generic.pages.invoice" url={data.url} />);
  //   });
  //   //this.props.showDialog(<PdfView url={`/api/PDFGetters/getPDF?filename=${data.data}`} />);
  // };

  // setSaving = saving => {
  //   this.setState({ saving });
  // };

  render() {
    const {
      basePath,
      // currentSort,
      displayedFilters,
      // exporter,
      filters,
      filterValues,
      bulkActionButtons,
      onUnselectItems,
      resource,
      selectedIds,
      showFilter,
      showNotification,
      // translate,
      // exportInvoices,
      // history,
      dataProvider,
    } = this.props;
    return (
      <CardActions>
        {bulkActionButtons &&
          cloneElement(bulkActionButtons, {
            basePath,
            filterValues,
            resource,
            selectedIds,
            onUnselectItems,
          })}
        {filters &&
          React.cloneElement(filters, {
            resource,
            showFilter,
            displayedFilters,
            filterValues,
            context: 'button',
          })}
        <ExportExcelButton filterValues={filterValues} permission={{ name: 'invoiceExport', action: 'exportExcel' }} />
        <span>|</span>
        {/* <Button
          permission={{ name: 'invoiceExport', action: 'printInvoice' }}
          label="generic.printInvoiceByGeo"
          component={Link}
          to={{ pathname: `printInvoiceByGeo` }}
        >
          <PrintIcon />
        </Button> */}
        <ImportDataButton
          showNotification={showNotification}
          acceptedFileExtensions={['.xlsx']}
          fileModelData={{ modelName: 'ExcelFiles', modelUrl: 'uploaded/upload' }}
          importModelData={{ modelName: 'EInvoiceData', modelUrl: 'bulkPay' }}
          isNotJob={true}
        />
        <ExportTemplateButton
          templateData={{
            fileModel: 'EInvoiceData',
            queryData: {
              subUrl: 'createBulkPaymentTemplate',
              fullUrl: true,
              query: {
                filter: JSON.stringify(filterValues),
              },
            },
          }}
        />
        <span>|</span>
        <EinvoiceDownloadButton
          dataProvider={dataProvider}
          filterValues={filterValues}
          permission={{ name: 'invoiceExport', action: 'exportEinvoice' }}
          label={'generic.downloadEinvoice'}
        />
        <EinvoiceExportDecorator
          dataProvider={dataProvider}
          month={filterValues.termInvoice.gte}
          filterValues={filterValues}
        >
          <ExportEinvoiceButton
            label="generic.exportAllEinvoice"
            dataProvider={dataProvider}
            filterValues={filterValues}
            month={filterValues.termInvoice.gte}
            permission={{ name: 'invoiceExport', action: 'exportEinvoice' }}
          />
        </EinvoiceExportDecorator>
      </CardActions>
    );
  }
}

InvoiceExportActions.propTypes = {
  basePath: PropTypes.any,
  currentSort: PropTypes.any,
  displayedFilters: PropTypes.any,
  exporter: PropTypes.any,
  filters: PropTypes.any,
  filterValues: PropTypes.any,
  onUnselectItems: PropTypes.any,
  resource: PropTypes.any,
  selectedIds: PropTypes.any,
  showFilter: PropTypes.any,
  dataProvider: PropTypes.any,
  translate: PropTypes.any,
  history: PropTypes.any,
  showDialog: PropTypes.func,
  bulkActionButtons: PropTypes.any,
  exportInvoices: PropTypes.func,
  showNotification: PropTypes.func,
};

const enhance = compose(connect(null, { showDialog }));
export default enhance(InvoiceExportActions);
