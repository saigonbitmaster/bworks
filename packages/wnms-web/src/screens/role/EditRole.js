'use strict';
import { Edit, SimpleForm, TextInput, HiddenInput, EditorInput } from 'ra-loopback3';
import React, { Component } from 'react';

class EditRole extends Component {
  displayName = v => {
    if (!v || typeof v !== 'string') return '';
    const ar = v.split('-');
    if (ar.length > 1) {
      return ar.slice(1).join('-');
    }
    return '';
  };

  render() {
    return (
      <Edit {...this.props}>
        <SimpleForm>
          <TextInput source="title" />
          <TextInput source="name" disabled format={this.displayName} />
          <HiddenInput source="project" />
          <EditorInput fullWidth source="description" />
        </SimpleForm>
      </Edit>
    );
  }
}

export default EditRole;
