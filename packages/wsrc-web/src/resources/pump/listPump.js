import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  translate,
  TextField,
  DateField,
  List,
  Datagrid,
  EditButton,
  ShowButton,
  SelectField,
  Filter,
  TextInput,
  ReferenceField,
  NumberField,
} from 'ra-loopback3';
import { compose } from 'recompose';
import config from '../../Config';

const Filters = props => (
  <Filter {...props}>
    <TextInput source="name" label={'generic.search'} alwaysOn />
  </Filter>
);

class ListPump extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List {...rest} filters={<Filters />} resource="pumps">
        <Datagrid>
          <TextField source="name" />
          <SelectField
            source="typeOfPump"
            choices={config.typeOfPump}
            translateChoice={true}
            optionText="name"
            optionValue="id"
          />
          <NumberField source="powerCapacity" />
          <NumberField source="maxHead" />
          <NumberField source="maxFlowRate" />
          <ReferenceField source="waterSourceId" reference="watersources" linkType={false}>
            <TextField source="name" />
          </ReferenceField>
          <DateField source="setupDate" />
          <SelectField
            source="materialStatus"
            choices={config.materialStatus}
            translateChoice={true}
            optionText="name"
            optionValue="id"
          />
          <ShowButton />
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
