import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  List,
  Datagrid,
  TextField,
  SFEditButton,
  SFShowButton,
  ReferenceField,
  translate,
  Filter,
  TextInput,
} from 'ra-loopback3';

const GeoDistrictFilter = props => (
  <Filter {...props}>
    <TextInput label={'generic.search'} source="$text.search" alwaysOn />
  </Filter>
);
class GeoDistrictList extends Component {
  render() {
    const { translate, basePath, dispatch, ...rest } = this.props;
    return (
      <List
        {...rest}
        filters={<GeoDistrictFilter />}
        permissionCreateDefault={{ name: 'GeoDistrict', action: 'create' }}
        permissionDeleteDefault={{ name: 'GeoDistrict', action: 'delete' }}
      >
        <Datagrid>
          <TextField source="fullName" />
          <TextField source="code" />
          <TextField source="population" />
          <ReferenceField
            resource="geodistricts"
            basePath={'geocountry'}
            source="countryId"
            reference="geocountries"
            allowEmpty
          >
            <TextField source="name" />
          </ReferenceField>
          <ReferenceField
            resource="geodistricts"
            basePath={'geoprovince'}
            source="provinceId"
            reference="geoprovinces"
            allowEmpty
          >
            <TextField source="name" />
          </ReferenceField>
          <SFShowButton permission={{ name: 'GeoDistrict', action: 'examine' }} />
          <SFEditButton permission={{ name: 'GeoDistrict', action: 'edit' }} />
        </Datagrid>
      </List>
    );
  }
}
GeoDistrictList.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  basePath: PropTypes.any,
  dispatch: PropTypes.any,
};
GeoDistrictList.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const enhance = compose(translate);
export default enhance(GeoDistrictList);
