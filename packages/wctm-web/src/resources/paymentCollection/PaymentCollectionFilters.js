import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Filter, translate, SelectInput, MonthInput, TextInput, ReferenceInput, BooleanInput } from 'ra-loopback3';

const PaymentCollectionFilters = props => {
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
      <MonthInput
        label="resources.clients.fields.termMeterNumber"
        allowEmpty={false}
        source="termMeterNumber"
        date
        alwaysOn
      />
      <SelectInput
        source="numberStatus"
        label={'resources.clientmeternumbers.writeWater'}
        choices={[
          { id: 'WROTE_WATER', name: translate('resources.clients.numberStatus.WROTE_WATER') },
          { id: 'UNWRITE_WATER', name: translate('resources.clients.numberStatus.UNWRITE_WATER') },
        ]}
        alwaysOn
      />
      <SelectInput
        source="status"
        label="resources.clients.fields.status"
        defaultValue="ACTIVE"
        choices={[
          { id: 'ACTIVE', name: translate('resources.clients.clientStatus.ACTIVE') },
          { id: 'PAUSE', name: translate('resources.clients.clientStatus.PAUSE') },
          { id: 'STOP', name: translate('resources.clients.clientStatus.STOP') },
        ]}
      />
      <BooleanInput source="displayAll" label="generic.displayAll" alwaysOn />
      {/* OLD */}
      {/* <MonthInput
      label="resources.clients.fields.termMeterNumber"
      format={v => (v ? v.inq[0] : '')}
      parse={v =>
        v
          ? {
              inq: [
                v,
                moment(v)
                  .subtract(1, 'month')
                  .startOf('month')
                  .toDate(),
              ],
            }
          : ''
      }
      allowEmpty={false}
      source="termMeterNumber"
      date
      alwaysOn
    /> */}
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
PaymentCollectionFilters.propTypes = {
  translate: PropTypes.func,
  filterValues: PropTypes.object,
  handleWardChange: PropTypes.func,
  handleDistrictChange: PropTypes.func,
};
const enhance = compose(translate);
export default enhance(PaymentCollectionFilters);
