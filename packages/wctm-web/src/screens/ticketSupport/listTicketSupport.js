import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  Filter,
  FunctionField,
  translate,
  TextInput,
  ReferenceInput,
  ReferenceField,
  SelectInput,
  Button,
  SFShowButton,
} from 'ra-loopback3';
import moment from 'moment-timezone';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import ConditionalCreatedPerson from './ConditionalCreatedPerson';
import { AnswerIcon } from '../../styles/Icons';

const CreateTicketSupportBodies = ({ record, translate }) => (
  <Button
    label={translate('generic.answerButtonLable')}
    disabled={record.id === undefined || record.isClosed}
    component={Link}
    to={{
      pathname: '/ticketsupport/ticketbody',
      state: { record: { ticketSupportId: record.id } },
    }}
  >
    <AnswerIcon />
  </Button>
);
CreateTicketSupportBodies.propTypes = {
  record: PropTypes.object,
  translate: PropTypes.func,
};

const TicketFilter = props => {
  return (
    <Filter {...props}>
      <TextInput source="name" label={'generic.search'} alwaysOn />
      <ReferenceInput source="ticketTypeId" reference="tickettypes">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ReferenceInput source="ticketPriorityId" reference="ticketpriorities">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ReferenceInput source="clientUserId" reference="clientusers">
        <SelectInput optionText="username" />
      </ReferenceInput>
    </Filter>
  );
};
class ListTicketSupport extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List
        {...rest}
        resource="ticketsupports"
        sort={{ field: 'createdDate', order: 'DESC' }}
        filters={<TicketFilter />}
        hasCreate={false}
        bulkActionButtons={false}
      >
        <Datagrid>
          <TextField source="name" />
          <FunctionField
            source="createdDate"
            render={record => moment(record.createdDate).format('DD/MM/YYYY HH:mm:ss')}
          />
          <ConditionalCreatedPerson sortBy="clientUserId" />
          <ReferenceField source="ticketTypeId" reference="ticketTypes" linkType={false}>
            <TextField source="name" />
          </ReferenceField>
          <ReferenceField source="ticketPriorityId" reference="ticketPriorities" linkType={false}>
            <TextField source="name" />
          </ReferenceField>
          <BooleanField source="isClosed" />
          {/* <SFEditButton permission={{ name: 'TicketSupport', action: 'edit' }} /> */}
          <SFShowButton permission={{ name: 'TicketSupport', action: 'examine' }} />
          <CreateTicketSupportBodies translate={translate} permission={{ name: 'TicketSupport', action: 'answer' }} />
        </Datagrid>
      </List>
    );
  }
}
ListTicketSupport.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  filters: PropTypes.any,
};

ListTicketSupport.detaultProps = {
  hasList: true,
  hasShow: false,
  hasCreate: true,
  hasEdit: true,
};

export default compose(translate)(ListTicketSupport);
