//tham khảo: https://www.epa.ie/pubs/advice/water/quality/Water_Quality.pdf
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  translate,
  TextField,
  List,
  Datagrid,
  EditButton,
  ShowButton,
  SelectField,
  Filter,
  TextInput,
  DateField,
  NumberField,
  ArrayField,
  SingleFieldList,
  ChipField,
  Rank,
  BooleanField,
  ReferenceArrayField
} from 'ra-loopback3';
import { Chip } from '@material-ui/core';
import { compose } from 'recompose';
import config from '../../Config';

const Filters = props => (
  <Filter {...props}>
    <TextInput source="name" label={'generic.search'} alwaysOn />
  </Filter>
);

const TagsField = ({ record }) =>
  record.skills ? (
    <ul>
      {record.skills.map(item => (
        <Chip key={item} label={item} />
      ))}
    </ul>
  ) : null;
TagsField.defaultProps = {
  addLabel: true,
};

class ListPostJob extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List {...rest} filters={<Filters />} resource="tests" hasCreate={false} sort={{ field: 'jobMatchRank', order: 'DESC' }}>
        <Datagrid>
          <TextField source="name" label="Job name" />
          <Rank label="Rank" source="jobMatchRank"></Rank>
          <NumberField source="estimatedCost" label="Budget (ADA)" />
          <NumberField source="requiredAda" label="Required (ADA)" />

        
          <ReferenceArrayField source="skills" reference="skills" label="required skills">
                <Datagrid>
                  <TextField source="name" />
                </Datagrid>
              </ReferenceArrayField>
          <BooleanField source="expired" label="Still validated" />
          <DateField source="expectedDate" label="Expired date" />

          <DateField source="createdDate" label="Created date" />
          <ShowButton label="View Detail" />
          <EditButton label="Place a bid" />
        </Datagrid>
      </List>
    );
  }
}

ListPostJob.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

export default compose(translate)(ListPostJob);
