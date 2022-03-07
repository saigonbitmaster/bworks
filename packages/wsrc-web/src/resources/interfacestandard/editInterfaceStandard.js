import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Edit, FlexForm, TextInput, required, translate, SelectInput, EditorInput } from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import config from '../../Config';

class EditInterfaceStandard extends Component {
  render() {
    const { props } = this;
    return (
      <Edit {...props} resource="interfacestandards">
        <FlexForm style={{ flexGrow: 1 }} spacing={2} redirect="list" submitOnEnter={false}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <SelectInput
                source="interfaceStandardType"
                validate={[required()]}
                choices={config.interfaceStandardType}
                translateChoice={true}
                optionText="name"
                optionValue="name"
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="dataRate" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="frequency" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="range" />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <EditorInput source="description" />
            </Grid>
          </Grid>
        </FlexForm>
      </Edit>
    );
  }
}

EditInterfaceStandard.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  staticcontext: PropTypes.any,
};
EditInterfaceStandard.detaultProps = {
  hasList: true,
  hasShow: true,
};

const enhance = compose(translate);
export default enhance(EditInterfaceStandard);
