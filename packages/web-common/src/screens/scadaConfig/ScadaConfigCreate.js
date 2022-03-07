import React from 'react';
import {
  Create,
  FlexForm,
  CustomFileInput,
  TextInput,
  EditorInput,
  translate,
  withDataProvider,
  CUSTOM,
} from 'ra-loopback3';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

function ScadaConfigCreate({ translate, dataProvider, ...props }) {
  const save = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    dataProvider(
      CUSTOM,
      'iotdevices',
      {
        subUrl: 'initDevice',
        method: 'POST',
        body: {
          type: 'SCADA',
          ...record,
        },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };
  return (
    <Create {...props} resource="iotdevices" save={save} redirect="list">
      <FlexForm>
        <TextInput source="name" />
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
    </Create>
  );
}
ScadaConfigCreate.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
};
export default compose(translate, withDataProvider)(ScadaConfigCreate);
