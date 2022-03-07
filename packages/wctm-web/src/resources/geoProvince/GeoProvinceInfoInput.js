import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import {
  TextInput,
  NumberInput,
  EditorInput,
  DisabledInput,
  FlexItemForward,
  ReferenceInput,
  SelectInput,
  required,
  PositionInput,
} from 'ra-loopback3';
class GeoProvinceInfoInput extends Component {
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
              resource="geoprovinces"
              source="countryId"
              reference="geocountries"
              allowEmpty
              validate={required()}
            >
              <SelectInput source="countryId" optionText="name" />
            </ReferenceInput>
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <PositionInput
              source="position"
              validate={[required()]}
              inputProps={{ defaultCenter: '', defaultZoom: 14 }}
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

GeoProvinceInfoInput.propTypes = {
  translate: PropTypes.func,
  subFlex: PropTypes.any,
  formRef: PropTypes.any,
};

export default GeoProvinceInfoInput;
