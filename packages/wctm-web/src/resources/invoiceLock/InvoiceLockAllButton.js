import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import { Button, GET_ONE, refreshView } from 'ra-loopback3';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { InvoiceLockIcon } from '../../styles/Icons';

class InvoiceLockAllButton extends PureComponent {
  state = { saving: false, jobId: '' };
  setSaving = saving => this.setState({ saving });
  handleClick = () => {
    const { filterValues, lockInvoices } = this.props;
    lockInvoices(filterValues, [], this.setSaving, { createNewEInvoice: true }).then(res => {
      const jobId = get(res, 'data.jobId', '');
      if (jobId) {
        this.safeSetState({ jobId });
        this.checkProgress();
      }
    });
  };
  checkProgress = debounce(async () => {
    if (this.unmount) return;
    const { dataProvider, refreshView } = this.props;
    const { jobId } = this.state;
    if (!jobId) return;
    dataProvider(GET_ONE, 'backgroundjobs', { id: jobId })
      .then(res => {
        const record = get(res, 'data', null);
        if (record) {
          if (record.status === 'FINISH') {
            this.safeSetState({ jobId: '' });
            refreshView();
          } else {
            this.checkProgress();
          }
        } else {
          this.safeSetState({ jobId: '' });
        }
      })
      .catch(() => {
        this.safeSetState({ jobId: '' });
      });
  }, 5000);

  safeSetState = state => {
    if (!this.unmount) {
      this.setState(state);
    }
  };
  componentWillUnmount() {
    this.unmount = true;
  }
  render() {
    const { dataProvider, filterValues, selectedIds, lockInvoices, ...rest } = this.props;
    const { saving, jobId } = this.state;
    const disabled =
      filterValues.termInvoice && moment(filterValues.termMeterNumber).diff(filterValues.termInvoice, 'month') <= 0;
    return (
      <Button
        disabled={disabled}
        saving={saving || !!jobId}
        onClick={this.handleClick}
        label={jobId ? 'generic.messages.inProgress' : 'resources.clients.fields.termCalculations'}
        {...rest}
      >
        <InvoiceLockIcon />
      </Button>
    );
  }
}
InvoiceLockAllButton.propTypes = {
  lockInvoices: PropTypes.func,
  dataProvider: PropTypes.func,
  filterValues: PropTypes.object,
  selectedIds: PropTypes.any,
  refreshView: PropTypes.func,
};

export default compose(connect(null, { refreshView }))(InvoiceLockAllButton);
