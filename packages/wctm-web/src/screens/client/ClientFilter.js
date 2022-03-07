import React from 'react';
import PropTypes from 'prop-types';
import { Filter, ReferenceInput, SelectInput, TextInput } from 'ra-loopback3';

const ClientFilter = ({ translate, filterValues, handleDistrictChange, handleWardChange, ...rest }) => {
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
        alwaysOn
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
      <TextInput label={'generic.search'} source="$text.search" alwaysOn />
    </Filter>
  );
};

ClientFilter.propTypes = {
  translate: PropTypes.func,
  filterValues: PropTypes.object,
  handleDistrictChange: PropTypes.func,
  handleWardChange: PropTypes.func,
};

export default ClientFilter;
