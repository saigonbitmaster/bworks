import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import {
  Show,
  NumberField,
  HtmlField,
  MetaFields,
  TextField,
  translate,
  TabbedFlexForm,
  FlexFormTab,
  ReferenceField,
} from 'ra-loopback3';

class GeoWardShow extends Component {
  render() {
    const { translate, dispatch, ...rest } = this.props;
    return (
      <Show title={translate('resources.geocountries.show')} {...rest}>
        <TabbedFlexForm disabletoolbar redirect={'list'}>
          <FlexFormTab key={1} label={this.props.translate('generic.info')}>
            <Grid middle="true" container spacing={2}>
              <Grid middle="true" item sm={6} xs={12}>
                <TextField source="name" />
              </Grid>
              <Grid middle="true" item sm={6} xs={12}>
                <TextField source="prefix" />
              </Grid>
              <Grid middle="true" item sm={6} xs={12}>
                <TextField source="fullName" />
              </Grid>
              <Grid middle="true" item sm={6} xs={12}>
                <TextField source="code" />
              </Grid>
              <Grid middle="true" item sm={6} xs={12}>
                <NumberField addLabel source="population" />
              </Grid>
              <Grid middle="true" item sm={6} xs={12}>
                <ReferenceField
                  resource="geowards"
                  basePath={'geocountry'}
                  source="countryId"
                  reference="geocountries"
                  allowEmpty
                >
                  <TextField source="name" />
                </ReferenceField>
              </Grid>
              <Grid middle="true" item sm={6} xs={12}>
                <ReferenceField
                  resource="geowards"
                  basePath={'geoprovince'}
                  source="provinceId"
                  reference="geoprovinces"
                  allowEmpty
                >
                  <TextField source="name" />
                </ReferenceField>
              </Grid>
              <Grid middle="true" item sm={6} xs={12}>
                <ReferenceField
                  resource="geowards"
                  basePath={'geodistrict'}
                  source="districtId"
                  reference="geodistricts"
                  allowEmpty
                >
                  <TextField source="name" />
                </ReferenceField>
              </Grid>
              <Grid middle="true" item sm={12}>
                <HtmlField source="description" />
              </Grid>
            </Grid>
          </FlexFormTab>
          <FlexFormTab key={2} label={this.props.translate('generic.meta')}>
            <MetaFields />
          </FlexFormTab>
        </TabbedFlexForm>
      </Show>
    );
  }
}

GeoWardShow.propTypes = {
  translate: PropTypes.any,
  dispatch: PropTypes.any,
};

const enhance = compose(translate);
export default enhance(GeoWardShow);
