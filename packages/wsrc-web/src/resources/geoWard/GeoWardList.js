import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  ShowButton,
  ReferenceField,
  translate,
  Filter,
  TextInput,
} from 'ra-loopback3';

const GeoWardFilter = props => (
  <Filter {...props}>
    <TextInput label={'generic.search'} source="$text.search" alwaysOn />
  </Filter>
);
class GeoWardList extends Component {
  render() {
    const { translate, basePath, dispatch, ...rest } = this.props;
    return (
      <List title={translate('resources.geowards.list')} {...rest} filters={<GeoWardFilter />}>
        <Datagrid>
          <TextField source="fullName" />
          <TextField source="code" />
          <ReferenceField
            resource="geowards"
            basePath={'geoprovince'}
            source="provinceId"
            reference="geoprovinces"
            allowEmpty
          >
            <TextField source="name" />
          </ReferenceField>
          <ReferenceField
            resource="geowards"
            basePath={'geodistrict'}
            source="districtId"
            reference="geodistricts"
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
GeoWardList.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  basePath: PropTypes.any,
  dispatch: PropTypes.any,
};
GeoWardList.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const enhance = compose(translate);
export default enhance(GeoWardList);
