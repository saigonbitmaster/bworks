import React, { Component } from 'react';
import { Toolbar, Button, SaveButton, Edit, SimpleForm, TextInput } from 'ra-loopback3';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const ChangePasswordToolbar = props => (
  <Toolbar {...props}>
    <SaveButton />
  </Toolbar>
);

class ChangePasswordPanel extends Component {
  state = { visible: true };

  displayPassword = () => this.setState({ visible: !this.state.visible });

  render() {
    const { visible } = this.state;
    return (
      <Edit {...this.props} title=" ">
        <SimpleForm form={`reset-password_${this.props.id}`} toolbar={<ChangePasswordToolbar />}>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <TextInput type={visible ? 'password' : 'text'} source="password" label="New password" />
            <Button onClick={this.displayPassword}>{visible ? <Visibility /> : <VisibilityOff />}</Button>
          </div>
        </SimpleForm>
      </Edit>
    );
  }
}

export default ChangePasswordPanel;
