import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  List,
  Datagrid,
  NumberField,
  DateField,
  withDataProvider,
  CUSTOM,
  GET_ONE,
  FunctionField,
  SFEditButton,
  CustomDeleteButton,
  startCustomUndoable,
  refreshView,
  withTranslate,
} from 'ra-loopback3';
import { connect } from 'react-redux';
import maxBy from 'lodash/maxBy';
import moment from 'moment-timezone';
class ClientMeterNumberHistoryList extends Component {
  state = {
    records: [],
    name: '',
    fetchedFromAPI: false,
  };

  handleDelete = id => {
    // console.log('handle delete id', id);
    let { dataProvider, startCustomUndoable } = this.props;
    startCustomUndoable({
      type: 'DELETE_CLIENT_HISTORY',
      payload: async () => {
        return dataProvider(CUSTOM, 'clientmeternumbers', {
          method: 'DELETE',
          subUrl: 'delete',
          body: { id },
        })
          .then(() => this.fetchDataFromAPI())
          .then(() => this.props.refreshView())
          .catch(() => {
            // eslint-disable-line
            // console.log('cath error: ', error);
          });
      },
      meta: {
        deleteData: { resource: 'clientmeternumbers', id },
        onSuccess: {
          notification: {
            body: 'notification.confirm.willDelete',
            level: 'info',
            messageArgs: {
              smart_count: 1,
            },
          },
        },
        onFailure: {
          notification: {
            body: 'ra.notification.http_error',
            level: 'warning',
          },
        },
      },
    });
  };

  async componentDidMount() {
    await this.fetchDataFromAPI();
  }

  async fetchDataFromAPI() {
    const { id, dataProvider } = this.props;
    const { data } = await dataProvider(CUSTOM, 'clientmeternumbers', { filter: { where: { clientId: id } } });
    const {
      data: { name },
    } = await dataProvider(GET_ONE, 'clients', { id });
    this.setState({ records: data, name, fetchedFromAPI: true });
  }

  disableEditingHistoricalMeterData = ({ id, paymentStatus, fromDate, previousNumber, currentNumber }, records) => {
    const lastWrite = maxBy(records, 'toDate');

    if (lastWrite.id !== id) {
      return true;
    }

    let result = false;
    if (lastWrite && moment(lastWrite.toDate).isSame(fromDate, 'month')) {
      result = true;
    }

    if (paymentStatus === true && previousNumber !== currentNumber) {
      result = true;
    }

    const hasForceUpdateMonth = Object.keys(this.props.allowedAPIs || {})
      .map(path => path.slice(path.lastIndexOf('/') + 1))
      .includes('forceUpdateMonth');

    // Check admin's right
    if (hasForceUpdateMonth && moment(lastWrite.toDate).isSame(fromDate)) {
      result = false;
    }

    return result;
  };

  disableDeletingNonConsecutiveMeterData = ({ id }, records) => {
    const mostRecentMeterData = maxBy(records, 'toDate');

    let result = false;
    if (id !== mostRecentMeterData.id) {
      result = true;
    }

    return result;
  };

  render() {
    const { id, basePath, resource, translate, ...rest } = this.props;
    const { records, name, fetchedFromAPI } = this.state;
    return (
      fetchedFromAPI && (
        <List bulkActionButtons={false} resource={resource} {...rest} filter={{ clientId: id }} title={name}>
          <Datagrid>
            <FunctionField
              source="toDate"
              render={record => moment(record.toDate).format('MM/YYYY')}
              label={translate('resources.clientmeternumbers.fields.termMeterNumber')}
            />
            <DateField source="fromDate" />
            <DateField source="toDate" />
            <NumberField source="previousNumber" />
            <NumberField source="currentNumber" />
            <SFEditButton
              basePath={`${basePath}/editClientMeterNumber/edit`}
              resource={resource}
              records={records}
              customDisabled={this.disableEditingHistoricalMeterData}
              permission={
                Object.keys(this.props.allowedAPIs || {})
                  .map(path => path.slice(path.lastIndexOf('/') + 1))
                  .includes('forceUpdateMonth')
                  ? { name: 'clientMeterNumber', action: 'forceEditWriteWater' }
                  : { name: 'clientMeterNumber', action: 'editWriteWater' }
              }
            />
            <CustomDeleteButton
              handleDelete={this.handleDelete}
              records={records}
              customDisabled={this.disableDeletingNonConsecutiveMeterData}
              permission={{ name: 'clientMeterNumber', action: 'delete' }}
            />
          </Datagrid>
        </List>
      )
    );
  }
}

ClientMeterNumberHistoryList.propTypes = {
  dataprovider: PropTypes.func,
  hasEdit: PropTypes.bool,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  basePath: PropTypes.string,
  id: PropTypes.string,
  refreshView: PropTypes.func,
  dataProvider: PropTypes.func,
  startCustomUndoable: PropTypes.func,
  resource: PropTypes.string,
  allowedAPIs: PropTypes.arrayOf(PropTypes.string),
};
const enhance = compose(
  withTranslate,
  withDataProvider,
  connect(state => ({ allowedAPIs: state.sfdata.myaccess.apiPath }), { startCustomUndoable, refreshView }),
);
export default enhance(ClientMeterNumberHistoryList);
