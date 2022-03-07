import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { List, Datagrid, TextField, SFEditButton, SFShowButton, translate, Filter, TextInput } from 'ra-loopback3';

const CountryFilter = ({ translate, ...rest }) => (
  <Filter {...rest}>
    <TextInput label={'generic.search'} source="$text.search" alwaysOn />
  </Filter>
);

class GeoCountryList extends Component {
  render() {
    const { translate, basePath, dispatch, ...rest } = this.props;
    return (
      <List
        filters={<CountryFilter />}
        title={translate('resources.geocountries.list')}
        {...rest}
        filterDefaultValues={{}}
        permissionCreateDefault={{ name: 'GeoCountry', action: 'create' }}
        permissionDeleteDefault={{ name: 'GeoCountry', action: 'delete' }}
      >
        <Datagrid>
          <TextField source="fullName" />
          <TextField source="code" />
          <TextField source="population" />
          <SFShowButton permission={{ name: 'GeoCountry', action: 'examine' }} />
          <SFEditButton permission={{ name: 'GeoCountry', action: 'edit' }} />
        </Datagrid>
      </List>
    );
  }
}
GeoCountryList.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  basePath: PropTypes.any,
  dispatch: PropTypes.any,
};
GeoCountryList.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const enhance = compose(translate);
export default enhance(GeoCountryList);
