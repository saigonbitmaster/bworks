import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  email,
  CUSTOM,
  withDataProvider,
  FormDataConsumer,
  translate,
  SelectArrayInput,
  BooleanInput,
} from 'ra-loopback3';
import React, { Component } from 'react';
import compose from 'recompose/compose';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import has from 'lodash/has';
import omit from 'lodash/omit';
import Config from '../../Config';
import CustomSelectArrayInput from '../../components/common/field/CustomSelectArrayInput';
import { getProvinces, getDistricts } from './utils';




@withDataProvider
class EditAppUser extends Component {
  state = {
  
    
    selectedRoles: [],
    roles: [],
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

  componentDidMount = () => {
   
    
    this.getRoleData();
  };

  saveAppUser = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    const { selectedRoles } = this.state;
    this.props.dataProvider(
      CUSTOM,
      'AppUsers',
      {
        method: 'POST',
        subUrl: 'saveAppUser',
        body: { data: { ...omit(record, 'isWaterCounter'), roles: selectedRoles } },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
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

  handleChange = formData => {
    if (has(formData, 'target.name') && formData.target.name === 'isWaterCounter') {
      return;
    }

    if (!isEmpty(formData.districts) && !isEmpty(formData.provinces)) {
      const { districts } = this.state;
      if (!isEmpty(districts)) {
        const fullDistricts = districts.filter(({ id }) => formData.districts.includes(id));
        formData.districts = fullDistricts
          .filter(({ provinceId }) => formData.provinces.includes(provinceId))
          .map(({ id }) => id);
      }
    }

    if (!isEmpty(formData.wardInChargeIds) && !isEmpty(formData.districts)) {
      const { wards } = this.state;
      if (!isEmpty(wards)) {
        const fullWards = wards.filter(({ id }) => formData.wardInChargeIds.includes(id));
        formData.wardInChargeIds = fullWards
          .filter(({ districtId }) => formData.districts.includes(districtId))
          .map(({ id }) => id);
      }
    }

    if (!isEmpty(formData.quarterInChargeIds) && !isEmpty(formData.wardInChargeIds)) {
      const { quarters } = this.state;
      if (!isEmpty(quarters)) {
        const fullQuarters = quarters.filter(({ id }) => formData.quarterInChargeIds.includes(id));
        formData.quarterInChargeIds = fullQuarters
          .filter(({ wardId }) => formData.wardInChargeIds.includes(wardId))
          .map(({ id }) => id);
      }
    }
  };

  asyncValidate = values => {
    // Check if given email and username is taken or not
    const { dataProvider, translate, id } = this.props;
    if (values.email) {
      return dataProvider(CUSTOM, 'AppUsers', {
        subUrl: 'count',
        fullUrl: true,
        method: 'GET',
        query: { where: JSON.stringify({ email: values.email, id: { neq: id } }) },
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
        query: { where: JSON.stringify({ username: values.username, id: { neq: id } }) },
      }).then(({ data: { count } }) => {
        if (count > 0) {
          throw { username: translate('resources.appusers.messages.enterUsedUsername') };
        }
      });
    }
  };

  render() {
    const { selectedRoles, roles } = this.state;
    return (
      <Edit title="generic.pages.editAppUser" {...this.props} save={this.saveAppUser}>
        <SimpleForm
          onChange={this.handleChange}
          asyncValidate={this.asyncValidate}
          asyncBlurFields={['username', 'email']}
        >
          <TextInput source="fullName" validate={required()} />
          <TextInput source="username" validate={required()} />
          <CustomSelectArrayInput
            label={this.props.translate('resources.appusers.fields.role')}
            selectedValues={selectedRoles}
            options={roles}
            handleDelete={this.handleRoleDelete}
            handleChange={this.handleRoleChange}
          />
       
          <TextInput source="email" validate={email()} />
        </SimpleForm>
      </Edit>
    );
  }
}

EditAppUser.propTypes = {
  dataProvider: PropTypes.func,
  translate: PropTypes.func,
  id: PropTypes.string,
};

export default compose(translate)(EditAppUser);
