import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlexForm, Create, TextInput, required, translate, NumberInput, SelectInput, minValue } from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import config from '../../Config';
import NormGroupInput from './NormGroupInput';

class CreateFormula extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }
  render() {
    const { props } = this;
    return (
      <Create {...props} resource="formulas">
        <FlexForm style={{ flexGrow: 1 }} spacing={2} formRef={this.formRef} redirect="list">
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="sewageFee" validate={[required(), minValue(0)]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="tax" validate={[required(), minValue(0)]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <SelectInput source="unit" choices={config.formula.unitChoices} validate={[required()]} allowEmpty />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <NormGroupInput fullWidth />
            </Grid>
          </Grid>
        </FlexForm>
      </Create>
    );
  }
}
CreateFormula.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
};
CreateFormula.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
export default compose(translate)(CreateFormula);
