import {
  Create,
  SimpleForm,
  TextInput,
  required,
  email,
  withDataProvider,
  CUSTOM,
  translate,
  BooleanInput
} from 'ra-loopback3';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CustomSelectArrayInput from '../../components/common/field/CustomSelectArrayInput';

@withDataProvider
@translate
class CreateAppUser extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      selectedRoles: [],
      roles: [],
    };
  }
  componentDidMount = () => {
    this.getRoleData();
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
     
    }).then(({ data: roles }) => {
      if (roles) {
        this.setState({ roles: roles.map(({ id, name }) => ({ id, name })) });
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
    this.props.dataProvider(
      CUSTOM,
      'AppUsers',
      {
        method: 'POST',
        subUrl: 'saveAppUser',
        body: { data: { ...record, roles: selectedRoles } },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
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
          throw { email: "Email is already in use" };
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
          throw { username: "Username is already in use" };
        }
      });
    }
  };

  render() {
    const {  selectedRoles, roles } = this.state;
    return (
      <Create title="generic.pages.editAppUser" {...this.props} save={this.saveAppUser}>
        <SimpleForm
          redirect="list"
          asyncValidate={this.asyncValidate}
          asyncBlurFields={['username', 'email']}
        >
          <TextInput source="fullName" validate={required()} />
          <TextInput source="username" validate={required()}  />
          <TextInput source="password" type="password"   />
          <CustomSelectArrayInput
            label={this.props.translate('resources.accounts.fields.role')}
            selectedValues={selectedRoles}
            options={roles}
            handleDelete={this.handleRoleDelete}
            handleChange={this.handleRoleChange}
          />
          
          <TextInput source="email" validate={[required(), email()]} />
          <BooleanInput source="emailVerified" default={true}  label={this.props.translate('resources.accounts.fields.emailVerified')} /> 
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

export default CreateAppUser;
