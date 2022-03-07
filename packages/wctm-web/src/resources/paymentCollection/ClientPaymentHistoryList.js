import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  translate,
  NumberField,
  DateField,
  FunctionField,
} from 'ra-loopback3';
import get from 'lodash/get';
import { connect } from 'react-redux';
import moment from 'moment';
import queryString from 'query-string';


class ClientPaymentHistoryList extends Component {
 
  render() {
    const { translate, id, ...rest } = this.props;
   // let filter = {updaterId: id, paymentStatus: true, toDate: {between: [startDay, endDay]}}
   let {startDay, endDay} = queryString.parse(this.props.location.search);
   let filter = {updaterId: id, paymentStatus: true, toDate: { between: [startDay, endDay] }};
    return (
      <List
        {...rest}
        resource="clientmeternumbers"
        bulkActionButtons={false}
        filterDefaultValues={filter}
        hasCreate={false}
        title={translate('resources.paymentcollection.clientPaymentHistoryList.title')}
      >
        <Datagrid>
          <ReferenceField
            reference="appusers"
            source="updaterId"
            linkType={false}
            label={translate('resources.paymentcollection.clientPaymentHistoryList.updaterId')} 
          >
             
            <TextField source="username" />
            </ReferenceField>
            <ReferenceField
            reference="clients"
            source="clientId"
            linkType={false}
            label={translate('resources.paymentcollection.clientPaymentHistoryList.client')} 
          >
 <TextField source="name" />

          </ReferenceField>
            <FunctionField label={translate('resources.paymentcollection.clientPaymentHistoryList.invoiceMonth')}  render={record => moment(record.toDate).format("MM/YYYY")}/>
            <NumberField label={translate('resources.paymentcollection.clientPaymentHistoryList.totalWaterUsed')} source="invoiceData.totalWaterUsed" />
            <NumberField label={translate('resources.paymentcollection.clientPaymentHistoryList.totalFee')} source="invoiceData.totalFee" />
            <DateField label={translate('resources.paymentcollection.clientPaymentHistoryList.updatedDate')}  source="toDate" />
         
        </Datagrid>
      </List>
    );
  }
}
ClientPaymentHistoryList.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  id: PropTypes.string,
  startDay: PropTypes.string,
  endDay: PropTypes.string
};
ClientPaymentHistoryList.detaultProps = {
  hasList: true,
};

const enhance = compose(translate);
export default enhance(ClientPaymentHistoryList);
