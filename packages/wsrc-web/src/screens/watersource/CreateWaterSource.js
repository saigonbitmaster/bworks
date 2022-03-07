import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Create,
  FlexForm,
  NumberInput,
  DateInput,
  BooleanInput,
  TextInput,
  required,
  translate,
  SelectInput,
  ReferenceInput,
  EditorInput,
  PositionInput,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import config from '../../Config';

class CreateWaterSource extends Component {
  render() {
    const { props } = this;
    return (
      <Create {...props} resource="watersources">
        <FlexForm style={{ flexGrow: 1 }} spacing={2} redirect="list" submitOnEnter={false}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <SelectInput
                source="typeOfWaterSource"
                choices={config.typeOfWaterSource}
                translateChoice={true}
                optionText="name"
                optionValue="id"
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="volumeCapacity" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="dailyCapacity" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="monthlyCapacity" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="yearCapacity" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="dimensions" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="address" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput source="waterSourceGroupId" reference="watersourcegroups">
                <SelectInput source="name" />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateInput source="setupDate" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <SelectInput
                source="sourceStatus"
                choices={config.sourceStatus}
                translateChoice={true}
                optionText="name"
                optionValue="id"
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateInput source="lastMaintainedDate" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <BooleanInput source="isBackupSource" />
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

CreateWaterSource.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
};
CreateWaterSource.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(translate);
export default enhance(CreateWaterSource);
