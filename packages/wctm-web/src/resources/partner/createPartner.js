import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Create,
  FlexForm,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
  TextInput,
  required,
  translate,
  LongTextInput,
  number,
  regex,
  email,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
  EditorInput,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import config from '../../Config';

const validatePhone = regex(/\(?([0-9])\)?([ .-]?)([0-9])\2([0-9])/, 'Phải là số điện thoại');
const validateUrl = regex(/^https?:\/\/(.*)/, 'Phải là url');
const bankName = 'resources.ctmcompanies.fields.bankName';
const bankBranch = 'resources.ctmcompanies.fields.bankBranch';
const accountName = 'resources.ctmcompanies.fields.accountName';
const accountNo = 'resources.ctmcompanies.fields.accountNo';

class CreatePartner extends Component {
  render() {
    const { props } = this;
    return (
      <Create {...props} resource="waterproviders">
        <FlexForm style={{ flexGrow: 1 }} spacing={2} redirect="list" submitOnEnter={false}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <LongTextInput fullWidth source="name" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6} />
            <Grid middle item xs={12} sm={6}>
              <TextInput fullWidth source="address" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <SelectInput
                source="providerType"
                validate={[required()]}
                choices={config.partnerType}
                translateChoice={true}
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="taxNo" validate={[required(), number()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="phone" validate={validatePhone} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="fax" validate={validatePhone} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="email" type="email" validate={[email()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="website" validate={validateUrl} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="contactPerson" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceArrayInput fullWidth source="dmaIds" reference="dmas">
                <SelectArrayInput optionText="name" />
              </ReferenceArrayInput>
            </Grid>
            <Grid middle item xs={12} sm={6} />
            <Grid middle item xs={12} sm={6}>
              <ArrayInput fullWidth source="bankAccountList">
                <SimpleFormIterator>
                  <TextInput fullWidth label={bankName} source="bankName" validate={[required()]} />
                  <TextInput fullWidth label={bankBranch} source="bankBranch" validate={[required()]} />
                  <TextInput fullWidth label={accountName} source="accountName" validate={[required()]} />
                  <NumberInput label={accountNo} source="acountNo" validate={[required(), number()]} />
                </SimpleFormIterator>
              </ArrayInput>
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <EditorInput fullWidth source="description" />
            </Grid>
          </Grid>
        </FlexForm>
      </Create>
    );
  }
}

CreatePartner.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
};
CreatePartner.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(translate);
export default enhance(CreatePartner);
