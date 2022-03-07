import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  translate,
  TextField,
  List,
  Datagrid,
  EmailField,
  SFEditButton,
  SFShowButton,
  UrlField,
  Filter,
  TextInput,
  BooleanField,
} from 'ra-loopback3';
import { compose } from 'recompose';
import ActiveButton from './ActiveButton';
const Filters = props => (
  <Filter {...props}>
    <TextInput source="name" label={'generic.search'} alwaysOn />
  </Filter>
);
class CtmCompanyList extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List
        {...rest}
        resource="ctmcompanies"
        filters={<Filters />}
        permissionCreateDefault={{ name: 'CtmCompany', action: 'create' }}
        permissionDeleteDefault={{ name: 'CtmCompany', action: 'delete' }}
      >
        <Datagrid>
          <TextField source="name" />
          <TextField source="address" />
          <TextField source="phone" />
          <EmailField source="email" />
          <UrlField source="website" />
          <TextField source="contactPerson" />
          {/* <TextField source="phoneSupport" /> */}
          <BooleanField source="active" />
          <SFShowButton permission={{ name: 'CtmCompany', action: 'examine' }} />
          <SFEditButton permission={{ name: 'CtmCompany', action: 'edit' }} />
          <ActiveButton permission={{ name: 'CtmCompany', action: 'activate' }} />
        </Datagrid>
      </List>
    );
  }
}
CtmCompanyList.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};
export default compose(translate)(CtmCompanyList);
