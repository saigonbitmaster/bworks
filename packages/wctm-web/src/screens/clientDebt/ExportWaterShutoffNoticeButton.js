import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ra-loopback3';
import { PrintIcon } from '../../styles/Icons';

export default class StopClientButton extends Component {
  static propTypes = {
    exportWaterShutoffNotice: PropTypes.func,
    selectedIds: PropTypes.array,
  };

  state = { saving: false };
  setSaving = saving => this.setState({ saving });
  render() {
    const { selectedIds, exportWaterShutoffNotice, ...rest } = this.props;
    return (
      <Button
        saving={this.state.saving}
        onClick={() => exportWaterShutoffNotice(selectedIds, this.setSaving)}
        label="generic.exportWaterShutoffNotice"
        {...rest}
      >
        <PrintIcon />
      </Button>
    );
  }
}
