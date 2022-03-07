import {
  CustomPage,
  FlexForm,
  NumberInput,
  SaveButton,
  Toolbar,
  withDataProvider,
  withTranslate,
  minValue,
  maxValue,
  URL_ONLY,
} from 'ra-loopback3';
import React, { useState } from 'react';
import { compose } from 'recompose';

// eslint-disable-next-line react/prop-types
function QrGenerate({ translate, dataProvider, ...props }) {
  const [num, setNum] = useState(1000);
  const [saving, setSaving] = useState(false);
  const genQr = ({ quantity }) => {
    setSaving(true);
    dataProvider(URL_ONLY, 'qrcodes', { subUrl: 'generate', query: { quantity } })
      .then(({ data }) => {
        if (data && data.url) {
          window.open(data.url);
        }
      })
      .finally(() => setSaving(false));
  };
  return (
    <CustomPage {...props} title={'generic.pages.qrGenerate'} header={true}>
      <FlexForm
        name="qrcodes"
        save={genQr}
        toolbar={
          <Toolbar>
            <SaveButton saving={saving} label="ra.action.create" />
          </Toolbar>
        }
      >
        <NumberInput
          required
          validate={[minValue(10), maxValue(50000)]}
          defaultValue={num}
          label={translate('resources.qrcodes.fields.quantity')}
          source="quantity"
          name="quantity"
        />
      </FlexForm>
    </CustomPage>
  );
}

export default compose(withTranslate, withDataProvider)(QrGenerate);
