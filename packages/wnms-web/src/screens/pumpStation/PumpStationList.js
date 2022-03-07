import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ReferenceField,
  NumberField,
  translate,
  TextField,
  List,
  Datagrid,
  EditButton,
  Filter,
  TextInput,
} from 'ra-loopback3';
import { compose } from 'recompose';

const Filters = props => (
  <Filter {...props}>
    <TextInput source="name" label={'generic.search'} alwaysOn />
  </Filter>
);

class PumpStationList extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List {...rest} filters={<Filters />} resource="pumpstations">
        <Datagrid>
          <TextField source="name" />
          <ReferenceField source="factoryId" reference="factories" linkType={false} allowEmpty>
            <TextField source="name" />
          </ReferenceField>
          <NumberField source="designCapacity" />
          <NumberField source="designElectricRate" />
          <EditButton />
        </Datagrid>
      </List>
    );
  }
}

PumpStationList.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

export default compose(translate)(PumpStationList);
