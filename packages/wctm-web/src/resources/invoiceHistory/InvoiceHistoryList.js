import React, { Component } from 'react';
import { List, Datagrid, TextField, DateField, translate } from 'ra-loopback3';
import InvoiceHistoryButton from './InvoiceDataButton';
import ClientFilter from '../../screens/client/ClientFilter';

@translate
class InvoiceHistoryList extends Component {
  refFilter = React.createRef();
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
    const { translate, ...props } = this.props;
    return (
      <List
        refFilter={this.refFilter}
        bulkActionButtons={false}
        {...props}
        filters={
          <ClientFilter handleDistrictChange={this.handleDistrictChange} handleWardChange={this.handleWardChange} />
        }
        sort={{ field: 'code', order: 'ASC' }}
      >
        <Datagrid>
          <TextField source="code" label="resources.clients.fields.code" />
          <TextField source="name" label="resources.clients.fields.name" />
          <TextField source="formattedAddress" label="resources.clients.fields.formattedAddress" />
          {/* <TextField source="phoneNumber" label="resources.clients.fields.phoneNumber" /> */}
          <DateField
            source="termMeterNumber"
            options={{ year: 'numeric', month: 'numeric' }}
            label="resources.clients.fields.termMeterNumber"
          />
          <DateField source="lastTimeMeterNumberUpdate" label="resources.clients.fields.lastTimeMeterNumberUpdate" />
          <TextField source="lastMeterNumber" label="resources.clients.fields.lastMeterNumber" />
          <InvoiceHistoryButton
            label="generic.history"
            permission={{ name: 'invoiceHistory', action: 'historyInvoice' }}
          />
        </Datagrid>
      </List>
    );
  }
}

export default InvoiceHistoryList;
