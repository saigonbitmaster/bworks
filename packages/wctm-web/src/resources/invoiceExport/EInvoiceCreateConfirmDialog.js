import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { reduxForm, change, blur } from 'redux-form';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import moment from 'moment-timezone';
import { WarningSharp as Warning } from '@material-ui/icons';
import { DateTimeInput } from 'ra-loopback3';

class EInvoiceCreateConfirmDialog extends Component {
  state = {
    inputContainsInvalidDate: false,
    maxDate: moment(),
    selectedTime: moment(),
  };

  generateErrorText = maxTime => {
    const { minDate } = this.state;
    return `Lớn hơn hoặc bằng ${minDate.format('DD/MM/YYYY HH:mm')} và nhỏ hơn hoặc bằng ${moment(maxTime).format(
      'DD/MM/YYYY HH:mm',
    )}`;
  };

  componentDidMount = () => {
    if (this.props.latestEinvoice) {
      const minDate = moment(this.props.latestEinvoice || new Date());
      this.setState({ minDate });
    }

    const { dispatch, change } = this.props;
    dispatch(change('invoiceIssuedDate', new Date()));
  };

  componentDidUpdate = prevProps => {
    if (!isEqual(prevProps.latestEinvoice, this.props.latestEinvoice)) {
      const minDate = moment(this.props.latestEinvoice || new Date());
      this.setState({ minDate });
    }
  };

  checkValidDate = date => {
    const { minDate } = this.state;
    const secondsTrimmedDate = moment(date)
      .seconds(0)
      .milliseconds(0);
    const secondsTrimmedMinDate = moment(minDate)
      .seconds(0)
      .milliseconds(0);
    const maxTime = moment()
      .seconds(0)
      .milliseconds(0);

    const selectedTime = moment(date);
    const changedState = {};
    let inputContainsInvalidDate = false;
    if (
      secondsTrimmedDate.valueOf() < secondsTrimmedMinDate.valueOf() ||
      secondsTrimmedDate.valueOf() > maxTime.valueOf()
    ) {
      inputContainsInvalidDate = true;
      changedState.maxTime = maxTime;
    }
    changedState.inputContainsInvalidDate = inputContainsInvalidDate;
    changedState.selectedTime = selectedTime;
    this.setState(changedState);
  };

  render() {
    const {
      dialogOpeningStatus,
      handleCloseDialog,
      renderEInvoicePreview,
      selectedIds,
      lockButton,
      lockButtonRef,
      setExportingEinvoice,
      translate,
      quarterId,
      einvoiceService,
      latestEinvoice,
    } = this.props;
    const { minDate, maxDate, maxTime, selectedTime, inputContainsInvalidDate } = this.state;

    return (
      <Dialog open={dialogOpeningStatus} onClose={handleCloseDialog}>
        <DialogTitle>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Warning style={{ color: 'red', marginRight: '10px' }} fontSize="large" />
            <div style={{ color: 'red' }}>
              {selectedIds && selectedIds.length > 0
                ? translate('notification.einvoiceexport.createNewEinvoiceForSelected')
                : translate('notification.einvoiceexport.createNewEinvoiceForAll')}
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <DateTimeInput
            style={latestEinvoice ? { width: '45%', marginRight: '10px' } : { width: '100%' }}
            label={translate('notification.einvoiceexport.invoiceIssuedDate')}
            source="invoiceIssuedDate"
            helperText={inputContainsInvalidDate && maxTime ? this.generateErrorText(maxTime) : ''}
            error={inputContainsInvalidDate && maxTime}
            onChange={this.checkValidDate}
            onBlur={e => e.preventDefault()}
            defaultValue
            inputProps={
              latestEinvoice
                ? {
                    value: selectedTime,
                    minDate,
                    maxDate,
                  }
                : { value: selectedTime, maxDate }
            }
          />
          {latestEinvoice && (
            <DateTimeInput
              style={{ width: '50%' }}
              label={translate('notification.einvoiceexport.latestEinvoice')}
              disabled
              inputProps={{ value: minDate }}
            />
          )}
        </DialogContent>
        <div>
          {['VIETTEL'].includes(einvoiceService) &&
            React.createElement(lockButton.type, {
              ...lockButton.props,
              onClick: () => {
                renderEInvoicePreview(selectedIds);
              },
              fullWidth: true,
              disabled: inputContainsInvalidDate,
              label: translate('notification.einvoiceexport.einvoiceExportWithPreview'),
              permission: { name: 'invoiceExport', action: 'previewInvoice' },
            })}
        </div>
        <div style={{ marginTop: '5px' }}>
          {React.createElement(lockButton.type, {
            ...lockButton.props,
            quarterId,
            selectedIds,
            onClick: () => {
              handleCloseDialog(dialogOpeningStatus);
              setExportingEinvoice(lockButtonRef.current.handleClick);
            },
            disabled: inputContainsInvalidDate,
            fullWidth: true,
            ref: lockButtonRef,
            label: translate('notification.einvoiceexport.einvoiceExportWithoutPreview'),
          })}
        </div>
      </Dialog>
    );
  }
}

EInvoiceCreateConfirmDialog.propTypes = {
  dialogOpeningStatus: PropTypes.bool,
  handleCloseDialog: PropTypes.func,
  renderEInvoicePreview: PropTypes.func,
  filterValues: PropTypes.object,
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  lockButton: PropTypes.any,
  setExportingEinvoice: PropTypes.func,
  translate: PropTypes.func,
  lockButtonRef: PropTypes.any,
  latestEinvoice: PropTypes.string,
  quarterId: PropTypes.string,
  dispatch: PropTypes.func,
  change: PropTypes.func,
  blur: PropTypes.func,
  einvoiceService: PropTypes.string,
};

export default connect(null, { change, blur })(
  reduxForm({
    form: 'invoiceIssuedDateForm',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    updateUnregisteredFields: true,
  })(EInvoiceCreateConfirmDialog),
);
