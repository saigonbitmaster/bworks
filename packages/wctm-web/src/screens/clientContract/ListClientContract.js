import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Datagrid,
  FunctionField,
  TextField,
  SFEditButton,
  Filter,
  TextInput,
  translate,
  ReferenceInput,
  SelectInput,
  DateField,
  withDataProvider,
} from 'ra-loopback3';
import compose from 'recompose/compose';
import camelCase from 'lodash/camelCase';
import { formatClientType, formatClientStatus } from '../../../src/util/formatShow';

const ClientContractFilter = props => {
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
        // disabled={!filterValues.wardId}
        // filter={{ wardId: filterValues.wardId }}
        filter={filterQuarter}
        label="resources.clients.fields.quarterId"
        source="quarterId"
        reference="geoquarters"
      >
        <SelectInput optionText="fullName" />
      </ReferenceInput>
      <ReferenceInput
        // disabled={!filterValues.districtId}
        // filter={{ wardId: filterValues.wardId, districtId: filterValues.districtId }}
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
        // filter={{ id: '5c36d0de4ddf9f0f33e62354' }}
      >
        <SelectInput optionText="fullName" />
      </ReferenceInput>
      <TextInput label={'generic.search'} source="$text.search" alwaysOn />
    </Filter>
  );
};
ClientContractFilter.propTypes = {
  translate: PropTypes.func,
};

@withDataProvider
class ListClientContract extends Component {
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
    const { dataProvider, translate, ...rest } = this.props;
    return (
      <List
        {...rest}
        refFilter={this.refFilter}
        refController={this.listController}
        rootModel={'Client'}
        sourcesAndTranslations={{
          rootFields: {
            code: { header: translate('resources.clients.fields.code') },
            name: { header: translate('resources.clients.fields.name') },
            formattedAddress: { header: translate('resources.clients.fields.formattedAddress') },
            contractNo: { header: translate('resources.clients.fields.contractNo') },
            contractDate: { header: translate('resources.clients.fields.contractDate') },
            startMeterDate: { header: translate('resources.clients.fields.startMeterDate') },
            type: {
              header: translate('resources.clients.fields.type'),
              value: ['RESIDENT', 'ORGANIZATION', 'INDUSTRY', 'SERVICE'].reduce(
                (acc, val) => ({
                  ...acc,
                  [val]: translate(`generic.client.clientTypeChoices.${val.toLowerCase()}`),
                }),
                {},
              ),
            },
            status: {
              header: translate('resources.clients.fields.status'),
              value: ['ACTIVE', 'PAUSE', 'STOP', 'INSTALL_WAITING', 'CONTRACT_SIGNED'].reduce(
                (acc, val) => ({
                  ...acc,
                  [val]: translate(`generic.client.statusChoices.${camelCase(val)}`),
                }),
                {},
              ),
            },
          },
        }}
        exportExcelPermission={{ name: 'clientContract', action: 'export' }}
        templateKey={'ClientContract'}
        resource="clients"
        filters={
          <ClientContractFilter
            handleDistrictChange={this.handleDistrictChange}
            handleWardChange={this.handleWardChange}
          />
        }
        bulkActionButtons={false}
        sort={{ field: 'code', order: 'ASC' }}
      >
        <Datagrid>
          <TextField source="code" />
          <TextField source="contractNo" />
          <TextField source="name" />
          <TextField source="formattedAddress" />
          <DateField source="contractDate" />
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
          <SFEditButton permission={{ name: 'clientContract', action: 'edit' }} />
        </Datagrid>
      </List>
    );
  }
}
ListClientContract.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

ListClientContract.defaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default compose(translate)(ListClientContract);
