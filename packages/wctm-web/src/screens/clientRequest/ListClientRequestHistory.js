import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Datagrid, TextField, ReferenceField, FunctionField, translate, DateField } from 'ra-loopback3';
import compose from 'recompose/compose';
import { formatTypeRequest, formatClientAction } from '../../../src/util/formatShow';

class ListClientRequest extends Component {
  listController = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      clientId: props.match.params.clientId,
    };
  }
  render() {
    const { clientId } = this.state;
    return (
      <List
        {...this.props}
        refController={this.listController}
        filter={{ clientId: clientId }}
        resource="clientrequests"
        bulkActionButtons={false}
      >
        <Datagrid>
          <ReferenceField
            reference="clients"
            source="clientId"
            basePath="clients"
            allowEmpty
            linkType={false}
            label="resources.clients.fields.code"
          >
            <TextField source="code" />
          </ReferenceField>
          <ReferenceField reference="clients" source="clientId" basePath="clients" allowEmpty linkType={false}>
            <TextField source="name" />
          </ReferenceField>
          <FunctionField
            source="type"
            render={record => {
              return formatTypeRequest(this.props.translate, record.type);
            }}
          />
          <FunctionField
            source="status"
            render={record => {
              return formatClientAction(this.props.translate, record.status);
            }}
          />
          <ReferenceField reference="installationteams" source="installationTeamId" allowEmpty linkType={false}>
            <TextField source="name" />
          </ReferenceField>
          <DateField source="setupDate" />
        </Datagrid>
      </List>
    );
  }
}
ListClientRequest.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

ListClientRequest.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default compose(translate)(ListClientRequest);
