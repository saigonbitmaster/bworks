import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Create,
  FlexForm,
  NumberInput,
  TextInput,
  required,
  translate,
  SelectInput,
  PositionInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ReferenceInput,
  EditorInput,
  DateInput,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import config from '../../Config';

class CreateDataLogger extends Component {
  render() {
    const { props } = this;
    return (
      <Create {...props} resource="dataloggers">
        <FlexForm style={{ flexGrow: 1 }} spacing={2} redirect="list" submitOnEnter={false}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="readDataRate" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="sendDataRate" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="memoryStorage" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateInput source="manufacturedDate" validate={[required()]} />
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
              <ReferenceArrayInput label="Giao tiếp thiết bị" source="inputOptionIds" reference="interfacestandards">
                <SelectArrayInput optionText="name" />
              </ReferenceArrayInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceArrayInput label="Giao tiếp máy chủ" source="outputOptionIds" reference="interfacestandards">
                <SelectArrayInput optionText="name" />
              </ReferenceArrayInput>
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

CreateDataLogger.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
};
CreateDataLogger.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(translate);
export default enhance(CreateDataLogger);
