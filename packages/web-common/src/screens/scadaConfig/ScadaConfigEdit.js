import React from 'react';
import {
  Edit,
  FlexForm,
  DisabledInput,
  CustomFileInput,
  withDataProvider,
  translate,
  TextField,
  EditorInput,
} from 'ra-loopback3';
import { compose } from 'recompose';
import PropTypes from 'prop-types';

function ScadaConfigEdit({ translate, dataProvider, ...props }) {
  return (
    <Edit {...props} resource="iotdevices">
      <FlexForm>
        <DisabledInput label="Key" source="id" />
        <TextField source="name" sortable={false} />
        <CustomFileInput
          storage={`nmsfiles`}
          label={translate('ra.tasks.fields.attachedFiles')}
          source="meta.canvas"
          translate={translate}
          dataProvider={dataProvider}
          max={1}
        />
        <EditorInput fullWidth source="description" />
      </FlexForm>
    </Edit>
  );
}
ScadaConfigEdit.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
};
export default compose(translate, withDataProvider)(ScadaConfigEdit);
