import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  SFEditButton,
  DateField,
  translate,
  NumberField,
} from 'ra-loopback3';

class WaterMaintenanceList extends Component {
  render() {
    const { translate, ...props } = this.props;
    return (
      <List
        hasEdit
        hasCreate
        {...props}
        permissionCreateDefault={{ name: 'WaterMaintenance', action: 'create' }}
        permissionDeleteDefault={{ name: 'WaterMaintenance', action: 'delete' }}
      >
        <Datagrid>
          <ReferenceField reference="dmas" source="dmaId" linkType={false}>
            <TextField source="name" />
          </ReferenceField>
          <DateField source="date" />
          <NumberField source="value" label={translate('resources.watermaintenances.fields.valueList')} />
          <SFEditButton permission={{ name: 'WaterMaintenance', action: 'edit' }} />
        </Datagrid>
      </List>
    );
  }
}

WaterMaintenanceList.propTypes = {
  translate: PropTypes.any,
};

export default compose(translate)(WaterMaintenanceList);
