import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlexForm,
  Edit,
  TextInput,
  required,
  translate,
  MaterialSelectInput,
  EditorInput,
  minLength,
  maxLength,
  FormDataConsumer,
  NumberInput,
  minValue,
  SelectInput,
  CUSTOM,
  withDataProvider,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';

class EditMatType extends Component {
  save = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    // console.log(record);
    this.props.dataProvider(
      CUSTOM,
      'materialdetailtypes',
      {
        method: 'PUT',
        subUrl: `customEdit/${record.id}`,
        body: { data: record },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };
  render() {
    const { translate, dataProvider, ...rest } = this.props;
    return (
      <Edit {...rest} resource="materialdetailtypes" save={this.save}>
        <FlexForm style={{ flexGrow: 1 }} spacing={2}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <MaterialSelectInput source={'type'} validate={[required()]} disabled={true} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required(), minLength(3), maxLength(32)]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <FormDataConsumer>
                {({ formData }) => {
                  switch (formData.type) {
                    case 'Pipe':
                      return (
                        <NumberInput
                          source="meta.diameter"
                          label={translate('generic.metaExtend.diameter')}
                          validate={[required(), minValue(0)]}
                        />
                      );
                    case 'FlowLogger': {
                      let choices = [
                        { id: '2G', name: 'generic.optionCommunication._2g' },
                        { id: '3G', name: 'generic.optionCommunication._3g' },
                        { id: '4G', name: 'generic.optionCommunication._4g' },
                        { id: 'Other', name: 'generic.optionCommunication.other' },
                      ];
                      return (
                        <SelectInput
                          source="meta.communication"
                          label={translate('generic.metaExtend.communication')}
                          choices={choices}
                          validate={[required()]}
                        />
                      );
                    }
                    case 'QualityLogger': {
                      let choices = [
                        { id: '2G', name: 'generic.optionCommunication._2g' },
                        { id: '3G', name: 'generic.optionCommunication._3g' },
                        { id: '4G', name: 'generic.optionCommunication._4g' },
                        { id: 'Other', name: 'generic.optionCommunication.other' },
                      ];
                      return (
                        <SelectInput
                          source="meta.communication"
                          label={translate('generic.metaExtend.communication')}
                          choices={choices}
                          validate={[required()]}
                        />
                      );
                    }
                    case 'Meter':
                      return (
                        <NumberInput
                          source="meta.diameter"
                          label={translate('generic.metaExtend.diameter')}
                          validate={[required(), minValue(0)]}
                        />
                      );
                    case 'Filter':
                      return (
                        <NumberInput
                          source="meta.diameter"
                          label={translate('generic.metaExtend.diameter')}
                          validate={[required(), minValue(0)]}
                        />
                      );
                    case 'PressureReducing':
                      return (
                        <NumberInput
                          source="meta.diameter"
                          label={translate('generic.metaExtend.diameter')}
                          validate={[required(), minValue(0)]}
                        />
                      );
                    case 'Pump':
                      return (
                        <NumberInput
                          source="meta.volume"
                          label={translate('generic.metaExtend.diameter')}
                          validate={[required(), minValue(0)]}
                        />
                      );
                    case 'Tank':
                      return (
                        <NumberInput
                          source="meta.volume"
                          label={translate('generic.metaExtend.diameter')}
                          validate={[required(), minValue(0)]}
                        />
                      );
                    case 'Valve':
                      return (
                        <NumberInput
                          source="meta.diameter"
                          label={translate('generic.metaExtend.diameter')}
                          validate={[required(), minValue(0)]}
                        />
                      );
                    default:
                      return null;
                  }
                }}
              </FormDataConsumer>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <FormDataConsumer>
                {({ formData }) => {
                  switch (formData.type) {
                    case 'Meter':
                      return (
                        <TextInput
                          source="meta.accuracy"
                          label={translate(`generic.metaExtend.accuracy`)}
                          validate={[required()]}
                        />
                      );
                    default:
                      return null;
                  }
                }}
              </FormDataConsumer>
            </Grid>
            <Grid middle item xs={12}>
              <EditorInput fullWidth source="description" />
            </Grid>
          </Grid>
        </FlexForm>
      </Edit>
    );
  }
}
EditMatType.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
  dataProvider: PropTypes.func,
};

EditMatType.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: true,
};

export default compose(translate, withDataProvider)(EditMatType);
