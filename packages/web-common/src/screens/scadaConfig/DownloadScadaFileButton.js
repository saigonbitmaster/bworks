import React from 'react';
import { withDataProvider, CUSTOM, Button } from 'ra-loopback3';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { compose } from 'recompose';
import { CloudDownload } from '@material-ui/icons';

function DownloadScadaFileButton({ record, dataProvider }) {
  const canvas = get(record, 'meta.canvas[0]', '');
  const handleClick = () => {
    if (canvas) {
      const fileName = canvas.url.split(/(\\|\/)/g).pop();
      return dataProvider(CUSTOM, 'nmsfiles', {
        stream: true,
        method: 'get',
        subUrl: `download/${fileName}`,
        query: { f: canvas.name },
      });
    }
  };
  if (!canvas) return null;
  return (
    <Button label={canvas.name} onClick={handleClick}>
      <CloudDownload />
    </Button>
  );
}

DownloadScadaFileButton.propTypes = {
  record: PropTypes.object,
  dataProvider: PropTypes.func,
};

export default compose(withDataProvider)(DownloadScadaFileButton);
