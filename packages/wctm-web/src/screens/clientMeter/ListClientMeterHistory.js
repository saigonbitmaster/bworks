import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Datagrid, NumberField, DateField, translate, FunctionField } from 'ra-loopback3';

@translate
export default class ListClientMeterHistory extends Component {
  static propTypes = {
    match: PropTypes.object,
    translate: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      clientId: this.props.match.params.clientId,
    };
  }
  formatType = type => {
    return this.props.translate(`resources.clientmeterhistories.types.${type || 'NEW'}`);
  };

  render() {
    const { translate, ...rest } = this.props;
    const { clientId } = this.state;
    return (
      <List {...rest} resource="clientmeterhistories" bulkActionButtons={false} filter={{ clientId }}>
        <Datagrid>
          <FunctionField
            label="resources.clients.fields.status"
            source="status"
            render={record => {
              return this.formatType(record.type);
            }}
          />
          <NumberField source="oldMeterNumber" />
          <NumberField source="newMeterNumber" />
          {/* <ReferenceField source="creatorId" reference="appusers" allowEmpty linkType={false}>
            <TextField source="name" />
          </ReferenceField> */}
          <DateField source="setupDate" />
        </Datagrid>
      </List>
    );
  }
}
