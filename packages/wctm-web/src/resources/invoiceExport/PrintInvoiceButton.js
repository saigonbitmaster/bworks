/* eslint-disable react/prop-types */
import { Button, PrintConfirmation, withDataProvider } from 'ra-loopback3';
// import { PrintConfirmation } from 'ra-loopback3';
import React, { Fragment, useCallback, useMemo, useState } from 'react';
import compose from 'recompose/compose';
import { PrintIcon } from '../../styles/Icons';

function RawPrintInvoiceButton({ record, dataProvider, width = 576, mode = 'raw' }) {
  const [url, setUrl] = useState('');
  const onClick = useCallback(async () => {
    const { data } = await dataProvider('URL_ONLY', 'ClientMeterNumbers', {
      subUrl: 'exportInvoiceNoticeByMeterNumberId',
      query: { meterNumberId: record.clientMeterNumber._id },
    });
    setUrl(data.url);
  }, [record]);
  const onFinish = () => {
    console.log('finish');
    setUrl('');
  };
  return (
    <Fragment>
      <Button onClick={onClick} disabled={!record.einvoice}>
        <PrintIcon />
      </Button>
      {url && <PrintConfirmation key={url} id={record.clientMeterNumber._id} content={url} onFinish={onFinish} />}
    </Fragment>
  );
}

const PrintInvoiceButton = compose(withDataProvider)(RawPrintInvoiceButton);

export default PrintInvoiceButton;
