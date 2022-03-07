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
  BooleanField,
} from 'ra-loopback3';
import config from '../../Config';

class ShowWaterSource extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Show {...rest} resource="watersources">
        <FlexForm toolbar={false} style={{ flexGrow: 1 }} spacing={2}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={4}>
              <TextField source="name" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <SelectField
                source="typeOfWaterSource"
                choices={config.typeOfWaterSource}
                translateChoice={true}
                optionText="name"
                optionValue="id"
              />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="volumeCapacity" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="dailyCapacity" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="monthlyCapacity" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="yearCapacity" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="dimensions" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="address" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ReferenceField source="waterSourceGroupId" reference="watersourcegroups">
                <TextField source="name" />
              </ReferenceField>
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <DateField source="setupDate" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <DateField source="lastMaintainedDate" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <BooleanField source="isBackupSource" />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <HtmlField source="description" fullWidth />
            </Grid>
          </Grid>
        </FlexForm>
      </Show>
    );
  }
}

ShowWaterSource.propTypes = {
  translate: PropTypes.any,
};

ShowWaterSource.detaultProps = {
  hasShow: true,
};
const enhance = compose(translate);
export default enhance(ShowWaterSource);
