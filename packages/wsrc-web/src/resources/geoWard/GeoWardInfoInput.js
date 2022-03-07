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
class GeoWardInfoInput extends Component {
  handleCountryChange = () => {
    this.props.formRef.current.props.change('provinceId', '');
    this.handleProvinceChange();
  };
  handleProvinceChange = () => {
    this.props.formRef.current.props.change('districtId', '');
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
              resource="geowards"
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
                  resource="geowards"
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
                  // onChange={(rest, val) => this.changeData(formData, val)}
                  resource="geowards"
                  source="districtId"
                  reference="geodistricts"
                  allowEmpty
                  validate={required()}
                  isLoading
                  filter={{ provinceId: formData.provinceId || '' }}
                  {...rest}
                >
                  <SelectInput source="districtId" optionText="name" />
                </ReferenceInput>
              )}
            </FormDataConsumer>
          </Grid>
          <Grid middle item xs={12} sm={6}>
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

GeoWardInfoInput.propTypes = {
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

export default GeoWardInfoInput;
