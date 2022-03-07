import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  Edit,
  translate,
  SimpleForm,
  ReferenceInput,
  SelectInput,
  TextInput,
  NumberInput,
  DateInput,
  required,
} from 'ra-loopback3';

class PaymentCollectionEdit extends Component {
  formRef = React.createRef();
  render() {
    const { translate, ...rest } = this.props;
   
    return (
      <Edit {...rest} resource="paymentcollections" title={translate('resources.paymentcollection.create.title')} >
        <SimpleForm  >
          <TextInput source="name" label={translate('resources.paymentcollection.create.name')}/>
          <ReferenceInput label={translate('resources.paymentcollection.create.user')} source="userID" reference="appusers">
            <SelectInput optionText="username" />
          </ReferenceInput>
          <NumberInput label={translate('resources.paymentcollection.create.amount')} source="amount" />
          <DateInput validate={[required()]} source="paidOffDate" onBlur={e => e.preventDefault()} label={translate('resources.paymentcollection.create.paidOffDate')}/>
        </SimpleForm>
      </Edit>
    );
  }
}

PaymentCollectionEdit.propTypes = {
  translate: PropTypes.func,
};

const enhance = compose(translate);
export default enhance(PaymentCollectionEdit);