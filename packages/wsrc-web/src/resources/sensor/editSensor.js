import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Edit,
  FlexForm,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
  DateInput,
  TextInput,
  required,
  translate,
  SelectInput,
  ReferenceArrayInput,
  ReferenceInput,
  SelectArrayInput,
  EditorInput,
  PositionInput,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import config from '../../Config';

class EditPartner extends Component {
  render() {
    const { props } = this;
    return (
      <Edit {...props} resource="sensors">
        <FlexForm style={{ flexGrow: 1 }} spacing={2} redirect="list" submitOnEnter={false}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <SelectInput
                source="typeOfSensor"
                choices={config.typeOfSensor}
                translateChoice={true}
                optionText="name"
                optionValue="id"
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateInput source="manufacturedDate" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateInput source="setupDate" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="operatingTemperature" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="operatingPressure" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <SelectInput
                source="environmentalRating"
                choices={config.environmentalRating}
                translateChoice={true}
                optionText="name"
                optionValue="name"
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <SelectArrayInput
                source="powerSource"
                choices={config.powerSource}
                translateChoice={true}
                optionText="name"
                optionValue="name"
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="batteryLife" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateInput source="lastChargeBattery" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceArrayInput source="inputOptionIds" reference="interfacestandards">
                <SelectArrayInput optionText="name" />
              </ReferenceArrayInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceArrayInput source="outputOptionIds" reference="interfacestandards">
                <SelectArrayInput optionText="name" />
              </ReferenceArrayInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput source="dataLoggerId" reference="dataloggers">
                <SelectInput source="name" />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ArrayInput source="sensorProbeList">
                <SimpleFormIterator>
                  <TextInput fullWidth source="name" validate={[required()]} />
                  <DateInput source="setupDate" validate={[required()]} />
                  <TextInput source="calibType" />
                  <DateInput source="lastCalibDate" validate={[required()]} />
                  <TextInput source="accuracy" />
                  <TextInput source="measureRange" />
                  <TextInput source="resolution" />
                  <TextInput source="responseTime" />
                  <ReferenceInput source="parameterId" reference="waterparameters">
                    <SelectInput optionText="name" />
                  </ReferenceInput>
                  <ReferenceInput source="measureMethodId" reference="measuremethods">
                    <SelectInput optionText="name" />
                  </ReferenceInput>
                  <ReferenceInput source="outputOptionId" reference="interfacestandards">
                    <SelectInput optionText="name" />
                  </ReferenceInput>
                </SimpleFormIterator>
              </ArrayInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput source="waterSourceId" reference="watersources">
                <SelectInput source="name" />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <SelectInput
                source="materialStatus"
                choices={config.materialStatus}
                translateChoice={true}
                optionText="name"
                optionValue="id"
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <PositionInput
                source="position"
                validate={[required()]}
                inputProps={{ defaultCenter: config.mapDefaultCenter, defaultZoom: config.mapDefaultZoom }}
              />
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
