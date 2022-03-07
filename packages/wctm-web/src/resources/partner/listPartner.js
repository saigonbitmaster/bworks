import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  translate,
  TextField,
  List,
  Datagrid,
  SFEditButton,
  SFShowButton,
  SelectField,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
  Filter,
  TextInput,
  SelectInput,
} from 'ra-loopback3';
import { compose } from 'recompose';
import config from '../../Config';

const Filters = props => (
  <Filter {...props}>
    <TextInput source="name" label={'generic.search'} alwaysOn />
    <SelectInput source="providerType" choices={config.partnerType} translateChoice={true} />
  </Filter>
);

class ListPartner extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List
        {...rest}
        filters={<Filters />}
        permissionCreateDefault={{ name: 'Partner', action: 'create' }}
        permissionDeleteDefault={{ name: 'Partner', action: 'delete' }}
      >
        <Datagrid>
          <TextField source="name" />
          <ReferenceArrayField reference="dmas" source="dmaIds">
            <SingleFieldList>
              <ChipField source="name" />
            </SingleFieldList>
          </ReferenceArrayField>
          <SelectField
            source="providerType"
            choices={config.partnerType}
            translateChoice={true}
            optionText="name"
            optionValue="id"
          />
          <TextField source="contactPerson" />
          <SFShowButton permission={{ name: 'Partner', action: 'examine' }} />
          <SFEditButton permission={{ name: 'Partner', action: 'edit' }} />
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
