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
  DateField,
  FunctionField,
  ReferenceField,
} from 'ra-loopback3';
import { compose } from 'recompose';
import config from '../../Config';

const Filters = props => (
  <Filter {...props}>
    <TextInput source="name" label={'generic.search'} alwaysOn />
  </Filter>
);

class ListDataLogger extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List {...rest} filters={<Filters />} resource="dataloggers">
        <Datagrid>
          <TextField source="name" />
          <TextField source="memoryStorage" />
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
          <DateField source="lastChargeBattery" />
          <ReferenceField allowEmpty source="waterSourceId" reference="watersources" linkType={false}>
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

ListDataLogger.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

export default compose(translate)(ListDataLogger);
