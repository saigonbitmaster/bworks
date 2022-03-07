import React, { Component, Fragment } from 'react';
import {
  Edit,
  FlexForm,
  TextInput,
  required,
  SelectInput,
  TagInput,
  EditorInput,
  NumberInput,
  minValue,
  maxValue,
  BooleanInput,
  withTranslate,
  FormDataConsumer,
  regex,
} from 'ra-loopback3';
import PropTypes from 'prop-types';

@withTranslate
export default class EditEInvoiceRange extends Component {
  static propTypes = {
    title: PropTypes.string,
    translate: PropTypes.func,
  };

  render() {
    const { title, translate, ...rest } = this.props;
    return (
      <Edit {...rest}>
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
          <FormDataConsumer >
            {({ formData, ...rest }) => {
              if (formData.provider === 'VIETTEL') {
                return (
                  <Fragment>
                  <TextInput  {...rest} style={{ marginRight: '8px' }} source="host" />
                  <TextInput
                   {...rest}
                   style={{ marginRight: '8px' }}
                    source="supplierTaxCode"
                    label={'resources.einvoiceranges.fields.supplierTaxCode'}
                    validate={[required(), regex(/^\S+$/, translate('generic.messages.noWhitespaces'))]}
                  />
                  </Fragment>
                );
              } else if (formData.provider === 'VNPT') {
                return (
                 <Fragment>
                      <TextInput {...rest} source="webServiceHost"  style={{ marginRight: '8px' }}/>
                      <TextInput {...rest} source="publishServiceHost" style={{ marginRight: '8px' }}/>
                      <TextInput {...rest} source="portalServiceHost"  style={{ marginRight: '8px' }}/>
                      <TextInput {...rest} source="businessServiceHost"  style={{ marginRight: '8px' }}/>
                    <TextInput 
                    {...rest}
                      source="webUsername"
                      label={'resources.einvoiceranges.fields.webUsername'}
                      validate={[required()]}
                      style={{ marginRight: '8px' }}
                    />
                    <TextInput
                     {...rest}
                      source="webPassword"
                      label={'resources.einvoiceranges.fields.webPassword'}
                      validate={[required()]}
                      type="password"
                      style={{ marginRight: '8px' }}
                    />
                    <TextInput
                     {...rest}
                      source="apiUsername"
                      label={'resources.einvoiceranges.fields.apiUsername'}
                      validate={[required()]}
                      style={{ marginRight: '8px' }}
                    />
                    <TextInput
                     {...rest}
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
          <NumberInput source="priority" defaultValue={5} validate={[minValue(1), maxValue(5)]} />
          <TagInput source="tag" />
          <EditorInput fullWidth source="description" />
        </FlexForm>
      </Edit>
    );
  }
}
