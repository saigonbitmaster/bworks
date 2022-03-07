import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Datagrid,
  TextField,
  Filter,
  translate,
  TextInput,
  EditButton,
  CreateButton,
  ReferenceField,
  DateField,
  SelectInput,
  FunctionField,
} from 'ra-loopback3';
import compose from 'recompose/compose';
import moment from 'moment-timezone';

const InspectMeterNumberFilter = ({ translate, ...rest }) => (
  <Filter {...rest}>
    <TextInput label={'generic.search'} source="name" alwaysOn />
    <SelectInput
      source="submitStatus"
      label="resources.inspectmeternumber.fields.submitStatus"
      choices={[
        { id: 'PASSED', name: translate('resources.inspectmeternumber.submitStatus.PASSED') },
        { id: 'WAITING', name: translate('resources.inspectmeternumber.submitStatus.WAITING') },
        { id: 'DENIED', name: translate('resources.inspectmeternumber.submitStatus.DENIED') },
        { id: 'EXISTED', name: translate('resources.inspectmeternumber.submitStatus.EXISTED') },
      ]}
      alwaysOn
    />
  </Filter>
);
InspectMeterNumberFilter.propTypes = {
  translate: PropTypes.func,
};
class InspectMeterNumberList extends Component {
  render() {
    const { translate } = this.props;
    return (
      <List
        {...this.props}
        // hasCreate
        // hasDelete
        resource="meternumbersubmits"
        filters={<InspectMeterNumberFilter {...this.props} />}
        // filter={{
        //   submitStatus: 'WAITING',
        // }}
      >
        <Datagrid>
          <ReferenceField
            reference="clients"
            source="clientId"
            linkType={false}
            label={'resources.inspectmeternumber.fields.code'}
          >
            <TextField source="code" />
          </ReferenceField>
          <ReferenceField
            reference="clients"
            source="clientId"
            linkType={false}
            label={'resources.inspectmeternumber.fields.name'}
          >
            <TextField source="name" />
          </ReferenceField>
          <ReferenceField
            reference="clients"
            source="clientId"
            linkType={false}
            label={'resources.inspectmeternumber.fields.formattedAddress'}
          >
            <TextField source="formattedAddress" />
          </ReferenceField>
          <FunctionField
            source="termMonth"
            label={'resources.inspectmeternumber.fields.termMeterNumber'}
            render={record => moment(record.termMonth).format('MM/YYYY')}
          />
          <TextField source="previousNumber" label={'resources.inspectmeternumber.fields.previousNumber'} />
          <TextField source="currentNumber" label={'resources.inspectmeternumber.fields.currentNumber'} />
          <FunctionField
            source="submitStatus"
            label={'resources.inspectmeternumber.fields.submitStatus'}
            render={record => translate(`resources.inspectmeternumber.submitStatus.${record.submitStatus}`)}
          />
          <EditButton label="generic.detail" />
        </Datagrid>
      </List>
    );
  }
}
InspectMeterNumberList.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

InspectMeterNumberList.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default compose(translate)(InspectMeterNumberList);
