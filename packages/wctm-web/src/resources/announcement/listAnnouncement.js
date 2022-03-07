import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  SFEditButton,
  Filter,
  FunctionField,
  translate,
  TextInput,
  ReferenceInput,
  ReferenceField,
  SelectInput,
  SFShowButton,
  // withDataProvider,
} from 'ra-loopback3';
import moment from 'moment-timezone';
import compose from 'recompose/compose';

const AnnouncementFilter = props => (
  <Filter {...props}>
    <TextInput source="name" label={'generic.search'} alwaysOn />
    <ReferenceInput source="announcementTypeId" reference="announcementtypes">
      <SelectInput optionText="name" />
    </ReferenceInput>
    <ReferenceInput source="announcementPriorityId" reference="announcementpriorities">
      <SelectInput optionText="name" />
    </ReferenceInput>
    <ReferenceInput source="appUserId" reference="appusers">
      <SelectInput optionText="fullName" />
    </ReferenceInput>
  </Filter>
);

class ListAnnouncement extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List
        {...rest}
        resource="announcements"
        sort={{ field: 'createdDate', order: 'DESC' }}
        filters={<AnnouncementFilter />}
        permissionCreateDefault={{ name: 'Announcement', action: 'create' }}
        permissionDeleteDefault={{ name: 'Announcement', action: 'delete' }}
      >
        <Datagrid>
          <TextField source="name" />
          <FunctionField
            source="createdDate"
            render={record => moment(record.createdDate).format('DD/MM/YYYY HH:mm:ss')}
          />
          <ReferenceField source="appUserId" reference="appusers" linkType={false} allowEmpty>
            <TextField source="fullName" />
          </ReferenceField>
          <ReferenceField source="announcementTypeId" reference="announcementtypes" linkType={false}>
            <TextField source="name" />
          </ReferenceField>
          <ReferenceField source="announcementPriorityId" reference="announcementpriorities" linkType={false}>
            <TextField source="name" />
          </ReferenceField>
          <BooleanField source="sendPublic" />
          <SFEditButton permission={{ name: 'Announcement', action: 'edit' }} />
          <SFShowButton permission={{ name: 'Announcement', action: 'examine' }} />
        </Datagrid>
      </List>
    );
  }
}
ListAnnouncement.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  dataProvider: PropTypes.func,
};

ListAnnouncement.detaultProps = {
  hasList: true,
  hasShow: false,
  hasCreate: true,
  hasEdit: true,
};

const enhance = compose(
  translate,
  // withDataProvider,
);
export default enhance(ListAnnouncement);
