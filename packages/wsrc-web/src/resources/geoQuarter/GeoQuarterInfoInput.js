import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import {
  TextInput,
  NumberInput,
  EditorInput,
  DisabledInput,
  FlexItemForward,
  FormDataConsumer,
  required,
  ReferenceInput,
  SelectInput,
  PositionInput,
} from 'ra-loopback3';
class GeoQuarterInfoInput extends Component {
  handleCountryChange = () => {
    this.props.formRef.current.props.change('provinceId', '');
    this.handleProvinceChange();
  };
  handleProvinceChange = () => {
    this.props.formRef.current.props.change('districtId', '');
    this.handleDistrictChange();
  };
  handleDistrictChange = () => {
    this.props.formRef.current.props.change('wardId', '');
  };
  handleNameChange = (e, value) => {
    this.updateFullName(this.props.formRef.current.props.values.prefix, value);
  };
  handlePrefixChange = (e, value) => {
    this.updateFullName(value, this.props.formRef.current.props.values.name);
  };
  updateFullName = (prefix, name) => {
    let fullName = (prefix || '') + ' ' + (name || '');
    this.props.formRef.current.props.change('fullName', fullName);
  };
  render() {
    const {
      translate,
      dispatch,
      hasList,
      hasCreate,
      hasEdit,
      hasDelete,
      hasShow,
      formRef,
      subFlex,
      ...rest
    } = this.props;
    return (
      <FlexItemForward {...rest}>
        <Grid middle container spacing={2}>
          <Grid middle item sm={6} xs={12}>
            <TextInput source="name" validate={required()} onChange={this.handleNameChange} />
          </Grid>
          <Grid middle item sm={6} xs={12}>
            <TextInput source="prefix" validate={required()} onChange={this.handlePrefixChange} />
          </Grid>
          <Grid middle item sm={6} xs={12}>
            <DisabledInput source="fullName" />
          </Grid>
          <Grid middle item sm={6} xs={12}>
            <TextInput source="code" validate={required()} />
          </Grid>
          <Grid middle item sm={6} xs={12}>
            <NumberInput source="population" />
          </Grid>
          <Grid middle item sm={6} xs={12}>
            <ReferenceInput
              resource="geoquarters"
              source="countryId"
              reference="geocountries"
              allowEmpty
              validate={required()}
              onChange={this.handleCountryChange}
              {...rest}
            >
              <SelectInput source="countryId" optionText="name" />
            </ReferenceInput>
          </Grid>
          <Grid middle item sm={6} xs={12}>
            <FormDataConsumer>
              {({ formData, ...rest }) => (
                <ReferenceInput
                  key={formData.countryId}
                  resource="geoquarters"
                  source="provinceId"
                  reference="geoprovinces"
                  allowEmpty
                  validate={required()}
                  filter={{ countryId: formData.countryId || '' }}
                  onChange={this.handleProvinceChange}
                  {...rest}
                >
                  <SelectInput source="provinceId" optionText={'name'} />
                </ReferenceInput>
              )}
            </FormDataConsumer>
          </Grid>
          <Grid middle item sm={6} xs={12}>
            <FormDataConsumer>
              {({ formData, ...rest }) => (
                <ReferenceInput
                  key={formData.provinceId}
                  resource="geoquarters"
                  source="districtId"
                  reference="geodistricts"
                  allowEmpty
                  validate={required()}
                  isLoading
                  filter={{ provinceId: formData.provinceId || '' }}
                  onChange={this.handleDistrictChange}
                  {...rest}
                >
                  <SelectInput source="districtId" optionText="name" />
                </ReferenceInput>
              )}
            </FormDataConsumer>
          </Grid>
          <Grid middle item sm={6} xs={12}>
            <FormDataConsumer>
              {({ formData, ...rest }) => (
                <ReferenceInput
                  key={formData.districtId}
                  resource="geoquarters"
                  source="wardId"
                  reference="geowards"
                  allowEmpty
                  validate={required()}
                  isLoading
                  filter={{ districtId: formData.districtId || '' }}
                  {...rest}
                >
                  <SelectInput source="wardId" optionText="name" />
                </ReferenceInput>
              )}
            </FormDataConsumer>
          </Grid>
          <Grid middle item sm={6} xs={12}>
            <PositionInput
              source="position"
              fullWidth
              validate={[required()]}
              inputProps={{ defaultCenter: '', defaultZoom: '' }}
            />
          </Grid>
          <Grid middle item sm={12}>
            <EditorInput fullWidth source="description" />
          </Grid>
        </Grid>
      </FlexItemForward>
    );
  }
}
GeoQuarterInfoInput.propTypes = {
  translate: PropTypes.func,
  dispatch: PropTypes.any,
  hasList: PropTypes.any,
  hasCreate: PropTypes.any,
  hasEdit: PropTypes.any,
  hasDelete: PropTypes.any,
  hasShow: PropTypes.any,
  formRef: PropTypes.object,
  subFlex: PropTypes.any,
};
export default GeoQuarterInfoInput;
