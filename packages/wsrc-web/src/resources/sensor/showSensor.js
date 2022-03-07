import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import {
  Show,
  HtmlField,
  TextField,
  NumberField,
  Datagrid,
  ArrayField,
  ReferenceField,
  translate,
  FlexForm,
  SelectField,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
  DateField,
  FunctionField,
} from 'ra-loopback3';
import config from '../../Config';

class ShowSensor extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Show {...rest} resource="sensors">
        <FlexForm toolbar={false} style={{ flexGrow: 1 }} spacing={2}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={4}>
              <TextField source="name" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <SelectField
                source="typeOfSensor"
                choices={config.typeOfSensor}
                translateChoice={true}
                optionText="name"
                optionValue="id"
              />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <DateField source="manufacturedDate" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <DateField source="setupDate" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="operatingTemperature" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="operatingPressure" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <SelectField
                source="environmentalRating"
                choices={config.environmentalRating}
                translateChoice={true}
                optionText="name"
                optionValue="name"
              />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <FunctionField
                source="powerSource"
                render={record =>
                  record.powerSource && record.powerSource.map(item => <li key={item.id}>{translate(item)}</li>)
                }
              />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="batteryLife" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <DateField source="lastChargeBattery" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ReferenceArrayField label="Giao tiếp thiết bị" source="inputOptionIds" reference="interfacestandards">
                <SingleFieldList>
                  <ChipField source="name" />
                </SingleFieldList>
              </ReferenceArrayField>
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ReferenceArrayField label="Giao tiếp máy chủ" source="outputOptionIds" reference="interfacestandards">
                <SingleFieldList>
                  <ChipField source="name" />
                </SingleFieldList>
              </ReferenceArrayField>
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <ArrayField source="sensorProbeList">
                <Datagrid>
                  <TextField source="name" />
                  <DateField source="setupDate" />
                  <TextField source="calibType" />
                  <DateField source="lastCalibDate" />
                  <TextField source="accuracy" />
                  <TextField source="measureRange" />
                  <TextField source="resolution" />
                  <TextField source="responseTime" />
                  <ReferenceField source="parameterId" reference="waterparameters">
                    <TextField optionText="name" />
                  </ReferenceField>
                  <ReferenceField source="measureMethodId" reference="measuremethods">
                    <TextField optionText="name" />
                  </ReferenceField>
                  <ReferenceField source="outputOptionId" reference="interfacestandards">
                    <TextField optionText="name" />
                  </ReferenceField>
                </Datagrid>
              </ArrayField>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <SelectField
                source="materialStatus"
                choices={config.materialStatus}
                translateChoice={true}
                optionText="name"
                optionValue="id"
              />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <HtmlField source="description" />
            </Grid>
          </Grid>
        </FlexForm>
      </Show>
    );
  }
}

ShowSensor.propTypes = {
  translate: PropTypes.any,
};

ShowSensor.detaultProps = {
  hasShow: true,
};
const enhance = compose(translate);
export default enhance(ShowSensor);
