import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Datagrid,
  TextField,
  Filter,
  TextInput,
  DateField,
  translate,
  ReferenceField,
  FunctionField,
  ReferenceInput,
  SelectInput,
  withDataProvider,
} from 'ra-loopback3';
import camelCase from 'lodash/camelCase';
import { formatClientStatus } from '../../../src/util/formatShow';
import EditOrCreateButton from './EditOrCreateButton';
import ReplaceMeterButton from './ReplaceMeterButton';
import ShowHistoryButton from './ShowHistoryButton';

const ClientMeterFilter = props => {
  const { translate, filterValues, handleDistrictChange, handleWardChange, ...rest } = props;
  let filterQuarter = {};

  // quan
  if (filterValues.districtId) {
    filterQuarter.districtId = filterValues.districtId;
  }

  // phuong
  if (filterValues.wardId) {
    filterQuarter.wardId = filterValues.wardId;
  }
  return (
    <Filter {...rest} filterValues={filterValues}>
      <ReferenceInput
        filter={filterQuarter}
        label="resources.clients.fields.quarterId"
        source="quarterId"
        reference="geoquarters"
      >
        <SelectInput optionText="fullName" />
      </ReferenceInput>
      <ReferenceInput
        // disabled={!filterValues.districtId}
        filter={{ districtId: filterValues.districtId }}
        label="resources.clients.fields.wardId"
        source="wardId"
        reference="geowards"
        onChange={() => handleWardChange(filterValues)}
      >
        <SelectInput optionText="fullName" />
      </ReferenceInput>
      <ReferenceInput
        label="resources.clients.fields.districtId"
        source="districtId"
        reference="geodistricts"
        onChange={() => handleDistrictChange(filterValues)}
      >
        <SelectInput optionText="fullName" />
      </ReferenceInput>
      <SelectInput
        source="status"
        label="resources.clients.fields.status"
        choices={[
          { id: 'ACTIVE', name: translate('resources.clientmeters.status.ACTIVE') },
          { id: 'PAUSE', name: translate('resources.clientmeters.status.PAUSE') },
          { id: 'STOP', name: translate('resources.clientmeters.status.STOP') },
          { id: 'INSTALL_WAITING', name: translate('resources.clientmeters.status.INSTALL_WAITING') },
          { id: 'CONTRACT_SIGNED', name: translate('resources.clientmeters.status.CONTRACT_SIGNED') },
        ]}
        alwaysOn
      />
      <TextInput label={'generic.search'} source="$text.search" alwaysOn />
    </Filter>
  );
};
ClientMeterFilter.propTypes = {
  translate: PropTypes.func,
  filterValues: PropTypes.object,
  handleDistrictChange: PropTypes.func,
  handleWardChange: PropTypes.func,
};

@translate
@withDataProvider
class ListClientMeter extends Component {
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
    const { translate, dataProvider, record, ...rest } = this.props;
    return (
      <List
        refFilter={this.refFilter}
        refController={this.listController}
        rootModel={'Client'}
        sourcesAndTranslations={{
          rootFields: {
            code: { header: translate('resources.clients.fields.code') },
            name: { header: translate('resources.clients.fields.name') },
            formattedAddress: { header: translate('resources.clients.fields.formattedAddress') },
            status: {
              header: translate('resources.clients.fields.status'),
              value: ['ACTIVE', 'PAUSE', 'STOP', 'INSTALL_WAITING', 'CONTRACT_SIGNED'].reduce(
                (acc, val) => ({
                  ...acc,
                  [val]: this.props.translate(`generic.client.statusChoices.${camelCase(val)}`),
                }),
                {},
              ),
            },
          },
          referredMetadata: {
            ClientMeter: {
              id: '_id',
              foreignId: 'clientId',
              fields: {
                qrCode: { header: translate('resources.clientmeters.fields.qrCode') },
                setupDate: { header: translate('resources.clientmeters.fields.setupDate') },
                meterDateStatus: {
                  header: translate('resources.clientmeters.fields.meterDateStatus'),
                  value: ['valid', 'expired', 'hasNoMeter', 'nearExpired'].reduce(
                    (acc, val) => ({
                      ...acc,
                      [val]: this.props.translate(`resources.clientmeters.report.${val}`),
                    }),
                    {},
                  ),
                },
              },
              extra: {
                foreignKey: 'Client',
                caller: 'reportClientMeterDateStatus',
                id: '_id',
                newName: 'meterDateStatus',
              },
            },
          },
        }}
        exportExcelPermission={{ name: 'clientMeter', action: 'export' }}
        templateKey={'ClientMeter'}
        {...rest}
        hasEdit
        resource="clientaliasmeters"
        bulkActionButtons={false}
        filters={
          <ClientMeterFilter
            handleDistrictChange={this.handleDistrictChange}
            handleWardChange={this.handleWardChange}
            translate={translate}
          />
        }
      >
        <Datagrid>
          <TextField label={translate('resources.clients.fields.code')} source="code" sortable={false} />
          <TextField label={translate('resources.clients.fields.name')} source="name" sortable={false} />
          <TextField
            label={translate('resources.clients.fields.formattedAddress')}
            source="formattedAddress"
            sortable={false}
          />
          <FunctionField
            label="resources.clients.fields.status"
            source="status"
            render={record => {
              return formatClientStatus(this.props.translate, record.status);
            }}
            sortable={false}
          />
          <FunctionField
            label={translate('resources.clientmeters.fields.meterDateStatus')}
            source="meterStatusDate"
            render={({ meterDateStatus }) => {
              if (meterDateStatus === 'valid') {
                return translate('resources.clientmeters.report.valid');
              } else if (meterDateStatus === 'nearExpired') {
                return translate('resources.clientmeters.report.nearExpired');
              } else if (meterDateStatus === 'expired') {
                return translate('resources.clientmeters.report.expired');
              } else if (meterDateStatus === 'hasNoMeter') {
                return translate('resources.clientmeters.report.hasNoMeter');
              } else {
                return '';
              }
            }}
          />
          <ReferenceField
            label={translate('resources.clientmeters.fields.setupDate')}
            source="meterId"
            reference="clientmeters"
            allowEmpty
            linkType={false}
            sortable={false}
          >
            <DateField source="setupDate" />
          </ReferenceField>
          <ReferenceField
            label={translate('resources.clientmeters.fields.qrCode')}
            source="meterId"
            reference="clientmeters"
            allowEmpty
            linkType={false}
            sortable={false}
          >
            <TextField source="qrCode" />
      
          </ReferenceField>
          <ReferenceField
            label={translate('resources.clientmeters.fields.serial')}
            source="meterId"
            reference="clientmeters"
            allowEmpty
            linkType={false}
            sortable={false}
          >
        
            <TextField source="serial" />
          </ReferenceField>
          <EditOrCreateButton permission={{ name: 'clientMeter', action: 'edit' }} />
          <ReplaceMeterButton permission={{ name: 'clientMeter', action: 'changeMeter' }} />
          <ShowHistoryButton permission={{ name: 'clientMeter', action: 'showHistory' }} />
        </Datagrid>
      </List>
    );
  }
}
ListClientMeter.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
  record: PropTypes.object,
};

ListClientMeter.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default ListClientMeter;
