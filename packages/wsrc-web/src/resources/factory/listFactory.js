import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  translate,
  TextField,
  List,
  Datagrid,
  EditButton,
  ShowButton,
  Filter,
  TextInput,
  NumberField,
} from 'ra-loopback3';
import { compose } from 'recompose';
// import config from '../../Config';

const Filters = props => (
  <Filter {...props}>
    <TextInput source="name" label={'generic.search'} alwaysOn />
  </Filter>
);

class ListFactory extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List {...rest} filters={<Filters />} resource="factories">
        <Datagrid>
          <TextField source="name" />
          <TextField source="dimensions" />
          <NumberField source="capacityDay" />
          <ShowButton />
          <EditButton />
        </Datagrid>
      </List>
    );
  }
}

ListFactory.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

export default compose(translate)(ListFactory);
