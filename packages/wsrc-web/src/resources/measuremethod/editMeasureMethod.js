import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Edit, FlexForm, TextInput, required, translate, SelectInput, EditorInput } from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';

class EditPartner extends Component {
  render() {
    const { props } = this;
    return (
      <Edit {...props} resource="measuremethods">
        <FlexForm style={{ flexGrow: 1 }} spacing={2} redirect="list" submitOnEnter={false}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="volRequire" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <SelectInput
                source="container"
                validate={[required()]}
                choices={[{ name: 'P' }, { name: 'G' }, { name: 'P, G' }]}
                translateChoice={true}
                optionText="name"
                optionValue="name"
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="preservative" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="holdingTime" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <EditorInput source="description" fullWidth />
            </Grid>
          </Grid>
        </FlexForm>
      </Edit>
    );
  }
}

EditPartner.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  staticcontext: PropTypes.any,
};
EditPartner.detaultProps = {
  hasList: true,
  hasShow: true,
};

const enhance = compose(translate);
export default enhance(EditPartner);
