import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { List, NumberField, Datagrid, TextField, DateField, SFEditButton, translate } from 'ra-loopback3';

const FactoryList = ({ translate, updateView, onUpdateList, ...props }) => (
  <List
    {...props}
    resource="factories"
    title={translate('generic.factory')}
    permissionCreateDefault={{ name: 'Design', action: 'create' }}
    permissionDeleteDefault={{ name: 'Design', action: 'delete' }}
  >
    <Datagrid>
      {/* <ReferenceField label={translate('resources.factories.fields.name')} reference="factories" source="id">
        <TextField source="name" />
      </ReferenceField> */}
      <TextField source="name" />
      <NumberField source="designCapacityDay" textAlign="left" />
      <DateField source="useStartDate" />
      <SFEditButton permission={{ name: 'Design', action: 'edit' }} />
    </Datagrid>
  </List>
);
FactoryList.propTypes = {
  updateView: PropTypes.number,
  onUpdateList: PropTypes.func,
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

FactoryList.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(translate);
export default enhance(FactoryList);
