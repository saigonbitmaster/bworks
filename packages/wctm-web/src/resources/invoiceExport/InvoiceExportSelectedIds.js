import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ra-loopback3';
import { PrintIcon } from '../../styles/Icons';

class InvoiceExportSelectedIds extends Component {
  state = { saving: false };
  static propTypes = {
    selectedIds: PropTypes.array,
    refreshView: PropTypes.func,
    exportInvoices: PropTypes.func,
    filterValues: PropTypes.object,
  };
  setSaving = saving => this.setState({ saving });

  render() {
    const { filterValues, selectedIds, basePath, exportInvoices, ...rest } = this.props;
    return (
      <Button
        saving={this.state.saving}
        onClick={() => this.props.exportInvoices(filterValues, selectedIds, this.setSaving)}
        label="generic.printSelectedInvoice"
        {...rest}
      >
        <PrintIcon />
      </Button>
    );
  }
}

export default InvoiceExportSelectedIds;
