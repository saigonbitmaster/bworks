import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Create,
  FlexForm,
  TextInput,
  required,
  translate,
  SelectInput,
  EditorInput,
  DateTimeInput,
  NumberInput,
  ArrayInput,
  SelectArrayInput,
  SimpleFormIterator,
  BooleanInput,
  ReferenceArrayInput,
} from 'ra-loopback3';
import { Grid, Hidden } from '@material-ui/core';

import compose from 'recompose/compose';

class CreatePostJob extends Component {
  render() {
    const { props } = this;
    return (
      <Create {...props} resource="jobtypes">
        <FlexForm style={{ flexGrow: 1 }} spacing={2} redirect="list" submitOnEnter={false}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required()]} label="Job name"  />
            </Grid>

            <Grid middle item xs={12} sm={6}>
              <ReferenceArrayInput source="skills" reference="skills" perPage={1000}>
                <SelectArrayInput optionText="name" />
              </ReferenceArrayInput>
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

CreatePostJob.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
};
CreatePostJob.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(translate);
export default enhance(CreatePostJob);
