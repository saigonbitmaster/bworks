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
  ChipField, BooleanField, ReferenceArrayField
} from 'ra-loopback3';
import {Chip} from "@material-ui/core"
import { compose } from 'recompose';
import config from '../../Config';

const Filters = props => (
  <Filter {...props}>
    <TextInput source="name" label={'generic.search'} alwaysOn />
  </Filter>
);




class ListPostJob extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List {...rest} filters={<Filters />} resource="BiddingJobs/rankBid"  filter={{jobId: 1}}>
        <Datagrid>
          <TextField source="name" label ="Job name"/>
         
          
          
          <NumberField source="estimatedCost" label="Budget (ADA)"/>
          <NumberField source="requiredAda" label="Required tokens for bidding (ADA)"/>
          <ReferenceArrayField label="Skills" reference="skills" source="skills">
                <SingleFieldList>
                    <ChipField source="name" />
                </SingleFieldList>
            </ReferenceArrayField>
<BooleanField source="expired" label="Still validated" />
<DateField source="expectedDate" label="Expire date"/>

<DateField source="createdDate" label="Created date" />
          <ShowButton label="View Detail"/>
          <EditButton />
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
