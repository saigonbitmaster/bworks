import React from 'react';
import { SelectArrayInput } from 'ra-loopback3';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';

const getProvinces = (_, availableProvinces) => {
  return (
    <SelectArrayInput
      fullWidth
      source="provinces"
      optionText="name"
      label="Tỉnh/Thành phố"
      choices={availableProvinces}
    />
  );
};

const getDistricts = ({ provinces }, availableDistricts) => {
  let matchedDistricts;

  if (isEmpty(provinces)) {
    matchedDistricts = [];
  } else {
    matchedDistricts = availableDistricts.filter(({ provinceId }) => provinces.includes(provinceId));
  }
  return <SelectArrayInput fullWidth source="districts" label="Quận Huyện" choices={matchedDistricts} />;
};

const getWards = ({ provinces, districts }, availableWards) => {
  let matchedWards;
  if (isEmpty(provinces) || isEmpty(districts)) {
    matchedWards = [];
  } else {
    matchedWards = availableWards.filter(
      ({ provinceId, districtId }) => provinces.includes(provinceId) && districts.includes(districtId),
    );
  }
  return <SelectArrayInput fullWidth source="wards" label="Phường/Xã" choices={matchedWards} />;
};

const getQuarters = ({ provinces, districts, wards }, availableQuarters) => {
  let matchedQuarters = null;
  if (isEmpty(provinces) || isEmpty(districts) || isEmpty(wards)) {
    matchedQuarters = [];
  } else {
    matchedQuarters = availableQuarters.filter(
      ({ provinceId, districtId, wardId }) =>
        provinces.includes(provinceId) && districts.includes(districtId) && wards.includes(wardId),
    );
  }
  return <SelectArrayInput fullWidth source="quarters" label="Thôn/Ấp/Khu phố" choices={matchedQuarters} />;
};

getDistricts.propTypes = {
  provinces: PropTypes.array,
};

getWards.propTypes = {
  provinces: PropTypes.array,
  districts: PropTypes.array,
};

getQuarters.propTypes = {
  provinces: PropTypes.array,
  districts: PropTypes.array,
  wards: PropTypes.array,
};

export { getDistricts, getProvinces, getWards, getQuarters };
