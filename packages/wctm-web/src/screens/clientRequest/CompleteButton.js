import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import { Button } from 'ra-loopback3';
import { Link } from 'react-router-dom';
import { linkToRecord } from 'react-admin';
import get from 'lodash/get';
import { CompleteIcon, WarningIcon } from '../../styles/Icons';
import ShowHistoryButton from './ShowHistoryButton';

export default pure(
  class CreateContractButton extends Component {
    static propTypes = {
      record: PropTypes.object,
      basePath: PropTypes.string,
      showHistoryPermission: PropTypes.object,
      completeRequestPermission: PropTypes.object,
    };

    handleMissingData = record => {
      // return 'generic.complete';
      if (record.status === 'COMPLETE' && !record.installationTeamId) {
        return 'generic.inComplete';
      } else {
        return 'generic.complete';
      }
    };

    render() {
      const { record, basePath, showHistoryPermission, completeRequestPermission } = this.props;
      const completeButtonLabel = this.handleMissingData(record);
      const isIncomplete = completeButtonLabel.includes('inComplete') ? true : false;
      let idRequest = get(record, 'activeRequests[0]');
      if (!idRequest) return <ShowHistoryButton permission={showHistoryPermission} {...this.props} />;
      return (
        <Button
          component={Link}
          label={completeButtonLabel}
          disabled={record.status === 'COMPLETE'}
          to={linkToRecord(basePath, idRequest)}
          permission={completeRequestPermission}
        >
          {isIncomplete ? <WarningIcon /> : <CompleteIcon />}
        </Button>
      );
    }
  },
);
