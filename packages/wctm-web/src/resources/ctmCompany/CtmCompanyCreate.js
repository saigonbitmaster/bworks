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
  EditorInput,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';

const validatePhone = regex(/\(?([0-9])\)?([ .-]?)([0-9])\2([0-9])/, 'Phải là số điện thoại');
const validateUrl = regex(/^https?:\/\/(.*)/, 'Phải là url');
const bankName = 'resources.ctmcompanies.fields.bankName';
const accountName = 'resources.ctmcompanies.fields.accountName';
const accountNo = 'resources.ctmcompanies.fields.accountNo';
const invoiceSignPerson = 'resources.ctmcompanies.fields.invoiceSignPerson';
const invoiceNoticeNo = 'resources.ctmcompanies.fields.invoiceNoticeNo';

class CtmCompanyCreate extends Component {
  render() {
    const { props } = this;
    return (
      <Create {...props} resource="ctmcompanies">
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
              <TextInput source="taxNo" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="phone" validate={validatePhone, required()} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="fax" validate={validatePhone} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="email" type="email" validate={[email(), required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="website" validate={validateUrl} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="contactPerson" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput label={invoiceSignPerson} source="invoiceSignPerson" validate={[required()]}/>
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <TextInput label={invoiceNoticeNo} source="invoiceNoticeNo" validate={[required()]}/>
            </Grid>
            <Grid middle item xs={12} sm={6}>
                  <TextInput label={accountName} source="accountName" validate={[required()]} />
                  </Grid>
                  <Grid middle item xs={12} sm={6}>
                  <TextInput label={accountNo} source="accountNo" validate={[required()]} />
                
            </Grid>
            <Grid middle item xs={12} sm={12}>
                  <TextInput fullWidth label={bankName} source="bankName" validate={[required()]} />
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

CtmCompanyCreate.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
};
CtmCompanyCreate.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(translate);
export default enhance(CtmCompanyCreate);
