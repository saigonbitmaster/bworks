import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, FunctionField } from 'ra-loopback3';
import PropTypes from 'prop-types';
import GetTokenButton from './GetTokenButton';
// import { get } from 'lodash';
import DownloadScadaFileButton from './DownloadScadaFileButton';

// const Filters = props => (
//   <Filter {...props}>
//     <TextInput label="Search" source="name" alwaysOn />
//   </Filter>
// );
export default function ScadaConfigList({ ...rest }) {
  return (
    <List
      bulkActions={false}
      {...rest}
      // filters={<Filters />}
      filter={{ type: 'SCADA', $fields: { id: true, name: true, meta: true } }}
      resource="iotdevices"
    >
      <Datagrid>
        <TextField label="Key" source="id" sortable={true} />
        <TextField source="name" sortable={false} />
        <FunctionField label="File" render={record => <DownloadScadaFileButton record={record} />} sortable={false} />
        <GetTokenButton />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
}
ScadaConfigList.propTypes = {
  title: PropTypes.string,
};
ScadaConfigList.defaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: true,
  hasEdit: false,
};
