import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  EditButton,
  ShowButton,
  translate,
  Filter,
  TextInput,
} from 'ra-loopback3';

const GeoProvinceFilter = props => (
  <Filter {...props}>
    <TextInput label={'generic.search'} source="$text.search" alwaysOn />
  </Filter>
);
class GeoProvinceList extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List title={translate('resources.geoprovinces.list')} {...rest} filters={<GeoProvinceFilter />}>
        <Datagrid>
          <TextField source="fullName" />
          <TextField source="code" />
          <ReferenceField
            resource="geoprovinces"
            basePath={'geocountry'}
            source="countryId"
            reference="geocountries"
            allowEmpty
          >
            <TextField source="name" />
          </ReferenceField>
          <ShowButton />
          <EditButton />
        </Datagrid>
      </List>
    );
  }
}
GeoProvinceList.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  basePath: PropTypes.any,
  dispatch: PropTypes.any,
};
GeoProvinceList.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const enhance = compose(translate);
export default enhance(GeoProvinceList);
