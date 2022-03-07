import React, { Component } from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  SFEditButton,
  DateField,
  BooleanField,
  SFShowButton,
} from 'ra-loopback3';

export default class ListEInvoiceRange extends Component {
  render() {
    const { ...rest } = this.props;
    return (
      <List
        {...rest}
        permissionCreateDefault={{ name: 'EInvoiceRange', action: 'create' }}
        permissionDeleteDefault={{ name: 'EInvoiceRange', action: 'delete' }}
      >
        <Datagrid>
          <TextField source="name" />
          <TextField source="supplierTaxCode" />
          <TextField source="templateCode" />
          <TextField source="serial" />
          <TextField source="provider" />
          <NumberField source="numOfpublishInv" />
          <NumberField source="totalInv" />
          <BooleanField source="isActive" />
          <NumberField source="priority" />
          <DateField source="verifyAt" showTime />
          <SFShowButton permission={{ name: 'EInvoiceRange', action: 'examine' }} />
          <SFEditButton permission={{ name: 'EInvoiceRange', action: 'edit' }} />
        </Datagrid>
      </List>
    );
  }
}
