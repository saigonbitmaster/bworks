//tham khảo: https://www.epa.ie/pubs/advice/water/quality/Water_Quality.pdf
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

class ListWaterParameter extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List {...rest} filters={<Filters />} resource="waterparameters">
        <Datagrid>
          <TextField source="name" />
          <TextField source="symbol" />
          <TextField source="measureUnit" />
          <TextField source="normalMethod" />

          <SelectField
            source="waterStage"
            choices={config.waterParameterStage}
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

ListWaterParameter.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

export default compose(translate)(ListWaterParameter);
