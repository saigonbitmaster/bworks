import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlexForm,
  Create,
  TextInput,
  required,
  translate,
  SelectInput,
  EditorInput,
  ReferenceInput,
  DateTimeInput,
  BooleanInput,
  Storage,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';

const DefaultValue = { createdDate: new Date(), clientUserId: Storage.getUser().userId, isAdmin: false };

class CreateTicketSupport extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { ...props } = this.props;
    return (
      <Create {...props} resource="ticketsupports">
        <FlexForm style={{ flexGrow: 1 }} spacing={2} redirect="list" defaultValue={DefaultValue}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateTimeInput disabled={true} source="createdDate" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput disabled={true} source="clientUserId" reference="clientusers" validate={[required()]}>
                <SelectInput optionText="name" />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput source="ticketTypeId" reference="tickettypes" validate={[required()]}>
                <SelectInput optionText="name" />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput source="ticketPriorityId" reference="ticketpriorities" validate={[required()]}>
                <SelectInput optionText="name" />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <BooleanInput source="isClosed" defaultValue={false} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput source="receiverId" reference="appusers" validate={[required()]}>
                <SelectInput optionText="fullName" />
              </ReferenceInput>
            </Grid>

            <Grid middle item xs={12} sm={12}>
              <EditorInput fullWidth source="masterBody" validate={[required()]} />
            </Grid>
          </Grid>
        </FlexForm>
      </Create>
    );
  }
}
CreateTicketSupport.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
};
CreateTicketSupport.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
export default compose(translate)(CreateTicketSupport);
