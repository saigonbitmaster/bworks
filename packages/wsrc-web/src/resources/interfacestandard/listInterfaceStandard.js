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
import config from '../../Config';

const Filters = props => (
  <Filter {...props}>
    <TextInput source="name" label={'generic.search'} alwaysOn />
  </Filter>
);

class ListInterfaceStandard extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List {...rest} filters={<Filters />} resource="interfacestandards">
        <Datagrid>
          <TextField source="name" />
          <SelectField
            source="interfaceStandardType"
            choices={config.interfaceStandardType}
            translateChoice={true}
            optionText="name"
            optionValue="name"
          />
          <TextField source="dataRate" />
          <TextField source="frequency" />
          <TextField source="range" />
          <ShowButton />
          <EditButton />
        </Datagrid>
      </List>
    );
  }
}

ListInterfaceStandard.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

export default compose(translate)(ListInterfaceStandard);
