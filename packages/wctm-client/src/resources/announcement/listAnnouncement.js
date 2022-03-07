import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Datagrid,
  TextField,
  // BooleanField,
  Filter,
  FunctionField,
  translate,
  TextInput,
  ReferenceInput,
  ReferenceField,
  SelectInput,
  ShowButton,
  withDataProvider,
  Storage,
  GET_ONE,
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
  constructor(props) {
    super(props);
    this.state = {
      filter: {},
      update: 0,
    };
  }

  //{and: [{sendDate: {lt: now}},  {or: [{dmaIds: [record.data.dmaId]}, {sendPublic: true}]}]}
  //{filter: {or: [{dmaIds: [record.data.dmaId]}, {sendPublic: true}]}, update: this.state.update + 1}
  //for client screen, filter announcements by dmaId

  componentDidMount() {
    const { dataProvider } = this.props;
    let NowTime = new Date();
    const id = Storage.getUser().userId;
    dataProvider(GET_ONE, 'clientusers', { id: id }).then(record => {
      this.setState({
        filter: {
          and: [{ sendDate: { lt: NowTime } }, { or: [{ dmaIds: [record.data.dmaId] }, { sendPublic: true }] }],
        },
        update: this.state.update + 1,
      });
    });
  }

  render() {
    const { translate, ...rest } = this.props;
    return (
      <List
        {...rest}
        key={this.state.update}
        filter={this.state.filter}
        resource="announcements"
        sort={{ field: 'createdDate', order: 'DESC' }}
        filters={<AnnouncementFilter />}
        bulkActions={false}
      >
        <Datagrid>
          <TextField source="name" />
          <FunctionField source="sendDate" render={record => moment(record.sendDate).format('DD/MM/YYYY HH:mm:ss')} />
          <TextField source="shortContent" />
          <ReferenceField source="announcementTypeId" reference="announcementtypes" linkType={false}>
            <TextField source="name" />
          </ReferenceField>
          {/* <ReferenceField source="announcementPriorityId" reference="announcementpriorities" linkType={false}>
            <TextField source="name" />
          </ReferenceField> */}
          {/* <BooleanField source="sendPublic" /> */}
          <ShowButton />
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
};

const enhance = compose(translate, withDataProvider);
export default enhance(ListAnnouncement);
