import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate, TextField, List, Datagrid, EditButton, Filter, TextInput, NumberField } from 'ra-loopback3';
import { compose } from 'recompose';

const Filters = props => (
  <Filter {...props}>
    <TextInput source="name" label={'generic.search'} alwaysOn />
  </Filter>
);

class ListPump extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List {...rest} filters={<Filters />} resource="pipes">
        <Datagrid>
          <TextField source="name" />
          <NumberField source="length" textAlign="left" />
          <EditButton />
        </Datagrid>
      </List>
    );
  }
}

ListPump.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

export default compose(translate)(ListPump);
