'use strict';
import { Create, TextInput, FlexForm, HiddenInput, EditorInput } from 'ra-loopback3';
import React, { Component } from 'react';
import slug from 'slug';
import Config from '../../Config';
class CreateRole extends Component {
  onChange = (values, _, __, previousValues) => {
    if (values && previousValues) {
      if (values.title !== previousValues.title) {
        let title = (values.title || '').toLowerCase();
        values.name = `${Config.projectKey}-${slug(title)}`;
      } else if (values.name !== previousValues.name) {
        values.name = `${Config.projectKey}-${slug(values.name)}`;
      }
    }
  };

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
      <Create {...this.props}>
        <FlexForm onChange={this.onChange} redirect="list" defaultValue={{ project: Config.projectKey }}>
          <TextInput source="title" />
          <TextInput source="name" format={this.displayName} />
          <HiddenInput source="project" />
          <EditorInput fullWidth source="description" />
        </FlexForm>
      </Create>
    );
  }
}

export default CreateRole;
