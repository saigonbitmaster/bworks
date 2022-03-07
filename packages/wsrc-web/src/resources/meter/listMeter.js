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
} from 'ra-loopback3';
import { compose } from 'recompose';
import config from '../../Config';

const Filters = props => (
  <Filter {...props}>
    <TextInput source="name" label={'generic.search'} alwaysOn />
  </Filter>
);

class ListMeter extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List {...rest} filters={<Filters />} resource="meters">
        <Datagrid>
          <TextField source="name" />
          <TextField source="size" />
          <TextField source="flowRate" />
          <DateField source="setupDate" />
          <SelectField
            source="environmentalRating"
            choices={config.environmentalRating}
            translateChoice={true}
            optionText="name"
            optionValue="name"
          />
          <ReferenceField source="waterSourceId" reference="watersources" linkType={false}>
            <TextField source="name" />
          </ReferenceField>
          <ReferenceField source="dataLoggerId" reference="dataloggers" linkType={false}>
            <TextField source="name" />
          </ReferenceField>
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

ListMeter.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

export default compose(translate)(ListMeter);
