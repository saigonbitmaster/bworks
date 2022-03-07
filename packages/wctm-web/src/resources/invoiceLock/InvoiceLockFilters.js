import React, { Component } from 'react';
import { pure } from 'recompose';
import { Filter, TextInput, MonthInput, SelectInput, ReferenceInput, NumberInput, DateInput } from 'ra-loopback3';
// import moment from 'moment-timezone';
import config from '../../Config';
@pure
class InvoiceLockFilters extends Component {
  parse = val => {
    // console.log('parse', val);
    if (val === null) {
      return val;
    }
    if (val < 0) {
      return;
    }
    let numStr = new RegExp(`^([0-9_-]){0,${config.maxLengthInvoiceNo}}$`); // [0-9] number and max 7 character
    if (numStr.test(val)) {
      return val;
    }
    return;
  };
  render() {
    const { filterValues, handleDistrictChange, handleWardChange, ...rest } = this.props;
    // const previousTermMeter = moment(filterValues.termMeterNumber)
    //   .subtract('1', 'month')
    //   .toDate();
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
        {/* <DateInput source="invoiceExportDate" label={'resources.clientmeternumbers.invoiceExportDate'} alwaysOn /> */}
        {/* <NumberInput
          label={'resources.clientmeternumbers.inputInvoiceNo'}
          source="invoiceNo"
          alwaysOn
          parse={this.parse}
        /> */}
        <MonthInput
          label="resources.clients.fields.termMeterNumber"
          allowEmpty={false}
          source="termMeterNumber"
          date
          alwaysOn
        />
        {/* <SelectInput
          source="termInvoice"
          label="generic.status"
          key={filterValues.termMeterNumber}
          alwaysOn
          choices={[
            {
              id: moment(filterValues.termMeterNumber)
                .toDate()
                .toISOString(),
              name: 'generic.cannot',
            },
            { id: previousTermMeter.toISOString(), name: 'generic.can' },
          ]}
        /> */}
        <SelectInput
          source="invoiceLock"
          label="generic.status"
          key={filterValues.termMeterNumber}
          alwaysOn
          choices={[
            { id: 'isLocked', name: 'generic.lockedInvoice' },
            { id: 'isNotLocked', name: 'generic.unLockedInvoice' },
          ]}
        />
        <SelectInput
          source="canLockInvoice"
          label="generic.invoiceLock"
          key={filterValues.termMeterNumber}
          alwaysOn
          choices={[
            {
              id: 'cannot',
              name: 'generic.cannot',
            },
            { id: 'can', name: 'generic.can' },
            { id: 'notUse', name: 'generic.notUse' },
          ]}
        />
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
  }
}
export default InvoiceLockFilters;
