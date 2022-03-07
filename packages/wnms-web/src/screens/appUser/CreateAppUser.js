import { Create, SimpleForm, TextInput, required, email, withDataProvider, CUSTOM, translate } from 'ra-loopback3';
import React, { Component } from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import CustomSelectArrayInput from '../../components/commons/CustomSelectArrayInput';
import config from '../../Config';
@withDataProvider
class CreateAppUser extends Component {
  formRef = React.createRef();
  state = {
    selectedRoles: [],
    roles: [],
  };

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
      rawFilter: { where: { name: { like: `${config.projectKey}.*` } } },
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
    this.props.dataProvider(
      CUSTOM,
      'AppUsers',
      {
        method: 'POST',
        subUrl: 'saveAppUser',
        body: { data: { ...record, project: config.projectKey, roles: selectedRoles } },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };

  render() {
    const { selectedRoles, roles } = this.state;
    return (
      <Create title="generic.pages.editAppUser" {...this.props} save={this.saveAppUser}>
        <SimpleForm redirect="list" onChange={this.onChange}>
          <TextInput source="fullName" validate={required()} />
          <TextInput source="username" validate={required()} />
          <TextInput source="password" type="password" validate={required()} />
          <CustomSelectArrayInput
            label={this.props.translate('resources.appusers.fields.role')}
            selectedValues={selectedRoles}
            options={roles}
            handleDelete={this.handleRoleDelete}
            handleChange={this.handleRoleChange}
          />
          <TextInput source="email" validate={[required(), email()]} />
        </SimpleForm>
      </Create>
    );
  }
}
CreateAppUser.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
  id: PropTypes.string,
};
export default compose(translate)(CreateAppUser);
