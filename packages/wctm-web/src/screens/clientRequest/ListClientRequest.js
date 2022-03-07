import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Datagrid,
  TextField,
  Filter,
  TextInput,
  FunctionField,
  translate,
  withDataProvider,
  ReferenceInput,
  SelectInput,
  BooleanInput,
} from 'ra-loopback3';
import compose from 'recompose/compose';
import camelCase from 'lodash/camelCase';
import { formatClientStatus } from '../../../src/util/formatShow';
import CompleteButton from './CompleteButton';

const ClientRequestFilter = props => {
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
      <TextInput label="generic.search" source="$text.search" alwaysOn />
      <BooleanInput label="generic.displayAll" source="displayAll" alwaysOn />
    </Filter>
  );
};
ClientRequestFilter.propTypes = {
  translate: PropTypes.func,
  filterValues: PropTypes.object,
  handleDistrictChange: PropTypes.func,
  handleWardChange: PropTypes.func,
};

@withDataProvider
class ListClientRequest extends Component {
  listController = React.createRef();
  refFilter = React.createRef();

  state = {
    requestStatuses: ['ACTIVE', 'PAUSE', 'STOP', 'INSTALL_WAITING', 'CONTRACT_SIGNED'],
  };

  fixFilter = values => {
    if (values) {
      if (!values.displayAll) {
        values.status = 'INSTALL_WAITING';
        this.setState({ requestStatuses: ['INSTALL_WAITING'] });
      } else {
        this.setState({ requestStatuses: ['ACTIVE', 'PAUSE', 'STOP', 'INSTALL_WAITING', 'CONTRACT_SIGNED'] });
      }
    }
    delete values.displayAll;
    return values;
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
    const { requestStatuses } = this.state;
    const { translate, dataProvider, ...rest } = this.props;
    return (
      <List
        {...rest}
        refController={this.listController}
        refFilter={this.refFilter}
        fixFilter={this.fixFilter}
        rootModel={'Client'}
        sourcesAndTranslations={{
          rootFields: {
            code: { header: translate('resources.clients.fields.code') },
            name: { header: translate('resources.clients.fields.name') },
            formattedAddress: { header: translate('resources.clients.fields.formattedAddress') },
            status: {
              header: translate('resources.clients.fields.status'),
              value: requestStatuses.reduce(
                (acc, val) => ({
                  ...acc,
                  [val]: this.props.translate(`generic.client.statusChoices.${camelCase(val)}`),
                }),
                {},
              ),
            },
          },
        }}
        exportExcelPermission={{ name: 'clientRequest', action: 'export' }}
        templateKey="ClientRequest"
        resource="clientaliasclientrequests"
        filter={{ $order: ['activeRequests DESC'] }}
        bulkActionButtons={false}
        filters={
          <ClientRequestFilter
            handleDistrictChange={this.handleDistrictChange}
            handleWardChange={this.handleWardChange}
          />
        }
        sort={{ field: 'code', order: 'ASC' }}
      >
        <Datagrid>
          <TextField source="code" label="resources.clients.fields.code" />
          <TextField source="name" label="resources.clients.fields.name" />
          <TextField source="formattedAddress" label="resources.clients.fields.formattedAddress" />
          <FunctionField
            source="status"
            label="resources.clients.fields.status"
            render={record => {
              return formatClientStatus(this.props.translate, record.status);
            }}
          />
          <CompleteButton
            showHistoryPermission={{ name: 'clientRequest', action: 'completeRequest' }}
            completeRequestPermission={{ name: 'clientRequest', action: 'completeRequest' }}
          />
        </Datagrid>
      </List>
    );
  }
}
ListClientRequest.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  dataProvider: PropTypes.func,
};

ListClientRequest.defaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default compose(translate)(ListClientRequest);
