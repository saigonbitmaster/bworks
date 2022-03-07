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
  DateField,
} from 'ra-loopback3';
import config from '../../Config';

class ShowPump extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Show {...rest} resource="pumps">
        <FlexForm toolbar={false} style={{ flexGrow: 1 }} spacing={2}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={4}>
              <TextField source="name" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <SelectField
                source="typeOfPump"
                choices={config.typeOfPump}
                translateChoice={true}
                optionText="name"
                optionValue="id"
              />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="powerCapacity" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="maxHead" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="maxDepth" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="maxFlowRate" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="rotationRate" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="inputDiameter" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="outputDiameter" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="powerSource" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="weight" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="dimensions" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ReferenceField source="waterSourceId" reference="watersources">
                <TextField source="name" />
              </ReferenceField>
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <DateField source="setupDate" />
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

ShowPump.propTypes = {
  translate: PropTypes.any,
};

ShowPump.detaultProps = {
  hasShow: true,
};
const enhance = compose(translate);
export default enhance(ShowPump);
