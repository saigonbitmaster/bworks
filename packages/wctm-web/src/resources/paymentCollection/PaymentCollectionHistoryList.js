import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  List,
  Datagrid,
  TextField,
  DeleteButton,
  ReferenceField,
  translate,
  SFEditButton,
  NumberField,
  DateField,
} from 'ra-loopback3';
import { connect } from 'react-redux';
import queryString from 'query-string';

class PaymentCollectionHistoryList extends Component {
  render() {
    const { translate, id, ...rest } = this.props;
    let {startDay, endDay} = queryString.parse(this.props.location.search);
    let filter = {userID: id, paidOffDate: { between: [startDay, endDay] }}
   
    return (
      <List
        {...rest}
        resource="paymentcollections"
        filterDefaultValues={filter}
        hasCreate={false}
        hasDelete={true}
        hasEdit
        backButton={true}
        title={translate('resources.paymentcollection.paymentCollectionHistory.title')}
      >
        <Datagrid>
          <TextField source="name" label={translate('resources.paymentcollection.paymentCollectionHistory.name')} />
          <ReferenceField
            label={translate('resources.paymentcollection.paymentCollectionHistory.userID')}
            reference="appusers"
            source="userID"
            linkType={false}
          >
            <TextField source="username" />
          </ReferenceField>
          <NumberField
            source="amount"
            label={translate('resources.paymentcollection.paymentCollectionHistory.amount')}
          />
          <DateField
            source="paidOffDate"
            label={translate('resources.paymentcollection.paymentCollectionHistory.paidOffDate')}
          />
          <SFEditButton basePath={'/paymentcollection'} />
          <DeleteButton />
        </Datagrid>
      </List>
    );
  }
}
PaymentCollectionHistoryList.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  id: PropTypes.string,
  startDay: PropTypes.string,
  endDay: PropTypes.string,
};
PaymentCollectionHistoryList.detaultProps = {
  hasList: true,
};
const enhance = compose(translate);
export default enhance(PaymentCollectionHistoryList);