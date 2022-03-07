import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  List,
  TextField,
  Datagrid,
  withDataProvider,
  translate,
  FunctionField,
  NumberField,
  refreshView,
  CUSTOM,
} from 'ra-loopback3';
import { formatClientType, formatClientStatus } from '../../../src/util/formatShow';
import HistoryButton from './HistoryButton';
import ClientDebtBulkActionButtons from './ClientDebtBulkActionButtons';
import ClientFilter from '../client/ClientFilter';

@withDataProvider
@translate
@connect(null, { refreshView })
class ClientDebtList extends Component {
  refFilter = React.createRef();

  exportWaterShutoffNoticeInSmallScale = (ids, saving) => {
    this.props
      .dataProvider(
        CUSTOM,
        'clients',
        {
          body: ids,
          method: 'POST',
          subUrl: 'exportWaterShutoffNoticeInSmallScale',
          stream: 'file',
        },
        {
          notification: {
            body: 'ra.notification.updated',
            level: 'info',
            messageArgs: {
              smart_count: 1,
            },
          },
        },
        {
          notification: {
            body: 'ra.notification.http_error',
            level: 'warning',
          },
        },
      )
      .finally(() => {
        saving && saving(false);
      });
  };

  stopClients = (ids, saving) => {
    this.props
      .dataProvider(
        CUSTOM,
        'clients',
        {
          body: { ids },
          method: 'POST',
          subUrl: 'stops',
        },
        {
          notification: {
            body: 'ra.notification.updated',
            level: 'info',
            messageArgs: {
              smart_count: 1,
            },
          },
        },
        {
          notification: {
            body: 'ra.notification.http_error',
            level: 'warning',
          },
        },
      )
      .finally(() => {
        this.props.refreshView();
        saving && saving(false);
      });
  };

  resumeClients = (ids, saving) => {
    this.props
      .dataProvider(
        CUSTOM,
        'clients',
        {
          body: { ids },
          method: 'POST',
          subUrl: 'resumes',
        },
        {
          notification: {
            body: 'ra.notification.updated',
            level: 'info',
            messageArgs: {
              smart_count: 1,
            },
          },
        },
        {
          notification: {
            body: 'ra.notification.http_error',
            level: 'warning',
          },
        },
      )
      .finally(() => {
        this.props.refreshView();
        saving && saving(false);
      });
  };
  handleDistrictChange = filterValues => {
    if (filterValues.wardId || filterValues.quarterId) {
      this.refFilter.current.props.change('wardId', '');
      this.refFilter.current.props.change('quarterId', '');
    }
  };
  handleWardChange = filterValues => {
    if (filterValues.quarterId) {
      this.refFilter.current.props.change('quarterId', '');
    }
  };
  render() {
    const { dataProvider, dispatch, translate, refreshView, ...rest } = this.props;
    return (
      <List
        refFilter={this.refFilter}
        bulkActionButtons={
          <ClientDebtBulkActionButtons
            exportWaterShutoffNotice={this.exportWaterShutoffNotice}
            stopClients={this.stopClients}
            resumeClients={this.resumeClients}
          />
        }
        filters={
          <ClientFilter handleDistrictChange={this.handleDistrictChange} handleWardChange={this.handleWardChange} />
        }
        {...rest}
        resource="clients"
        sort={{ field: 'code', order: 'ASC' }}
      >
        <Datagrid>
          <TextField source="code" />
          <TextField source="name" />
          <TextField source="formattedAddress" />
          <NumberField source="debt" />
          <FunctionField
            source="type"
            render={record => {
              return formatClientType(this.props.translate, record.type);
            }}
          />
          <FunctionField
            source="status"
            render={record => {
              return formatClientStatus(this.props.translate, record.status);
            }}
          />
          <HistoryButton permission={{ name: 'clientDebt', action: 'historyDebt' }} />
        </Datagrid>
      </List>
    );
  }
}

ClientDebtList.propTypes = {
  dataProvider: PropTypes.func,
  dispatch: PropTypes.func,
  translate: PropTypes.func,
  history: PropTypes.any,
  refreshView: PropTypes.func,
};

export default ClientDebtList;
