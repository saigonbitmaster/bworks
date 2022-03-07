import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  List,
  Datagrid,
  TextField,
  SFEditButton,
  ReferenceField,
  SFShowButton,
  translate,
  Filter,
  TextInput,
} from 'ra-loopback3';

const GeoQuarterFilter = props => (
  <Filter {...props}>
    <TextInput label={'generic.search'} source="$text.search" alwaysOn />
  </Filter>
);
class GeoQuarterList extends Component {
  render() {
    const { translate, basePath, dispatch, ...rest } = this.props;
    return (
      <List
        title={translate('resources.geoquarters.list')}
        {...rest}
        filters={<GeoQuarterFilter />}
        permissionCreateDefault={{ name: 'GeoQuarter', action: 'create' }}
      >
        <Datagrid>
          <TextField source="fullName" />
          <TextField source="code" />
          <ReferenceField
            resource="geoquarters"
            basePath={'geoprovince'}
            source="provinceId"
            reference="geoprovinces"
            allowEmpty
          >
            <TextField source="name" />
          </ReferenceField>
          <ReferenceField
            resource="geoquarters"
            basePath={'geodistrict'}
            source="districtId"
            reference="geodistricts"
            allowEmpty
          >
            <TextField source="name" />
          </ReferenceField>
          <ReferenceField resource="geoquarters" basePath={'geoward'} source="wardId" reference="geowards" allowEmpty>
            <TextField source="name" />
          </ReferenceField>
          <SFShowButton permission={{ name: 'GeoQuarter', action: 'examine' }} />
          <SFEditButton permission={{ name: 'GeoQuarter', action: 'edit' }} />
        </Datagrid>
      </List>
    );
  }
}
GeoQuarterList.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  basePath: PropTypes.any,
  dispatch: PropTypes.any,
};
GeoQuarterList.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const enhance = compose(translate);
export default enhance(GeoQuarterList);
