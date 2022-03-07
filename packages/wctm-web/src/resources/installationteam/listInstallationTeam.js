import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  translate,
  TextField,
  List,
  Datagrid,
  EditButton,
  ShowButton,
  ReferenceField,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
} from 'ra-loopback3';

import { compose } from 'recompose';

class ListInstallationTeam extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List
        {...rest}
        permissionCreateDefault={{ name: 'InstallationTeam', action: 'create' }}
        permissionDeleteDefault={{ name: 'InstallationTeam', action: 'delete' }}
      >
        <Datagrid>
          <TextField source="name" />
          <ReferenceField source="contactPersonId" reference="appusers" basePath="/appusers" allowEmpty>
            <TextField source="fullName" />
          </ReferenceField>
          <ReferenceArrayField source="appUserIds" reference="appusers" basePath="/appusers" allowEmpty>
            <SingleFieldList>
              <ChipField source="fullName" />
            </SingleFieldList>
          </ReferenceArrayField>
          <ShowButton />
          <EditButton />
        </Datagrid>
      </List>
    );
  }
}

ListInstallationTeam.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

export default compose(translate)(ListInstallationTeam);
