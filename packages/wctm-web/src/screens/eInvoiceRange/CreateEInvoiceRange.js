import React, { Component, Fragment } from 'react';
import {
  Create,
  FlexForm,
  TextInput,
  required,
  SelectInput,
  TagInput,
  EditorInput,
  NumberInput,
  minValue,
  maxValue,
  regex,
  BooleanInput,
  withTranslate,
  FormDataConsumer,
} from 'ra-loopback3';
import PropTypes from 'prop-types';

@withTranslate
export default class CreateEInvoiceRange extends Component {
  static propTypes = {
    title: PropTypes.string,
    translate: PropTypes.func,
  };

  render() {
    const { title, translate, ...rest } = this.props;
    return (
      <Create {...rest} redirect="list">
        <FlexForm>
          <TextInput source="name" validate={[required()]} autoFocus />
          
          <SelectInput
            source="provider"
            validate={[required()]}
            formClassName="form-item-inline-1"
            choices={[
              { id: 'VIETTEL', name: 'Viettel' },
              { id: 'VNPT', name: 'VNPT' },
            ]}
          />
          <FormDataConsumer formClassName="form-item-inline-2">
            {({ formData }) => {
              if (formData.provider === 'VIETTEL') {
                return (
                  <Fragment>
                  <TextInput source="host" />
                  <TextInput
                    source="supplierTaxCode"
                    label={'resources.einvoiceranges.fields.supplierTaxCode'}
                    validate={[required(), regex(/^\S+$/, translate('generic.messages.noWhitespaces'))]}
                  />
                  </Fragment>
                );
              } else if (formData.provider === 'VNPT') {
                return (
                  <Fragment>
                      <TextInput {...rest} source="webServiceHost"  />
                      <TextInput {...rest} source="publishServiceHost" />
                      <TextInput {...rest} source="portalServiceHost"  />
                      <TextInput {...rest} source="businessServiceHost"  />
                    <TextInput
                      source="webUsername"
                      label={'resources.einvoiceranges.fields.webUsername'}
                      validate={[required()]}
                      style={{ marginRight: '8px' }}
                    />
                    <TextInput
                      source="webPassword"
                      label={'resources.einvoiceranges.fields.webPassword'}
                      validate={[required()]}
                      type="password"
                      style={{ marginRight: '8px' }}
                    />
                    <TextInput
                      source="apiUsername"
                      label={'resources.einvoiceranges.fields.apiUsername'}
                      validate={[required()]}
                      style={{ marginRight: '8px' }}
                    />
                    <TextInput
                      source="apiPassword"
                      label={'resources.einvoiceranges.fields.apiPassword'}
                      validate={[required()]}
                      type="password"
                    />
                  </Fragment>
                );
              }
            }}
          </FormDataConsumer>
          <TextInput
            source="templateCode"
            validate={[required(), regex(/^\S+$/, translate('generic.messages.noWhitespaces'))]}
          />
          <TextInput
            source="serial"
            validate={[required(), regex(/^\S+$/, translate('generic.messages.noWhitespaces'))]}
          />
          <BooleanInput source="isActive" />
          <NumberInput source="priority" validate={[minValue(1), maxValue(5)]} />
          <TagInput source="tag" />
          <EditorInput fullWidth source="description" />
        </FlexForm>
      </Create>
    );
  }
}
