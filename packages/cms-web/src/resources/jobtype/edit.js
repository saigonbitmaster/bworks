import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Edit,
  FlexForm,
  TextInput,
  required,
  translate,
  SelectArrayInput,
  EditorInput,
  ReferenceArrayInput,
  DateTimeInput,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
  BooleanInput,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import config from '../../Config';

class EditPartner extends Component {
  render() {
    const { props } = this;
    return (
      <Edit {...props} PostJob>
        <FlexForm style={{ flexGrow: 1 }} spacing={2} redirect="list" submitOnEnter={false}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required()]} label="Job name" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceArrayInput source="skills" reference="skills">
                <SelectArrayInput optionText="name" />
              </ReferenceArrayInput>
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
