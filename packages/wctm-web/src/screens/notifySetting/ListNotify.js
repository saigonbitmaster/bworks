import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Datagrid, TextField, Filter, translate, TextInput, EditButton, FunctionField } from 'ra-loopback3';
import compose from 'recompose/compose';

const NotifyFilter = ({ translate, ...rest }) => (
  <Filter {...rest}>
    <TextInput label={'generic.search'} source="name" alwaysOn />
  </Filter>
);
NotifyFilter.propTypes = {
  translate: PropTypes.func,
};
class ListNotify extends Component {
  render() {
    const { translate } = this.props;
    return (
      <List
        {...this.props}
        hasCreate
        hasDelete
        resource="jobsystems"
        filters={<NotifyFilter />}
        filter={{ or: [{ project: 'CTM' }, { project: 'CLI' }] }}
      >
        <Datagrid>
          <TextField source="payload.name" label="resources.notifysetting.fields.name" />
          <FunctionField
            source="status"
            label="resources.notifysetting.fields.status"
            render={record => translate(`resources.notifysetting.status.${record.status}`)}
          />
          <FunctionField
            source="type"
            label="resources.notifysetting.fields.type"
            render={record => translate(`resources.notifysetting.typeChoice.${record.type}`)}
          />
          <TextField source="repeat.description" label="resources.notifysetting.fields.repeatDescription" />
          <EditButton />
        </Datagrid>
      </List>
    );
  }
}
ListNotify.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

ListNotify.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default compose(translate)(ListNotify);
