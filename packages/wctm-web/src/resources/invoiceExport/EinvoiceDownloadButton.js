import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CUSTOM, Button } from 'ra-loopback3';
import { ExportIcon } from '../../styles/Icons';

class ExportEInvoiceButton extends Component {
  state = {
    disabled: false,
  };

  componentDidMount() {
    const { data, selectedIds } = this.props;
    const okIds = [];
    // Check if selected records did use water and have einvoice (or invoice)
    if (selectedIds) {
      for (let id of selectedIds) {
        if (data[id] && data[id].clientMeterNumber.totalWaterUsed > 0 && data[id].einvoice) {
          okIds.push(true);
        }
      }
      const disabled = okIds.length !== selectedIds.length;
      this.setState({ disabled });
    }
  }

  componentDidUpdate = prevProps => {
    if (prevProps.selectedIds !== this.props.selectedIds) {
      const { data, selectedIds } = this.props;
      const okIds = [];
      // Check if selected records did use water and have einvoice (or invoice)
      if (selectedIds) {
        for (let id of selectedIds) {
          if (data[id] && data[id].clientMeterNumber.totalWaterUsed > 0 && data[id].einvoice) {
            okIds.push(true);
          }
        }
        const disabled = okIds.length !== selectedIds.length;
        this.setState({ disabled });
      }
    }
  };

  handleClick = () => {
    const { filterValues, selectedIds, dataProvider } = this.props;
    return dataProvider(CUSTOM, 'EinvoiceData', {
      subUrl: 'downloadEinvoice',
      fullUrl: true,
      method: 'GET',
      stream: 'file',
      query: { filterValues: JSON.stringify({ where: filterValues }), selectedIds },
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
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  saving: PropTypes.any,
  data: PropTypes.object,
};

export default ExportEInvoiceButton;
