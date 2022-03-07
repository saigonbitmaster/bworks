import React, { Component } from 'react';
import get from 'lodash/get';
import { List, Datagrid, TextField, NumberField, DateField, BooleanField, FunctionField } from 'ra-loopback3';
import PropTypes from 'prop-types';

class InvoiceDatalist extends Component {
  constructor(props) {
    super(props);
  }
  getTotalTax = record => {
    if (record.invoiceData) {
      return get(record.invoiceData, 'taxFee', 0) + get(record.invoiceData, 'sewageFee', 0);
    }
    return '';
  };
  render() {
    return (
      <List
        {...this.props}
        resource="clientmeternumbersaliashitories"
        filter={{ clientId: this.props.match.params.id, invoiceData: { neq: null }, $keepNull: true }}
        bulkActionButtons={false}
      >
        <Datagrid>
          <TextField source="invoiceData.client.name" label="resources.clients.fields.name" />
          <DateField source="fromDate" label="resources.clientmeternumbers.fields.fromDate" />
          <DateField source="toDate" label="resources.clientmeternumbers.fields.toDate" />
          <NumberField source="previousNumber" label="resources.clientmeternumbers.fields.previousNumber" />
          <NumberField source="currentNumber" label="resources.clientmeternumbers.fields.newMeterNumber" />
          <NumberField source="invoiceData.totalWaterUsed" label="resources.clientmeternumbers.fields.totalWaterUsed" />
          <NumberField source="invoiceData.waterFee" label="resources.clientmeternumbers.fields.waterFee" />
          <FunctionField label="resources.clientmeternumbers.fields.totalTax" render={this.getTotalTax} />
          <NumberField source="invoiceData.totalFee" label="resources.clientmeternumbers.fields.totalFee" />
          <BooleanField source="paymentStatus" label="resources.clientmeternumbers.fields.paymentStatus" />
        </Datagrid>
      </List>
    );
  }
}

InvoiceDatalist.propTypes = {
  translate: PropTypes.func,
};

export default InvoiceDatalist;
