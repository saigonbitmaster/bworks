import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Edit,
  FlexForm,
  NumberInput,
  DateInput,
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

class EditPump extends Component {
  render() {
    const { props } = this;
    return (
      <Edit {...props} resource="pumps">
        <FlexForm style={{ flexGrow: 1 }} spacing={2} redirect="list" submitOnEnter={false}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <SelectInput
                source="typeOfPump"
                choices={config.typeOfPump}
                translateChoice={true}
                optionText="name"
                optionValue="id"
                validate={[required()]}
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="powerCapacity" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="maxHead" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="maxDepth" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="maxFlowRate" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="rotationRate" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="inputDiameter" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="outputDiameter" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="powerSource" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="weight" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="dimensions" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput source="waterSourceId" reference="watersources">
                <SelectInput source="name" />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateInput source="setupDate" />
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

EditPump.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  staticcontext: PropTypes.any,
};
EditPump.detaultProps = {
  hasList: true,
  hasShow: true,
};

const enhance = compose(translate);
export default enhance(EditPump);
