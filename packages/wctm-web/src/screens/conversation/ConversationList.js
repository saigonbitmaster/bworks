import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  translate,
  TextField,
  List,
  Datagrid,
  Filter,
  TextInput,
  DateField,
  withDataProvider,
  NumberField,
} from 'ra-loopback3';
import { compose } from 'recompose';

const Filters = props => (
  <Filter {...props}>
    <TextInput source="name" label={'generic.search'} alwaysOn />
  </Filter>
);
class ConversationList extends Component {
  render() {
    const { translate, dataProvider, ...rest } = this.props;
    return (
      <List {...rest} resource="conversations" filters={<Filters />}>
        <Datagrid>
          <TextField source="type" />
          <TextField source="status" />
          <DateField source="startTime" showTime />
          <NumberField source="duration" />
          <TextField source="description" />
        </Datagrid>
      </List>
    );
  }
}

ConversationList.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  dataProvider: PropTypes.func,
};

export default compose(withDataProvider, translate)(ConversationList);
