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
  MapWaterSourceGroupInput,
} from 'ra-loopback3';
import config from '../../Config';

class ShowWaterSourceGroup extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Show {...rest} resource="watersourcegroups">
        <FlexForm style={{ flexGrow: 1 }} spacing={2} toolbar={null}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={4}>
              <TextField source="name" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <SelectField
                source="type"
                choices={config.typeOfWaterSourceGroup}
                translateChoice={true}
                optionText="name"
                optionValue="id"
              />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="estimatedReserves" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ReferenceField source="provinceId" reference="geoprovinces" allowEmpty>
                <TextField source="name" />
              </ReferenceField>
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ReferenceField source="districtId" reference="geodistricts" allowEmpty>
                <TextField source="name" />
              </ReferenceField>
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ReferenceField source="wardId" reference="geowards" allowEmpty>
                <TextField source="name" />
              </ReferenceField>
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ReferenceField source="quarterId" reference="geoquarters" allowEmpty>
                <TextField source="name" />
              </ReferenceField>
            </Grid>
            <Grid middle item xs={12}>
              <MapWaterSourceGroupInput fullWidth source="boundary" onlyShow={true} />
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

ShowWaterSourceGroup.propTypes = {
  translate: PropTypes.any,
};

ShowWaterSourceGroup.detaultProps = {
  hasShow: true,
};
const enhance = compose(translate);
export default enhance(ShowWaterSourceGroup);
