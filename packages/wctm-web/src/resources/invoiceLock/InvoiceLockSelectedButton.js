import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ra-loopback3';
import { InvoiceLockIcon } from '../../styles/Icons';

class InvoiceLockSelectedButton extends React.Component {
  static propTypes = {
    selectedIds: PropTypes.array,
    lockInvoices: PropTypes.func,
    filterValues: PropTypes.object,
  };
  state = { saving: false };

  setSaving = saving => this.setState({ saving });

  handleClick = () => {
    const { filterValues, selectedIds } = this.props;
    this.props.lockInvoices(filterValues, selectedIds, this.setSaving, {
      createNewEInvoice: true,
    });
  };

  render() {
    const { lockInvoices, filterValues, selectedIds, ...rest } = this.props;
    return (
      <Button
        saving={this.state.saving}
        onClick={this.handleClick}
        label="resources.clients.fields.termCalculation"
        {...rest}
      >
        <InvoiceLockIcon />
      </Button>
    );
  }
}
export default InvoiceLockSelectedButton;
