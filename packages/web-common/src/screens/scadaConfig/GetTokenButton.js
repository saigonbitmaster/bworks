import React from 'react';
import { Button, withDataProvider, CUSTOM } from 'ra-loopback3';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { CloudDownload } from '@material-ui/icons';

function GetTokenButton({ record, dataProvider }) {
  const handleClick = () => {
    // console.log(record, !!dataProvider);
    return dataProvider(CUSTOM, 'iotdevices', {
      stream: true,
      method: 'get',
      subUrl: 'getToken',
      query: { id: record.id },
    });
  };
  return (
    <Button label="generic.getToken" onClick={handleClick}>
      <CloudDownload />
    </Button>
  );
}
GetTokenButton.propTypes = {
  record: PropTypes.object,
  dataProvider: PropTypes.func,
};

export default compose(withDataProvider)(GetTokenButton);
