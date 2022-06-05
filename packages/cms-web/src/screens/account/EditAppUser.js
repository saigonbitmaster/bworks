import { Edit, SimpleForm, TextInput, required, email, CUSTOM, withDataProvider, translate, BooleanInput } from 'ra-loopback3';
import React, { Component } from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import CustomSelectArrayInput from '../../components/common/field/CustomSelectArrayInput';

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
    dataProvider(CUSTOM, 'Roles', {}).then(({ data: roles }) => {
      if (roles) {
        this.setState({ roles: roles.map(({ id, name }) => ({ id, name })) });
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
        body: { data: { roles: selectedRoles } },
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
          throw { email: translate('resources.accounts.messages.enterUsedEmail') };
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
          throw { username: translate('resources.accounts.messages.enterUsedUsername') };
        }
      });
    }
  };

  render() {
    const { selectedRoles, roles } = this.state;
    return (
      <Edit title="generic.pages.editAppUser" {...this.props} save={this.saveAppUser}>
        <SimpleForm asyncValidate={this.asyncValidate} asyncBlurFields={['username', 'email']}>
          <TextInput source="fullName" validate={required()} />
          <TextInput source="username" validate={required()} />
          <CustomSelectArrayInput
            label={this.props.translate('resources.accounts.fields.role')}
            selectedValues={selectedRoles}
            options={roles}
            handleDelete={this.handleRoleDelete}
            handleChange={this.handleRoleChange}
          />

          <TextInput source="email" validate={email()} />
          <BooleanInput source="emailVerified" default={true}  label={this.props.translate('resources.accounts.fields.emailVerified')} /> 
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
