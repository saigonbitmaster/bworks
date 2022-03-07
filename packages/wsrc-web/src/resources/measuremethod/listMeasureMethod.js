import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  translate,
  TextField,
  List,
  Datagrid,
  EditButton,
  ShowButton,
  SelectField,
  Filter,
  TextInput,
} from 'ra-loopback3';
import { compose } from 'recompose';

const Filters = props => (
  <Filter {...props}>
    <TextInput source="name" label={'generic.search'} alwaysOn />
  </Filter>
);

class ListPartner extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List {...rest} filters={<Filters />} resource="measuremethods">
        <Datagrid>
          <TextField source="name" />
          <TextField source="volRequire" />
          <SelectField
            source="container"
            choices={[{ name: 'P' }, { name: 'G' }, { name: 'P, G' }]}
            translateChoice={true}
            optionText="name"
            optionValue="name"
          />
          <TextField source="preservative" />
          <TextField source="holdingTime" />
          <ShowButton />
          <EditButton />
        </Datagrid>
      </List>
    );
  }
}

ListPartner.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

export default compose(translate)(ListPartner);
