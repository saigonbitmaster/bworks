import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose } from 'recompose';
import { Button, withDataProvider } from 'ra-loopback3';
import moment from 'moment-timezone';
import get from 'lodash/get';
import { WriteMeterNumberIcon, AddIcon } from '../../styles/Icons';

const FORMAT_TIME = 'YYYY-MM';
@withDataProvider
class WriteMeterNumberButton extends Component {
  onClick = async writeNew => {
    // to={linkToRecord(basePath, record.id)}
    const { basePath, record } = this.props;
    // build id number record
    // check last number meter record
    let id = '';
    if (record.termMeterNumber) {
      if (writeNew) {
        // create new month = old month + 1
        let nextMonth = moment(record.termMeterNumber)
          .add(1, 'month')
          .startOf('month');
        let currentMonthYear = nextMonth.format(FORMAT_TIME);
        this.props.push(`${basePath}/createWithMonth/${record.id}/${currentMonthYear}`);
      } else {
        // edit edit current month
        let month = moment(record.termMeterNumber);
        id = `${record.id}-${month.format(FORMAT_TIME)}`;
        this.props.push(`${basePath}/editClientMeterNumber/edit/${id}`);
      }
    } else {
      // do nothing
      // should use modal to alert
      this.props.push(basePath);
    }
  };

  render() {
    const {
      record: { lastTimeMeterNumberUpdate, termMeterNumber, status, startMeterDate },
      basePath,
      push,
      refFilter,
      myAccess,
      disableEinvoiceExport,
      ...rest
    } = this.props;
    if (!refFilter.current) return null;
    let selectedMonth = moment(get(refFilter, 'current.props.values.termMeterNumber'));
    let currentMonth = moment().startOf('month');
    let disabled =
      currentMonth < selectedMonth ||
      status != 'ACTIVE' ||
      !startMeterDate ||
      selectedMonth.diff(moment(startMeterDate).startOf('month'), 'month') <= 0 ||
      selectedMonth.diff(moment(lastTimeMeterNumberUpdate).startOf('month'), 'month') > 1 ||
      moment(termMeterNumber).isAfter(selectedMonth, 'month');

    let writeNew = moment(termMeterNumber).isBefore(selectedMonth, 'month');

    const apiRoutes = Object.keys(myAccess.apiPath || {}).map(path => path.slice(path.lastIndexOf('/') + 1));
    const permission = {
      name: 'clientMeterNumber',
      action: apiRoutes.includes('forceUpdateMonth') ? 'forceEditWriteWater' : 'editWriteWater',
    };

    if (!writeNew) {
      // Check current user's permission to update month
      // If `forceUpdateMonth` is not permitted, disable the button
      // Else, allow it
      disabled = false; // temporary allow all
      // if (!apiRoutes.includes('forceUpdateMonth')) {
      //   disabled = true;
      // }
      if (myAccess.type === 'master') {
        disabled = false;
      }
    }

    let label = writeNew ? 'generic.writeMeterNumber' : 'generic.edit';

    disabled = label === 'generic.edit' && !disableEinvoiceExport ? disableEinvoiceExport : disabled;

    return (
      <Button
        disabled={disabled}
        onClick={() => this.onClick(writeNew)}
        label={label}
        permission={permission}
        {...rest}
      >
        {writeNew ? <AddIcon /> : <WriteMeterNumberIcon />}
      </Button>
    );
  }
}

WriteMeterNumberButton.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  push: PropTypes.func,
  basePath: PropTypes.any,
  refFilter: PropTypes.any,
  status: PropTypes.string,
  dataProvider: PropTypes.func,
  myAccess: PropTypes.object,
  disableEinvoiceExport: PropTypes.any,
};

const enhance = compose(connect(state => ({ myAccess: state.sfdata.myaccess }), { push }));

export default enhance(WriteMeterNumberButton);
