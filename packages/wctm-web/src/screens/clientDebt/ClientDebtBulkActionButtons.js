import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import StopClientButton from './StopClientButton';
import ResumeClientButton from './ResumeClientButton';
import ExportWaterShutoffNoticeButton from './ExportWaterShutoffNoticeButton';

export default class ClientDebtBulkActionButtons extends Component {
  static propTypes = {
    selectedIds: PropTypes.array,
    stopClients: PropTypes.func,
    resumeClients: PropTypes.func,
    exportWaterShutoffNotice: PropTypes.func,
  };

  render() {
    const { exportWaterShutoffNotice, stopClients, resumeClients, selectedIds } = this.props;
    return (
      <Fragment>
        <ExportWaterShutoffNoticeButton
          exportWaterShutoffNotice={exportWaterShutoffNotice}
          selectedIds={selectedIds}
          permission={{ name: 'clientDebt', action: 'exportWaterShutoffNotice' }}
        />

        <StopClientButton
          stopClients={stopClients}
          selectedIds={selectedIds}
          permission={{ name: 'clientDebt', action: 'stop' }}
        />
        <ResumeClientButton
          resumeClients={resumeClients}
          selectedIds={selectedIds}
          permission={{ name: 'clientDebt', action: 'resume' }}
        />
      </Fragment>
    );
  }
}
