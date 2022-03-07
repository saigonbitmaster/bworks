import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ra-loopback3';
import { StopIcon } from '../../styles/Icons';

export default class StopClientButton extends Component {
  static propTypes = {
    stopClients: PropTypes.func,
    selectedIds: PropTypes.array,
  };
  state = { saving: false };
  setSaving = saving => this.setState({ saving });
  render() {
    const { selectedIds, stopClients, ...rest } = this.props;
    return (
      <Button
        saving={this.state.saving}
        onClick={() => stopClients(selectedIds, this.setSaving)}
        label="generic.temporaryStop"
        {...rest}
      >
        <StopIcon />
      </Button>
    );
  }
}
