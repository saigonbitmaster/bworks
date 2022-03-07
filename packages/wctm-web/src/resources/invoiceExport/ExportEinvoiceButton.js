import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CUSTOM, Button } from 'ra-loopback3';
import { ExportIcon } from '../../styles/Icons';

class ExportEInvoiceButton extends Component {
  state = {
    disabled: false,
  };

  handleClick = invoiceIssuedDate => {
    const { filterValues, selectedIds, dataProvider } = this.props;
    return dataProvider(CUSTOM, 'EinvoiceData', {
      subUrl: 'createNewEInvoice',
      fullUrl: true,
      method: 'POST',
      body: { filter: filterValues, selectedIds, invoiceIssuedDate },
    });
  };

  render() {
    const { disabled } = this.state;
    const { saving, filterValues, selectedIds, ...rest } = this.props;
    return (
      <Button saving={saving} onClick={this.handleClick} disabled={disabled} {...rest}>
        <ExportIcon />
      </Button>
    );
  }
}

ExportEInvoiceButton.propTypes = {
  dataProvider: PropTypes.func,
  showNotification: PropTypes.func,
  filterValues: PropTypes.object,
  saving: PropTypes.any,
  quarterId: PropTypes.string,
  selectedIds: PropTypes.any,
};

export default ExportEInvoiceButton;
