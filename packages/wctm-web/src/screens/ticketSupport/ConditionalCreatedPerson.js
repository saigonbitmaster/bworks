import React from 'react';
import PropTypes from 'prop-types';
import { TextField, ReferenceField } from 'ra-loopback3';

const ConditionalCreatedPerson = ({ record, ...rest }) =>
  record && record.isAdmin ? (
    <ReferenceField source="appUserId" reference="appusers" record={record} {...rest} allowEmpty linkType={false}>
      <TextField source="fullName" />
    </ReferenceField>
  ) : (
    <ReferenceField source="clientUserId" reference="clientusers" record={record} {...rest} allowEmpty linkType={false}>
      <TextField source="name" />
    </ReferenceField>
  );

ConditionalCreatedPerson.propTypes = {
  record: PropTypes.object,
};

ConditionalCreatedPerson.defaultProps = { label: 'resources.ticketsupports.fields.createdPerson' };
export default ConditionalCreatedPerson;
