import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  Create,
  translate,
  FlexForm,
  ReferenceInput,
  SelectInput,
  TextInput,
  NumberInput,
  DateInput,
  required,
} from 'ra-loopback3';
import moment from 'moment';

class PaymentCollectionCreate extends Component {
  formRef = React.createRef();
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Create undoable="false" {...rest} resource="paymentcollections" title={translate('resources.paymentcollection.create.title')} >
        <FlexForm redirect="list" >
          <TextInput source="name" label={translate('resources.paymentcollection.create.name')}/>
          <ReferenceInput label={translate('resources.paymentcollection.create.user')} source="userID" reference="appusers">
            <SelectInput optionText="username" />
          </ReferenceInput>
          <NumberInput label={translate('resources.paymentcollection.create.amount')} source="amount" />
          <DateInput validate={[required()]} source="paidOffDate" onBlur={e => e.preventDefault()} label={translate('resources.paymentcollection.create.paidOffDate')}/>
        </FlexForm>
      </Create>
    );
  }
}

PaymentCollectionCreate.propTypes = {
  translate: PropTypes.func,
};

const enhance = compose(translate);
export default enhance(PaymentCollectionCreate);
