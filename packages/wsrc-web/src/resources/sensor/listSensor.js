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
  FunctionField,
} from 'ra-loopback3';
import { compose } from 'recompose';
import config from '../../Config';

const Filters = props => (
  <Filter {...props}>
    <TextInput source="name" label={'generic.search'} alwaysOn />
  </Filter>
);

class ListWaterStandard extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List {...rest} filters={<Filters />} resource="sensors">
        <Datagrid>
          <TextField source="name" />
          <SelectField
            source="typeOfSensor"
            choices={config.typeOfSensor}
            translateChoice={true}
            optionText="name"
            optionValue="id"
          />
          <DateField source="setupDate" />
          <SelectField
            source="environmentalRating"
            choices={config.environmentalRating}
            translateChoice={true}
            optionText="name"
            optionValue="name"
          />
          <FunctionField
            source="powerSource"
            render={record =>
              record.powerSource && record.powerSource.map(item => <li key={item.id}>{translate(item)}</li>)
            }
          />
          <ReferenceField source="waterSourceId" reference="watersources" basePath="watersource" linkType={false}>
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

ListWaterStandard.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

export default compose(translate)(ListWaterStandard);
