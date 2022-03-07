import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Datagrid,
  TextField,
  Filter,
  translate,
  ShowButton,
  TextInput,
  DateField,
  BooleanField,
  MonthInput,
} from 'ra-loopback3';
import compose from 'recompose/compose';

const EInvoiceDataFilter = props => (
  <Filter {...props}>
    <TextInput source="clientName" label={'generic.search'} alwaysOn />
    <MonthInput source="termInvoice" label={'generic.search'} date alwaysOn />
  </Filter>
);

class ListEInvoiceData extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List
        {...rest}
        resource="einvoicedata"
        sort={{ field: 'eInvoiceDate', order: 'DESC' }}
        filters={<EInvoiceDataFilter />}
        bulkActionButtons={false}
      >
        <Datagrid>
          <TextField source="clientName" />
          <DateField source="termInvoice" options={{ year: 'numeric', month: 'long' }} />
          <TextField source="eInvoiceNo" />
          <DateField source="eInvoiceDate" showTime />
          <TextField source="eInvoiceReservationCode" />
          {/* <BooleanField source="eInvoiceStatus" /> */}
          <ShowButton permission={{ name: 'EInvoiceData', action: 'view' }} />
        </Datagrid>
      </List>
    );
  }
}
ListEInvoiceData.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  dataProvider: PropTypes.func,
};

ListEInvoiceData.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: true,
};

const enhance = compose(translate);
export default enhance(ListEInvoiceData);
