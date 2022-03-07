import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input } from '@material-ui/core';
import { debounce } from 'lodash';
import QRCode from 'qrcode.react';
import RaCustomInput from './RaCustomInput';

class QrCodeInput extends PureComponent {
  state = {
    qr: '',
  };
  refText = React.createRef();
  renderInput = ({ value, ...props }) => {
    if (this.state.qr !== value) {
      this.updateQrView(value || '');
    }
    return <Input {...props} value={value} />;
  };

  updateQrView = debounce(qr => {
    if (!this.unmount) {
      this.setState({ qr });
    }
  }, 200);

  componentWillUnmount() {
    this.unmount = true;
  }

  render() {
    const { options: rawOptions, inputProps: rawInputProps, qrSize, ...props } = this.props;
    const { qr } = this.state;
    const options = {
      ...rawOptions,
      InputProps: { inputComponent: this.renderInput },
      InputLabelProps: {
        shrink: true,
      },
    };
    const inputProps = {
      ...rawInputProps,
    };
    // let qr = this.state.qr || record[source] || defaultValue || init || '';
    return (
      <Fragment>
        <RaCustomInput {...props} inputProps={inputProps} options={options} />
        <br />
        {qr && <QRCode value={qr} size={qrSize} renderAs="svg" />}
      </Fragment>
    );
  }
}
QrCodeInput.propTypes = {
  record: PropTypes.object,
  source: PropTypes.string,
  qrSize: PropTypes.number,
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,
  init: PropTypes.string,
  options: PropTypes.any,
  inputProps: PropTypes.any,
};
QrCodeInput.defaultProps = {
  qrSize: 128,
};
export default QrCodeInput;
