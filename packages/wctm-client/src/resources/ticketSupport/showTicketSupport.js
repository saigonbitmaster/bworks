import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import moment from 'moment-timezone';
import {
  Show,
  HtmlField,
  TextField,
  translate,
  ReferenceField,
  ReferenceManyField,
  FunctionField,
  BooleanField,
  Datagrid,
  FlexForm,
} from 'ra-loopback3';

import CreateTicketSupportBodies from './createTicketSupportBody';
import ConditionalCreatedPerson from './ConditionalCreatedPerson';

// const ConditionalCreatedPerson = ({ record, ...rest }) =>
//     record && record.isAdmin
//         ?
//         (
//             <ReferenceField  reference="appusers" record={record} {...rest}>
//             <TextField source="fullName" />
//           </ReferenceField>
//         )
//         :
//         (
//         <ReferenceField reference="clientusers" record={record} {...rest}>
//           <TextField source="name" />
//         </ReferenceField>
// );

class TicketSupportShow extends Component {
  render() {
    const { translate, dispatch, ...rest } = this.props;
    return (
      <Show {...rest}>
        <FlexForm toolbar={false} style={{ flexGrow: 1 }} spacing={2} formRef={this.formRef}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={12}>
              <TextField source="name" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <FunctionField
                source="createdDate"
                render={record => moment(record.createdDate).format('DD/MM/YYYY HH:mm:ss')}
              />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ConditionalCreatedPerson addLabel="Người tạo" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ReferenceField source="ticketTypeId" reference="tickettypes" linkType={false}>
                <TextField source="name" />
              </ReferenceField>
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ReferenceField source="ticketPriorityId" reference="ticketpriorities" linkType={false}>
                <TextField source="name" />
              </ReferenceField>
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <BooleanField source="isClosed" />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <HtmlField source="masterBody" />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <ReferenceManyField label="Chi tiết" fullWidth reference="ticketbodies" target="ticketSupportId">
                <Datagrid sort={{ field: 'createdDate', order: 'DESC' }}>
                  <ConditionalCreatedPerson />
                  <FunctionField
                    source="createdDate"
                    render={record => moment(record.createdDate).format('DD/MM/YYYY HH:mm:ss')}
                  />
                  <HtmlField source="body" />
                </Datagrid>
              </ReferenceManyField>
            </Grid>
            <Grid middle item xs={12} sm={12} align-items-xs-flex-end>
              <CreateTicketSupportBodies translate={translate} />
            </Grid>
          </Grid>
        </FlexForm>
      </Show>
    );
  }
}

TicketSupportShow.propTypes = {
  translate: PropTypes.any,
  dispatch: PropTypes.any,
};

TicketSupportShow.detaultProps = {
  hasShow: true,
};
const enhance = compose(translate);
export default enhance(TicketSupportShow);
