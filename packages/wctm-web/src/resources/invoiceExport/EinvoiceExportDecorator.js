import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import get from 'lodash/get';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { formValueSelector } from 'redux-form';
import { CUSTOM, showDialog, PdfView, translate, showNotification, refreshView } from 'ra-loopback3';
import EInvoiceCreateConfirmDialog from './EInvoiceCreateConfirmDialog';

class EinvoiceExportDecorator extends Component {
  state = {
    dialogOpening: false,
    eInvoiceExporting: false,
  };

  lockButton = null;
  lockButtonRef = React.createRef();

  pollBackgroundJob = lockingFunction => () => {
    const { invoiceIssuedDate, showNotification, translate } = this.props;
    lockingFunction(moment(invoiceIssuedDate).toDate())
      .then(res => {
        const jobId = get(res, 'data.jobId', null);
        const status = get(res, 'data.status', null);
        const error = get(res, 'data.error', null);
        if (status === 'FINISH') {
          if (error) {
            if (typeof error === 'string') {
              showNotification(translate(error), 'warning');
            } else if (Array.isArray(error)) {
              for (let errorMessage of error) {
                showNotification(translate(errorMessage), 'warning');
              }
            }
          }
          clearInterval(this.state.isPolling);
          this.setState({ eInvoiceExporting: false });
          this.props.refreshView();
        } else if (status === 'NEW') {
          if (jobId) {
            showNotification('generic.messages.createEinvoiceInProgress', 'info');
            return res;
          }
        }
      })
      .catch(() => {
        clearInterval(this.state.isPolling);
        this.setState({ eInvoiceExporting: false });
        this.props.refreshView();
      });
  };

  setExportingEinvoice = lockingFunction => {
    this.setState({ eInvoiceExporting: true }, () => {
      this.pollBackgroundJob(lockingFunction)();
      const isPolling = setInterval(this.pollBackgroundJob(lockingFunction), 5000);
      this.setState({ isPolling });
    });
  };

  componentDidUpdate = async prevProps => {
    if (prevProps.month.toString() !== this.props.month.toString()) {
      const latestEinvoice = await this.updateSelectedMonth();
      this.setState({ latestEinvoice });
    }
  };

  componentDidMount = async () => {
    // Get currently active einvoice range
    const { dataProvider } = this.props;
    const fetchedActiveEinvoice = await dataProvider(CUSTOM, 'EinvoiceRanges', {
      fullUrl: true,
      method: 'GET',
      query: { filter: JSON.stringify({ where: { isActive: true } }) },
    });
    const einvoiceService = get(fetchedActiveEinvoice, 'data[0].provider');
    const latestEinvoice = await this.updateSelectedMonth();

    this.setState({ einvoiceService, latestEinvoice });
  };

  componentWillUnmount = () => {
    if (this.state.isPolling) {
      clearInterval(this.state.isPolling);
    }
  };

  updateSelectedMonth = async () => {
    const { dataProvider, month } = this.props;
    const { data: fetchedLatestEinvoice } = await dataProvider(CUSTOM, 'EInvoiceData', {
      subUrl: 'getLatestEinvoice',
      method: 'GET',
      query: { month },
    });
    const latestEinvoice = fetchedLatestEinvoice ? get(fetchedLatestEinvoice, '$data') : fetchedLatestEinvoice;
    return latestEinvoice;
  };

  toggleOpeningEInvoiceCreateConfirmDialog = () => this.setState({ dialogOpening: !this.state.dialogOpening });

  renderEInvoicePreview = selectedIds => {
    // Call API to get URLs of invoice drafts
    // Display by EInvoicePreview components
    const { dataProvider, showDialog, children, filterValues, invoiceIssuedDate } = this.props;
    dataProvider(CUSTOM, 'EInvoiceData', {
      subUrl: 'getEInvoiceDraftPreview',
      fullUrl: true,
      method: 'POST',
      body: { filter: filterValues, selectedIds, invoiceIssuedDate },
    })
      .then(({ data }) => {
        data &&
          showDialog(
            <PdfView
              customRightButtons={React.createElement(
                children.type,
                {
                  ...children.props,
                  dataProvider,
                  selectedIds,
                  color: 'inherit',
                  onClick: () => {
                    showDialog(null);
                    this.setState({ dialogOpening: false, eInvoiceExporting: true });
                    this.lockButton
                      .handleClick(invoiceIssuedDate)
                      .finally(() => this.setState({ eInvoiceExporting: false }));
                  },
                  ref: button => {
                    this.lockButton = button;
                  },
                },
                null,
              )}
              url={`data:application/pdf;base64,${data}`}
            />,
          );
      })
      .finally(() => this.setState({ dialogOpening: false }));
  };

  render() {
    const { dialogOpening, eInvoiceExporting, latestEinvoice, einvoiceService } = this.state;
    const { month, selectedIds, quarterId, translate, children } = this.props;
    let endOfMonth = moment(month).endOf('month');
    if (endOfMonth.isAfter(moment())) {
      endOfMonth = moment();
    }
    const monthDiff = endOfMonth.diff(moment(latestEinvoice), 'months', true);
    return (
      (!latestEinvoice || Math.abs(monthDiff) <= 5) && ( // Math.abs(monthDiff) <= 5 review later
        <Fragment>
          {React.createElement(children.type, {
            ...children.props,
            onClick: this.toggleOpeningEInvoiceCreateConfirmDialog,
            saving: eInvoiceExporting,
          })}
          {
            <EInvoiceCreateConfirmDialog
              selectedIds={selectedIds}
              handleCloseDialog={this.toggleOpeningEInvoiceCreateConfirmDialog}
              renderEInvoicePreview={this.renderEInvoicePreview}
              dialogOpeningStatus={dialogOpening}
              lockButton={children}
              lockButtonRef={this.lockButtonRef}
              setExportingEinvoice={this.setExportingEinvoice}
              translate={translate}
              latestEinvoice={latestEinvoice}
              quarterId={quarterId}
              einvoiceService={einvoiceService}
            />
          }
        </Fragment>
      )
    );
  }
}

EinvoiceExportDecorator.propTypes = {
  dataProvider: PropTypes.func,
  lockInvoices: PropTypes.func,
  filterValues: PropTypes.object,
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  showDialog: PropTypes.func,
  children: PropTypes.any,
  translate: PropTypes.func,
  refreshView: PropTypes.func,
  showNotification: PropTypes.func,
  month: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  invoiceIssuedDate: PropTypes.instanceOf(Date),
  quarterId: PropTypes.string,
};

export default compose(
  translate,
  connect(
    state => ({
      invoiceIssuedDate: formValueSelector('invoiceIssuedDateForm')(state, 'invoiceIssuedDate'),
    }),
    { showDialog, refreshView, showNotification },
  ),
)(EinvoiceExportDecorator);
