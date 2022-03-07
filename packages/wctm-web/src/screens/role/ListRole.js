import { List, DateField, Datagrid, SFEditButton, FunctionField, TextField, translate } from 'ra-loopback3';
import React, { Component } from 'react';
import Config from '../../Config';
import DeleteRoleButton from './DeleteRoleButton';

@translate
class ListRole extends Component {
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
      <List
        {...this.props}
        filter={{ name: { like: `${Config.projectKey}.*` } }}
        bulkActionButtons={false}
        permissionCreateDefault={{ name: 'role', action: 'create' }}
      >
        <Datagrid>
          <TextField source="title" />
          <FunctionField label={'resources.roles.fields.name'} render={record => this.displayName(record.name)} />
          <DateField source="created" />
          <SFEditButton permission={{ name: 'role', action: 'edit' }} fieldToShowNull="default" />
          <DeleteRoleButton permission={{ name: 'role', action: 'delete' }} fieldToShowNull="default" />
        </Datagrid>
      </List>
    );
  }
}

export default ListRole;
