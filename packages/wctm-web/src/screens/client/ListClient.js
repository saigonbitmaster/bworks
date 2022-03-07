import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Datagrid,
  TextField,
  SFEditButton,
  FunctionField,
  translate,
  showNotification,
  withDataProvider,
  CustomReferenceField,
} from 'ra-loopback3';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import camelCase from 'lodash/camelCase';
import { formatClientType, formatClientStatus } from '../../../src/util/formatShow';
import ClientFilter from './ClientFilter';

class ListClient extends Component {
  listController = React.createRef();
  refFilter = React.createRef();

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
    const { showNotification, dataProvider, resource, ...rest } = this.props;
    return (
      <List
        {...rest}
        displayOrdinalNumber={true}
        refFilter={this.refFilter}
        refController={this.listController}
        resource="clients"
        filters={
          <ClientFilter handleDistrictChange={this.handleDistrictChange} handleWardChange={this.handleWardChange} />
        }
        rootModel={'Client'}
        sourcesAndTranslations={{
          rootFields: {
            code: { header: this.props.translate('resources.clients.fields.code') },
            name: { header: this.props.translate('resources.clients.fields.name') },
            formattedAddress: { header: this.props.translate('resources.clients.fields.formattedAddress') },
            termInvoice: { header: this.props.translate('resources.clients.fields.termInvoice') },
            termMeterNumber: { header: this.props.translate('resources.clients.fields.termMeterNumber') },
            type: {
              header: this.props.translate('resources.clients.fields.type'),
              value: ['RESIDENT', 'ORGANIZATION', 'INDUSTRY', 'SERVICE'].reduce(
                (acc, val) => ({
                  ...acc,
                  [val]: this.props.translate(`generic.client.clientTypeChoices.${val.toLowerCase()}`),
                }),
                {},
              ),
            },
            status: {
              header: this.props.translate('resources.clients.fields.status'),
              value: ['ACTIVE', 'PAUSE', 'STOP', 'INSTALL_WAITING', 'CONTRACT_SIGNED'].reduce(
                (acc, val) => ({
                  ...acc,
                  [val]: this.props.translate(`generic.client.statusChoices.${camelCase(val)}`),
                }),
                {},
              ),
            },
          },
        }}
        exportExcelPermission={{ name: 'client', action: 'export' }}
        templateKey="Client"
        bulkActionButtons={false}
        sort={{ field: 'code', order: 'ASC' }}
      >
        <Datagrid>
          <TextField source="code" />
          <TextField source="name" />
          <TextField source="formattedAddress" />
          <CustomReferenceField
            source="id"
            label="resources.clients.fields.termInvoice"
            fixSource={record => `${record.id}-${moment(record.termInvoice).format('YYYY-MM')}`}
            allowEmpty
            reference="clientmeternumbers"
            sortable={false}
            linkType={false}
          >
            <FunctionField render={record => (record ? moment(record.toDate).format('MM/YYYY') : '')} />
          </CustomReferenceField>
          <FunctionField
            source="termMeterNumber"
            render={record => {
              return record.termMeterNumber ? moment(record.termMeterNumber).format('MM/YYYY') : '';
            }}
          />
          {/* <ReferenceField reference="dmas" source="dmaId" allowEmpty linkType={false}>
            <TextField source="name" />
          </ReferenceField> */}
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
          <SFEditButton permission={{ name: 'client', action: 'edit' }} />
        </Datagrid>
      </List>
    );
  }
}
ListClient.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  showNotification: PropTypes.func,
  dataProvider: PropTypes.func,
  resource: PropTypes.string,
};

ListClient.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default compose(connect(null, { showNotification }), translate, withDataProvider)(ListClient);
