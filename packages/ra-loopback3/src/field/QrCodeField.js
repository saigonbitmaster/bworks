import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import QRCode from 'qrcode.react';
import sanitizeRestProps from './sanitizeRestProps';

const QrCodeField = ({ className, source, qrSize, record = {}, ...rest }) => {
  return (
    <div className={className} {...sanitizeRestProps(rest)}>
      <QRCode value={get(record, source) || ''} size={qrSize} renderAs="svg" />
    </div>
  );
};

QrCodeField.propTypes = {
  addLabel: PropTypes.bool,
  basePath: PropTypes.string,
  className: PropTypes.string,
  cellClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
  qrSize: PropTypes.any,
};

const PureQrCodeField = QrCodeField;

PureQrCodeField.defaultProps = {
  addLabel: true,
  qrSize: 128,
};

export default PureQrCodeField;
