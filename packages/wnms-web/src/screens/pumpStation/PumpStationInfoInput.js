import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import {
  minValue,
  NumberInput,
  FlexItemForward,
  EditorInput,
  required,
  TextInput,
  withDataProvider,
  ReferenceInput,
  SelectInput,
} from 'ra-loopback3';

class PumpStationInfoInput extends Component {
  render() {
    const { translate, defaultCenter, defaultZoom, ...rest } = this.props;
    return (
      <FlexItemForward {...rest}>
        <Grid middle container spacing={2}>
          <Grid middle item xs={12} sm={6}>
            <TextInput source="name" validate={[required()]} />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <ReferenceInput source="factoryId" reference="factories">
              <SelectInput optionText="name" />
            </ReferenceInput>
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <NumberInput source="designCapacity" validate={[minValue(0)]} />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <NumberInput source="designElectricRate" validate={[minValue(0)]} />
          </Grid>
          <Grid middle item xs={12}>
            <EditorInput fullWidth label="generic.common.description" source="description" />
          </Grid>
        </Grid>
      </FlexItemForward>
    );
  }
}
PumpStationInfoInput.propTypes = {
  dataProvider: PropTypes.func,
  formRef: PropTypes.func,
  translate: PropTypes.func,
  defaultCenter: PropTypes.object,
  defaultZoom: PropTypes.number,
  forward: PropTypes.object,
};

PumpStationInfoInput.detaultProps = {};
const mapStateToProps = state => ({
  defaultZoom: state.design.defaultZoom,
  defaultCenter: state.design.defaultCenter,
});

const enhance = compose(withDataProvider, connect(mapStateToProps));

export default enhance(PumpStationInfoInput);
