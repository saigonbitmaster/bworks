import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import {
  TextInput,
  NumberInput,
  EditorInput,
  DisabledInput,
  FlexItemForward,
  required,
  PositionInput,
} from 'ra-loopback3';
class GeoCountryInfoInput extends Component {
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

GeoCountryInfoInput.propTypes = {
  translate: PropTypes.func,
  dispatch: PropTypes.any,
  subFlex: PropTypes.any,
  formRef: PropTypes.any,
};

export default GeoCountryInfoInput;
