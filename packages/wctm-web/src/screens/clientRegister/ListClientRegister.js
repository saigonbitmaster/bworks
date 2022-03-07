import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Datagrid,
  TextField,
  SFEditButton,
  Filter,
  FunctionField,
  SelectInput,
  translate,
  TextInput,
  showNotification,
  withDataProvider,
  ReferenceInput,
} from 'ra-loopback3';
import { connect } from 'react-redux';
import camelCase from 'lodash/camelCase';
import { formatClientType, formatClientAction } from '../../../src/util/formatShow';
import config from '../../Config';
import BooleanFieldCustom from '../../components/common/field/BooleanFieldCustom';
import CreateContractButton from './CreateContractButton';
import ImportDataButton from '../../components/common/button/ImportDataButton';
import ExportTemplateButton from '../../components/common/button/ExportTemplateButton';

const ClientRegisterFilter = props => {
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
      <SelectInput source="status" choices={config.client.registerStatusChoices} alwaysOn />
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
ClientRegisterFilter.propTypes = {
  translate: PropTypes.func,
  filterValues: PropTypes.object,
  handleDistrictChange: PropTypes.func,
  handleWardChange: PropTypes.func,
};

@withDataProvider
@connect(null, { showNotification })
class ListClientRegister extends Component {
  listController = React.createRef();
  refFilter = React.createRef();

  state = {
    clientRegisterStatuses: ['NEW', 'INSTALL_WAITING', 'CONTRACT_SIGNED'],
  };

  fixFilter = currentFilter => {
    if (!currentFilter.status) {
      currentFilter.status = { neq: 'COMPLETE' };
      this.setState({ clientRegisterStatuses: ['NEW', 'INSTALL_WAITING', 'CONTRACT_SIGNED'] });
    } else if (['NEW', 'INSTALL_WAITING', 'CONTRACT_SIGNED', 'COMPLETE'].includes(currentFilter.status)) {
      this.setState({ clientRegisterStatuses: [currentFilter.status] });
    }
    return currentFilter;
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
    const { clientRegisterStatuses } = this.state;
    const { translate, showNotification, dataProvider, ...rest } = this.props;
    return (
      <List
        {...rest}
        fixFilter={this.fixFilter}
        refFilter={this.refFilter}
        refController={this.listController}
        resource="clientregisters"
        filterDefaultValues={{ status: 'NEW' }}
        filters={
          <ClientRegisterFilter
            handleDistrictChange={this.handleDistrictChange}
            handleWardChange={this.handleWardChange}
          />
        }
        rootModel={'ClientRegister'}
        sourcesAndTranslations={{
          rootFields: {
            name: { header: translate('resources.clientregisters.fields.name') },
            formattedAddress: { header: translate('resources.clientregisters.fields.formattedAddress') },
            type: {
              header: translate('resources.clientregisters.fields.type'),
              value: ['RESIDENT', 'ORGANIZATION', 'INDUSTRY', 'SERVICE'].reduce(
                (acc, val) => ({
                  ...acc,
                  [val]: this.props.translate(`generic.client.clientTypeChoices.${val.toLowerCase()}`),
                }),
                {},
              ),
            },
            status: {
              header: translate('resources.clientregisters.fields.status'),
              value: clientRegisterStatuses.reduce(
                (acc, val) => ({
                  ...acc,
                  [val]: this.props.translate(`generic.client.actionChoices.${camelCase(val)}`),
                }),
                {},
              ),
            },
            statusSurvey: {
              header: translate('resources.clientregisters.fields.statusSurvey'),
              value: [true, false].reduce(
                (acc, val) => ({
                  ...acc,
                  [val]: this.props.translate(`generic.client.statusSurveyChoices.${camelCase(val)}`),
                }),
                {},
              ),
            },
            resultSurvey: {
              header: translate('resources.clientregisters.fields.resultSurvey'),
              value: [true, false].reduce(
                (acc, val) => ({
                  ...acc,
                  [val]: this.props.translate(`generic.client.resultSurveyChoices.${camelCase(val)}`),
                }),
                {},
              ),
            },
          },
        }}
        exportExcelPermission={{ name: 'clientRegister', action: 'export' }}
        templateKey={'ClientRegister'}
        permissionCreateDefault={{ name: 'clientRegister', action: 'create' }}
        bulkActionButtons={false}
        extActions={
          <React.Fragment>
            <ImportDataButton
              showNotification={showNotification}
              acceptedFileExtensions={['.xlsx']}
              fileModelData={{ modelName: 'ExcelFiles', modelUrl: 'uploaded/upload' }}
              importModelData={{ modelName: 'ClientRegisters', modelUrl: 'importClientRegistersFromExcel' }}
            />
            <ExportTemplateButton
              templateData={{
                downloadName: 'bieu_mau_nhap_lieu_khach_hang_moi.xlsx',
                storedName: 'clientRegisterStandardTemplate.xlsx',
              }}
            />
          </React.Fragment>
        }
      >
        <Datagrid>
          <TextField source="name" />
          <TextField source="formattedAddress" />
          <FunctionField
            source="type"
            render={record => {
              return formatClientType(translate, record.type);
            }}
          />
          <FunctionField
            source="status"
            render={record => {
              return formatClientAction(translate, record.status);
            }}
          />
          <BooleanFieldCustom source="statusSurvey" />
          <BooleanFieldCustom source="resultSurvey" />
          <SFEditButton permission={{ name: 'clientRegister', action: 'edit' }} />
          <CreateContractButton />
        </Datagrid>
      </List>
    );
  }
}
ListClientRegister.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  dataProvider: PropTypes.func,
  showNotification: PropTypes.func,
};

ListClientRegister.defaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default translate(ListClientRegister);
