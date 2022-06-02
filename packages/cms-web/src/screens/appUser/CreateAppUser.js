import {
  Create,
  SimpleForm,
  TextInput,
  required,
  email,
  withDataProvider,
  CUSTOM,
  translate,
  FormDataConsumer,
  BooleanInput,
} from 'ra-loopback3';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import clone from 'lodash/clone';
import omit from 'lodash/omit';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import Config from '../../Config';
import CustomSelectArrayInput from '../../components/common/field/CustomSelectArrayInput';
import { getDistricts, getProvinces, getWards, getQuarters } from './utils';

@withDataProvider
class CreateAppUser extends Component {
  state = {
    provinces: [],
    districts: [],
    wards: [],
    quarters: [],
    selectedRoles: [],
    roles: [],
  };

  componentDidMount = () => {
    this.getGeoData();
    this.getRoleData();
  };

  getGeoData = () => {
    const { dataProvider } = this.props;
    dataProvider(CUSTOM, 'GeoProvinces', { fullUrl: true }).then(({ data }) => this.setState({ provinces: data }));
    dataProvider(CUSTOM, 'GeoDistricts', { fullUrl: true }).then(({ data }) => this.setState({ districts: data }));
    dataProvider(CUSTOM, 'GeoWards', { fullUrl: true }).then(({ data }) => this.setState({ wards: data }));
    dataProvider(CUSTOM, 'GeoQuarters', { fullUrl: true }).then(({ data }) => this.setState({ quarters: data }));
  };

  getRoleData = () => {
    const { id, dataProvider } = this.props;
    if (id) {
      dataProvider(CUSTOM, 'AppUsers', {
        method: 'GET',
        subUrl: 'getRolesByAppUserId',
        fullUrl: true,
        query: { id },
      }).then(({ data: { roles } }) => {
        if (roles) {
          this.setState({ selectedRoles: roles.map(({ id }) => id) });
        }
      });
    }
    dataProvider(CUSTOM, 'Roles', {
      rawFilter: { where: { name: { like: `${Config.projectKey}.*` } } },
    }).then(({ data: roles }) => {
      if (roles) {
        this.setState({ roles: roles.map(({ id, title }) => ({ id, title })) });
      }
    });
  };

  handleRoleChange = event => {
    this.setState({ selectedRoles: event.target.value });
  };

  handleRoleDelete = roleIdToDelete => () => {
    this.setState(state => {
      const remainedSelectedRoles = state.selectedRoles.filter(id => id !== roleIdToDelete);
      return { selectedRoles: remainedSelectedRoles };
    });
  };

  saveAppUser = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    const { selectedRoles } = this.state;
    const wardInChargeIds = clone(record.wards) || [];
    const quarterInChargeIds = clone(record.quarters) || [];
    const newRecord = omit(record, ['wards', 'quarters', 'isWaterCounter']);
    this.props.dataProvider(
      CUSTOM,
      'AppUsers',
      {
        method: 'POST',
        subUrl: 'saveAppUser',
        body: { data: { ...newRecord, wardInChargeIds, quarterInChargeIds, roles: selectedRoles } },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };

  onChange = formData => {
    if (has(formData, 'target.name') && formData.target.name === 'isWaterCounter') {
      return;
    }

    if (!isEmpty(formData.districts)) {
      const { districts } = this.state;
      const fullDistricts = districts.filter(({ id }) => formData.districts.includes(id));
      formData.districts = fullDistricts
        .filter(({ provinceId }) => formData.provinces.includes(provinceId))
        .map(({ id }) => id);
    }

    if (!isEmpty(formData.wards)) {
      const { wards } = this.state;
      const fullWards = wards.filter(({ id }) => formData.wards.includes(id));
      formData.wards = fullWards
        .filter(({ districtId }) => formData.districts.includes(districtId))
        .map(({ id }) => id);
    }

    if (!isEmpty(formData.quarters)) {
      const { quarters } = this.state;
      const fullQuarters = quarters.filter(({ id }) => formData.quarters.includes(id));
      formData.quarters = fullQuarters.filter(({ wardId }) => formData.wards.includes(wardId)).map(({ id }) => id);
    }
  };

  asyncValidate = values => {
    // Check if given email and username is taken or not
    const { dataProvider, translate } = this.props;
    if (values.email) {
      return dataProvider(CUSTOM, 'AppUsers', {
        subUrl: 'count',
        fullUrl: true,
        method: 'GET',
        query: { where: JSON.stringify({ email: values.email }) },
      }).then(({ data: { count } }) => {
        if (count > 0) {
          throw { email: translate('resources.appusers.messages.enterUsedEmail') };
        }
      });
    } else if (values.username) {
      return dataProvider(CUSTOM, 'AppUsers', {
        subUrl: 'count',
        fullUrl: true,
        method: 'GET',
        query: { where: JSON.stringify({ username: values.username }) },
      }).then(({ data: { count } }) => {
        if (count > 0) {
          throw { username: translate('resources.appusers.messages.enterUsedUsername') };
        }
      });
    }
  };

  render() {
    const { provinces, districts, wards, quarters, selectedRoles, roles } = this.state;

    return (
      <Create title="generic.pages.editAppUser" {...this.props} save={this.saveAppUser}>
        <SimpleForm
          redirect="list"
          onChange={this.onChange}
          asyncValidate={this.asyncValidate}
          asyncBlurFields={['username', 'email']}
        >
          <TextInput source="fullName" validate={required()} />
          <TextInput source="username" validate={required()} inputProps={{ autoComplete: 'off' }} />
          <TextInput source="password" type="password" validate={required()} inputProps={{ autoComplete: 'off' }} />
          <CustomSelectArrayInput
            label={this.props.translate('resources.appusers.fields.role')}
            selectedValues={selectedRoles}
            options={roles}
            handleDelete={this.handleRoleDelete}
            handleChange={this.handleRoleChange}
          />
          <BooleanInput label="resources.appusers.isWaterCounter" source="isWaterCounter" />
          <FormDataConsumer>
            {({ formData }) => formData.isWaterCounter && getProvinces(formData, provinces)}
          </FormDataConsumer>
          <FormDataConsumer>
            {({ formData }) => formData.isWaterCounter && getDistricts(formData, districts)}
          </FormDataConsumer>
          <FormDataConsumer>{({ formData }) => formData.isWaterCounter && getWards(formData, wards)}</FormDataConsumer>
          <FormDataConsumer>
            {({ formData }) => formData.isWaterCounter && getQuarters(formData, quarters)}
          </FormDataConsumer>
          <TextInput source="email" validate={[required(), email()]} />
        </SimpleForm>
      </Create>
    );
  }
}

CreateAppUser.propTypes = {
  dataProvider: PropTypes.func,
  translate: PropTypes.func,
  id: PropTypes.string,
};

export default compose(translate)(CreateAppUser);
