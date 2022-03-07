import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import {
  Show,
  HtmlField,
  TextField,
  NumberField,
  ReferenceField,
  translate,
  FlexForm,
  SelectField,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
  DateField,
} from 'ra-loopback3';
import config from '../../Config';

class ShowMeter extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Show {...rest} resource="meters">
        <FlexForm toolbar={false} style={{ flexGrow: 1 }} spacing={2}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={4}>
              <TextField source="name" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="size" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="accuracy" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="flowRate" />
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
              <ReferenceArrayField label="Giao tiếp máy chủ" source="outputOptionIds" reference="interfacestandards">
                <SingleFieldList>
                  <ChipField source="name" />
                </SingleFieldList>
              </ReferenceArrayField>
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ReferenceField source="waterSourceId" reference="watersources">
                <TextField source="name" />
              </ReferenceField>
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ReferenceField source="dataLoggerId" reference="dataloggers">
                <TextField source="name" />
              </ReferenceField>
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

ShowMeter.propTypes = {
  translate: PropTypes.any,
};

ShowMeter.detaultProps = {
  hasShow: true,
};
const enhance = compose(translate);
export default enhance(ShowMeter);
