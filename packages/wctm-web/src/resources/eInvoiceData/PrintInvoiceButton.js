import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Button } from 'ra-loopback3';
import { PrintIcon } from '../../styles/Icons';

class PrintInvoiceButton extends Component {
  render() {
    const { label, children, ...rest } = this.props;
    return (
      <Button label="generic.print" {...rest}>
        <PrintIcon />
      </Button>
    );
  }
}

export default PrintInvoiceButton;
