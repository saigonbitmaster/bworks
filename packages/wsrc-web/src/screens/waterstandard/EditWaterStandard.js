import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Edit,
  FlexForm,
  ArrayInput,
  SimpleFormIterator,
  DateInput,
  BooleanInput,
  TextInput,
  required,
  translate,
  SelectInput,
  ReferenceInput,
  EditorInput,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import config from '../../Config';

const waterParameterId = 'resources.waterstandards.fields.waterParameterId';
const symbol = 'resources.waterstandards.fields.symbol';
const measureUnit = 'resources.waterstandards.fields.measureUnit';
const value = 'resources.waterstandards.fields.value';

class EditPartner extends Component {
  render() {
    const { props } = this;
    return (
      <Edit {...props} resource="waterstandards">
        <FlexForm style={{ flexGrow: 1 }} spacing={2} redirect="list" submitOnEnter={false}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <SelectInput
                source="applyFor"
                choices={config.waterParameterStage}
                translateChoice={true}
                optionText="name"
                optionValue="id"
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateInput source="issuedDate" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="issuedOrg" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ArrayInput source="paramItemList">
                <SimpleFormIterator>
                  <ReferenceInput label={waterParameterId} source="waterParameterId" reference="waterparameters">
                    <SelectInput optionText="name" />
                  </ReferenceInput>
                  <ReferenceInput label={symbol} source="waterParameterId" reference="waterparameters">
                    <SelectInput optionText="symbol" disabled={true} />
                  </ReferenceInput>
                  <ReferenceInput label={measureUnit} source="waterParameterId" reference="waterparameters">
                    <SelectInput optionText="measureUnit" disabled={true} />
                  </ReferenceInput>
                  <TextInput label={value} source="value" validate={[required()]} />
                </SimpleFormIterator>
              </ArrayInput>
            </Grid>
            <Grid middle item xs={12} sm={6} />
            <Grid middle item xs={12} sm={6}>
              <BooleanInput source="isInValid" />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <EditorInput source="description" fullWidth />
            </Grid>
          </Grid>
        </FlexForm>
      </Edit>
    );
  }
}

EditPartner.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  staticcontext: PropTypes.any,
};
EditPartner.detaultProps = {
  hasList: true,
  hasShow: true,
};

const enhance = compose(translate);
export default enhance(EditPartner);
