import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ra-loopback3';
import { ResumeIcon } from '../../styles/Icons';

export default class ResumeClientButton extends Component {
  static propTypes = {
    resumeClients: PropTypes.func,
    selectedIds: PropTypes.array,
  };
  state = { saving: false };
  setSaving = saving => this.setState({ saving });
  render() {
    const { selectedIds, resumeClients, ...rest } = this.props;
    return (
      <Button
        saving={this.state.saving}
        onClick={() => resumeClients(selectedIds, this.setSaving)}
        label="generic.resume"
        {...rest}
      >
        <ResumeIcon />
      </Button>
    );
  }
}
