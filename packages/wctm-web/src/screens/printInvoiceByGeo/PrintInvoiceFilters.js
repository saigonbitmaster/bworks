import React from 'react';
import { Filter, MonthInput, ReferenceInput, SelectInput } from 'ra-loopback3';

const PrintInvoiceFilters = ({ filterValues, ...props }) => (
  <Filter {...props} filterValues={filterValues}>
    <MonthInput label="generic.typeTime.month" source="termInvoice" alwaysOn date allowEmpty={false} />
    <ReferenceInput
      disabled={!filterValues.wardId}
      filter={{ wardId: filterValues.wardId }}
      label="resources.clients.fields.quarterId"
      source="quarterId"
      reference="geoquarters"
    >
      <SelectInput optionText="fullName" />
    </ReferenceInput>
    <ReferenceInput
      disabled={!filterValues.districtId}
      filter={{ wardId: filterValues.wardId, districtId: filterValues.districtId }}
      label="resources.clients.fields.wardId"
      source="wardId"
      reference="geowards"
    >
      <SelectInput optionText="fullName" />
    </ReferenceInput>
    <ReferenceInput label="resources.clients.fields.districtId" source="districtId" reference="geodistricts">
      <SelectInput optionText="fullName" />
    </ReferenceInput>
  </Filter>
);
export default PrintInvoiceFilters;
