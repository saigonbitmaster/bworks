import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlexForm,
  Edit,
  TextInput,
  required,
  translate,
  EditorInput,
  SelectInput,
  ReferenceInput,
  DateTimeInput,
  BooleanInput,
  Datagrid,
  ReferenceManyField,
  Button,
  HtmlField,
  FunctionField,
} from 'ra-loopback3';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import moment from 'moment-timezone';
import ConditionalCreatedPerson from './ConditionalCreatedPerson';

const CreateTicketSupportBodies = ({ record }) => (
  <Button
    label="Trả lời"
    disabled={record.id === undefined || record.isClosed}
    component={Link}
    to={{
      pathname: '/ticketsupport/ticketbody',
      state: { record: { ticketSupportId: record.id } },
    }}
  />
);
CreateTicketSupportBodies.propTypes = {
  record: PropTypes.object,
};

class EditTicketSupport extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { translate, ...rest } = this.props;
    return (
      <Edit {...rest} resource="ticketsupports">
        <FlexForm style={{ flexGrow: 1 }} spacing={2} formRef={this.formRef}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={12}>
              <TextInput fullWidth source="name" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <DateTimeInput disabled={true} source="createdDate" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ConditionalCreatedPerson addLabel="Người tạo" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ReferenceInput source="ticketTypeId" reference="tickettypes">
                <SelectInput optionText="name" />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ReferenceInput source="ticketPriorityId" reference="ticketpriorities">
                <SelectInput optionText="name" />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput source="receiverId" reference="appusers" sortBy="name" validate={[required()]}>
                <SelectInput optionText="name" />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <BooleanInput source="isClosed" defaultValue={false} />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <EditorInput fullWidth source="masterBody" />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <ReferenceManyField label="Chi tiết" fullWidth reference="ticketbodies" target="ticketSupportId">
                <Datagrid>
                  <ConditionalCreatedPerson />
                  <FunctionField
                    source="createdDate"
                    render={record => moment(record.createdDate).format('DD/MM/YYYY HH:mm:ss')}
                  />
                  <HtmlField source="body" />
                </Datagrid>
              </ReferenceManyField>
              <CreateTicketSupportBodies />
            </Grid>
          </Grid>
        </FlexForm>
      </Edit>
    );
  }
}
EditTicketSupport.propTypes = {
  translate: PropTypes.func,
};

EditTicketSupport.detaultProps = {
  hasShow: true,
};
export default compose(translate)(EditTicketSupport);
