import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  withTranslate,
  Button,
  required,
  SimpleForm,
  TextInput,
  SelectInput,
  CUSTOM,
  fetchStart,
  fetchEnd,
  refreshView,
  withDataProvider,
} from 'ra-loopback3';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button as MuiButton,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { submit, reset } from 'redux-form';
import config from '../../Config';
import format from '../../util/format';

class PayButton extends Component {
  state = {
    dialogIsOpened: false,
  };

  toggleDialog = () => this.setState({ dialogIsOpened: !this.state.dialogIsOpened });

  handleSaveClick = paymentFormName => {
    const { submit } = this.props;
    submit(paymentFormName);
  };

  handleSubmit = values => {
    const {
      fetchStart,
      fetchEnd,
      dataProvider,
      record: { cmnId },
    } = this.props;
    fetchStart();
    if (cmnId) {
      dataProvider(CUSTOM, 'ClientMeterNumbers', {
        method: 'POST',
        subUrl: 'payInvoice',
        fullUrl: true,
        body: { ...values, id: cmnId, originalUrl: window.location.href },
      })
        .then(({ data: qrPaymentUrl }) => {
          window.location.href = qrPaymentUrl;
        })
        .finally(() => fetchEnd());
    }
  };

  getDefaultOrderInfo = () => {
    const { translate, record } = this.props;
    return translate('resources.einvoicedata.modal.orderInfoValue', { code: record.clientCode, time: record.time });
  };

  resetPaymentForm = formName => {
    const { reset } = this.props;
    reset(formName);
  };

  render() {
    const { record, translate } = this.props;
    const { dialogIsOpened } = this.state;
    let disabled = true;
    if (record && record.invoiceNo && !record.paymentStatus && record.totalWaterUsage > 0) {
      disabled = false;
    }

    const paymentFormName = `payment-form-${record.time}`;

    return (
      <Fragment>
        <Button disabled={disabled} onClick={this.toggleDialog} label="Thanh toán" />
        <Dialog
          open={dialogIsOpened}
          onClose={this.toggleDialog}
          aria-labelledby="form-dialog-title"
          disableEnforceFocus
        >
          <DialogTitle id="form-dialog-title">{translate('resources.einvoicedata.modal.title')}</DialogTitle>
          <DialogContent>
            <SimpleForm form={paymentFormName} toolbar={null} onSubmit={this.handleSubmit}>
              <TextField
                disabled
                label={translate('resources.einvoicedata.modal.amount')}
                defaultValue={format.number(record.totalInvoice)}
                InputProps={{ endAdornment: <InputAdornment position="end">VNĐ</InputAdornment> }}
              />
              <TextInput
                multiline
                defaultValue={this.getDefaultOrderInfo()}
                validate={[required()]}
                rows={2}
                rowsMax={4}
                source="orderInfo"
                label="resources.einvoicedata.modal.orderInfo"
              />
              <SelectInput
                source="service"
                validate={[required()]}
                label="resources.einvoicedata.modal.provider"
                choices={config.eInvoice.paymentProviderChoices}
              />
            </SimpleForm>
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={() => this.handleSaveClick(paymentFormName)} color="primary">
              {translate('resources.einvoicedata.modal.pay')}
            </MuiButton>
            <MuiButton onClick={this.toggleDialog} color="primary">
              {translate('resources.einvoicedata.modal.cancel')}
            </MuiButton>
            <MuiButton onClick={() => this.resetPaymentForm(paymentFormName)} color="primary">
              {translate('resources.einvoicedata.modal.reset')}
            </MuiButton>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

PayButton.propTypes = {
  dataProvider: PropTypes.any,
  fetchEnd: PropTypes.any,
  fetchStart: PropTypes.any,
  record: PropTypes.object,
  reset: PropTypes.any,
  submit: PropTypes.any,
  translate: PropTypes.any,
};

export default compose(
  withDataProvider,
  withTranslate,
  connect(null, { refreshView, submit, fetchStart, fetchEnd, reset }),
)(PayButton);
