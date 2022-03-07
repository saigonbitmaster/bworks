import React from 'react';
import { Filter, TextInput, MonthInput, ReferenceInput, SelectInput } from 'ra-loopback3';
import config from '../../Config';

const InvoiceExportFilters = props => {
  const { filterValues, handleDistrictChange, handleWardChange, ...rest } = props;
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
      {/* <HiddenInput source="startMeterDate" parse={() => ({ lt: filterValues.termInvoice })} /> */}
      <MonthInput
        label="generic.typeTime.month"
        source="termInvoice"
        alwaysOn
        date
        allowEmpty={false}
        format={v => (v && v.gte ? v.gte : '')}
        parse={v => (v ? { gte: v } : '')}
      />
      <ReferenceInput
        // disabled={!filterValues.wardId}
        // filter={{ wardId: filterValues.wardId }}
        filter={filterQuarter}
        label="resources.clients.fields.quarterId"
        source="quarterId"
        reference="geoquarters"
        alwaysOn
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
      <SelectInput
        source="paymentStatus"
        choices={config.client.payChoices}
        alwaysOn
        label="resources.clientmeternumbers.fields.paymentStatus"
      />
      <SelectInput
        style={{ width: '200%' }}
        fullWidth
        source="einvoice"
        label="resources.clientmeternumbers.einvoiceExportStatus"
        allowEmpty
        choices={config.eInvoice.einvoiceStatusChoices}
        alwaysOn
      />
      <TextInput label={'generic.search'} source="$text.search" alwaysOn />
    </Filter>
  );
};
export default InvoiceExportFilters;
