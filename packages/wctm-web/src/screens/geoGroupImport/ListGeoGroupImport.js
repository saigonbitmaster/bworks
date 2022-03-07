import React, { Component } from 'react';
import {
  List,
  TextField,
  ReferenceManyField,
  SingleFieldList,
  ChipField,
  withDataProvider,
  Datagrid,
} from 'ra-loopback3';

import GeoGroupEditButton from './GeoGroupEditButton';
import GeoGroupCreateButton from './GeoGroupCreateButton';

@withDataProvider
class ListGeoGroupImport extends Component {
  render() {
    const { dataProvider, ...rest } = this.props;
    return (
      <List
        {...rest}
        resources={'geogroups'}
        extActions={<GeoGroupCreateButton />}
        permissionDeleteDefault={{ name: 'importGeoGroup', action: 'delete' }}
      >
        <Datagrid>
          <TextField label="resources.importgeogroups.fields.waterstation" source="name" />
          <ReferenceManyField
            label="resources.importgeogroups.fields.quartersInCharged"
            reference="geoquarters"
            basePath="geoQuarter"
            target="geoGroupId"
          >
            <SingleFieldList>
              <ChipField source="name" />
            </SingleFieldList>
          </ReferenceManyField>
          <GeoGroupEditButton />
        </Datagrid>
      </List>
    );
  }
}

export default ListGeoGroupImport;
