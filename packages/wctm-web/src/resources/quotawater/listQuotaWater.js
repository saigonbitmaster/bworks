import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Datagrid,
  TextField,
  HtmlField,
  NumberField,
  Filter,
  translate,
  SFShowButton,
  SFEditButton,
  TextInput,
} from 'ra-loopback3';
import compose from 'recompose/compose';

const QuotaWaterFilter = props => (
  <Filter {...props}>
    <TextInput source="name" label={'generic.search'} alwaysOn />
  </Filter>
);

class ListQuotaWater extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List
        {...rest}
        resource="quotawaters"
        sort={{ field: 'createdDate', order: 'DESC' }}
        filters={<QuotaWaterFilter />}
        bulkActionButtons={false}
      >
        <Datagrid>
          <TextField source="name" />
          <NumberField source="value" />
          <HtmlField source="description" />
          <SFShowButton permission={{ name: 'QuotaWater', action: 'examine' }} />
          <SFEditButton permission={{ name: 'QuotaWater', action: 'edit' }} />
        </Datagrid>
      </List>
    );
  }
}
ListQuotaWater.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  dataProvider: PropTypes.func,
};

ListQuotaWater.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: true,
};

const enhance = compose(translate);
export default enhance(ListQuotaWater);
