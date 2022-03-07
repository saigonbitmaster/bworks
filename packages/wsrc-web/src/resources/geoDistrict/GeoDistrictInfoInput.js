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
class GeoDistrictInfoInput extends Component {
  handleCountryChange = () => {
    this.props.formRef.current.props.change('provinceId', '');
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
    const { translate, subFlex, ...rest } = this.props;
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
              resource="geodistricts"
              source="countryId"
              reference="geocountries"
              onChange={this.handleCountryChange}
              validate={required()}
              allowEmpty
            >
              <SelectInput source="countryId" optionText="name" />
            </ReferenceInput>
          </Grid>
          <Grid middle item sm={6} xs={12}>
            <FormDataConsumer>
              {({ formData, ...rest }) => (
                <ReferenceInput
                  key={formData.countryId}
                  resource="geodistricts"
                  source="provinceId"
                  reference="geoprovinces"
                  allowEmpty
                  validate={required()}
                  filter={{ countryId: formData.countryId }}
                  {...rest}
                >
                  <SelectInput source="provinceId" optionText="name" />
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

GeoDistrictInfoInput.propTypes = {
  translate: PropTypes.func,
  formRef: PropTypes.object,
  subFlex: PropTypes.any,
};

export default GeoDistrictInfoInput;
