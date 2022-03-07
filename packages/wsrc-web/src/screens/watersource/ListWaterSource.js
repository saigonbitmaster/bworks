import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  translate,
  TextField,
  BooleanField,
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

class ListWaterSource extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List {...rest} filters={<Filters />} resource="watersources">
        <Datagrid>
          <TextField source="name" />
          <SelectField
            source="typeOfWaterSource"
            choices={config.typeOfWaterSource}
            translateChoice={true}
            optionText="name"
            optionValue="id"
          />
          <NumberField source="volumeCapacity" />
          <NumberField source="dailyCapacity" />
          <NumberField source="monthlyCapacity" />
          <TextField source="address" />
          <BooleanField source="isBackupSource" />
          <ReferenceField source="waterSourceGroupId" reference="watersourcegroups" linkType={false}>
            <TextField source="name" />
          </ReferenceField>
          <ShowButton />
          <EditButton />
        </Datagrid>
      </List>
    );
  }
}

ListWaterSource.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

export default compose(translate)(ListWaterSource);
