import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  refreshView,
  withDataProvider,
  CUSTOM,
  showNotification,
  Button,
  fetchStart,
  fetchEnd,
  translate,
} from 'ra-loopback3';
import { submit } from 'redux-form';
import moment from 'moment-timezone';
import { InvoicePaymentIcon } from '../../styles/Icons';

@withDataProvider
@translate
@connect(null, { refreshView, showNotification, submit, fetchStart, fetchEnd })
class InvoicePaymentSelectedButton extends Component {
  state = { saving: false, disabled: true };
  static propTypes = {
    label: PropTypes.string,
    selectedIds: PropTypes.array,
    filterValues: PropTypes.object,
    dataProvider: PropTypes.func,
    refreshView: PropTypes.func,
    showNotification: PropTypes.func,
    basePath: PropTypes.string,
    data: PropTypes.object,
    submit: PropTypes.func,
    fetchStart: PropTypes.func,
    translate: PropTypes.func,
    fetchEnd: PropTypes.func,
  };

  checkPayableIds = () => {
    const { data, selectedIds } = this.props;
    const okIds = [];
    // Check if selected records did use water and have einvoice (or invoice)
    for (let id of selectedIds) {
      if (
        data[id] &&
        data[id].clientMeterNumber.totalWaterUsed > 0 &&
        data[id].einvoice &&
        !data[id].clientMeterNumber.paymentStatus
      ) {
        okIds.push(true);
      }
    }
    const disabled = okIds.length !== selectedIds.length;
    return disabled;
  };

  componentDidMount() {
    const disabled = this.checkPayableIds();
    this.setState({ disabled });
  }

  componentDidUpdate = prevProps => {
    if (prevProps.selectedIds !== this.props.selectedIds) {
      const disabled = this.checkPayableIds();
      this.setState({ disabled });
    }
  };

  handleClick = () => {
    const { fetchStart, fetchEnd, dataProvider, selectedIds, filterValues, refreshView } = this.props;
    const disabled = this.checkPayableIds();
    const termMonth = moment(filterValues.termInvoice.gte).format('YYYY-MM');
    const fixIds = selectedIds.map(id => `${id}-${termMonth}`);
    if (!disabled) {
      fetchStart();
      dataProvider(CUSTOM, 'ClientMeterNumbers', {
        method: 'POST',
        subUrl: 'payInvoiceByAdmin',
        fullUrl: true,
        body: { ids: fixIds },
      })
        .then(({ data: { paysError, paysSuccess } }) => {
          if (paysError.length > 0) {
            for (const { error } of paysError) {
              showNotification(error, 'warning');
            }
          } else {
            showNotification('ra.notification.updated', 'info', { messageArgs: { smart_count: paysSuccess.length } });
          }
        })
        .finally(() => {
          fetchEnd();
          refreshView();
        });
    }
  };

  render() {
    const { basePath, filterValues, selectedIds, refreshView, showNotification, translate, ...rest } = this.props;
    const { disabled } = this.state;
    return (
      <Button saving={this.state.saving} disabled={disabled} onClick={this.handleClick} label="generic.pay" {...rest}>
        <InvoicePaymentIcon />
      </Button>
    );
  }
}

InvoicePaymentSelectedButton.defaultProps = {
  label: 'generic.pay',
};

export default InvoicePaymentSelectedButton;
