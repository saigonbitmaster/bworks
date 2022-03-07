import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Create, FlexForm, TextInput, required, translate, SelectInput, EditorInput } from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import config from '../../Config';

class CreateInterfaceStandard extends Component {
  render() {
    const { props } = this;
    return (
      <Create {...props} resource="interfacestandards">
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
              <EditorInput source="description" fullWidth />
            </Grid>
          </Grid>
        </FlexForm>
      </Create>
    );
  }
}

CreateInterfaceStandard.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
};
CreateInterfaceStandard.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(translate);
export default enhance(CreateInterfaceStandard);
