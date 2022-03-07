import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Create,
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

const probeName = 'resources.sensors.sensorProbe.name';
const setupDate = 'resources.sensors.sensorProbe.setupDate';
const calibType = 'resources.sensors.sensorProbe.name';
const lastCalibDate = 'resources.sensors.sensorProbe.lastCalibDate';
const accuracy = 'resources.sensors.sensorProbe.accuracy';
const measureRange = 'resources.sensors.sensorProbe.measureRange';
const resolution = 'resources.sensors.sensorProbe.resolution';
const responseTime = 'resources.sensors.sensorProbe.responseTime';
const measureMethodId = 'resources.sensors.sensorProbe.measureMethodId';
const parameterId = 'resources.sensors.sensorProbe.parameterId';
const outputOptionId = 'resources.sensors.sensorProbe.outputOptionId';

class CreateSensor extends Component {
  render() {
    const { props } = this;
    return (
      <Create {...props} resource="sensors">
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
                  <TextInput label={probeName} source="name" validate={[required()]} />
                  <DateInput label={setupDate} source="setupDate" validate={[required()]} />
                  <TextInput source="calibType" label={calibType} />
                  <DateInput source="lastCalibDate" validate={[required()]} label={lastCalibDate} />
                  <TextInput source="accuracy" label={accuracy} />
                  <TextInput source="measureRange" label={measureRange} />
                  <TextInput source="resolution" label={resolution} />
                  <TextInput source="responseTime" label={responseTime} />
                  <ReferenceInput source="parameterId" reference="waterparameters" label={parameterId}>
                    <SelectInput optionText="name" />
                  </ReferenceInput>
                  <ReferenceInput source="measureMethodId" reference="measuremethods" label={measureMethodId}>
                    <SelectInput optionText="name" />
                  </ReferenceInput>
                  <ReferenceInput source="outputOptionId" reference="interfacestandards" label={outputOptionId}>
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
      </Create>
    );
  }
}

CreateSensor.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
};
CreateSensor.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(translate);
export default enhance(CreateSensor);
