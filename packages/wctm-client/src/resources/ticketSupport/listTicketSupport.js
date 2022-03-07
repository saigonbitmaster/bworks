import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  EditButton,
  Filter,
  FunctionField,
  translate,
  TextInput,
  ReferenceInput,
  ReferenceField,
  SelectInput,
  Button,
  ShowButton,
  Storage,
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
        fixUrl="ticketsupports/getSecuredTicketSupport"
      >
        <Datagrid>
          <TextField source="name" />
          <FunctionField
            source="createdDate"
            render={record => moment(record.createdDate).format('DD/MM/YYYY HH:mm:ss')}
          />
          <ConditionalCreatedPerson sortBy="clientUserId" />
          <ReferenceField source="ticketTypeId" reference="tickettypes" linkType={false}>
            <TextField source="name" />
          </ReferenceField>
          <ReferenceField source="ticketPriorityId" reference="ticketpriorities" linkType={false}>
            <TextField source="name" />
          </ReferenceField>
          <BooleanField source="isClosed" />
          <EditButton />
          <CreateTicketSupportBodies translate={translate} />
          <ShowButton />
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
