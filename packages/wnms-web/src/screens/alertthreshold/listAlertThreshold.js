import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  translate,
  TextField,
  List,
  Datagrid,
  EditButton,
  SelectField,
  Filter,
  TextInput,
  FunctionField,
  NumberField,
} from 'ra-loopback3';
import { compose } from 'recompose';
import config from '../../Config';

const Filters = props => (
  <Filter {...props}>
    <TextInput source="name" label={'generic.search'} alwaysOn />
  </Filter>
);

class ListAlertThreshold extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List {...rest} filters={<Filters />} resource="nmsalertthresholds">
        <Datagrid>
          <TextField source="name" />
          <SelectField
            source="alertType"
            choices={config.alertType}
            translateChoice={true}
            optionText="name"
            optionValue="id"
          />
          <SelectField
            source="alertParam"
            choices={config.alertParam}
            translateChoice={true}
            optionText="name"
            optionValue="id"
          />
          <FunctionField
            source="waterParameter"
            render={record => (record.waterParameter ? record.waterParameter.toUpperCase() : '')}
          />
          <NumberField source="alertHigh" />
          <NumberField source="alertCriticalHigh" />
          <NumberField source="alertLow" />
          <NumberField source="alertCriticalLow" />

          <EditButton />
        </Datagrid>
      </List>
    );
  }
}

ListAlertThreshold.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

export default compose(translate)(ListAlertThreshold);
