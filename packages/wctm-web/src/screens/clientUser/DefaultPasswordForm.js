import React, { Component, Fragment } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { reduxForm } from 'redux-form';
import { TextInput } from 'ra-loopback3';
import { Visibility, VisibilityOff } from '@material-ui/icons';

class DefaultPasswordInput extends Component {
  state = {
    displayPassword: false,
  };

  toggleDisplayPassword = () => {
    const { displayPassword } = this.state;
    this.setState({ displayPassword: !displayPassword });
  };

  render = () => {
    const { displayPassword } = this.state;
    const {
      openDialog,
      handleCloseDialog,
      handleCreateAccountWithDefaultPassword,
      selectedIds,
      translate,
      ...rest
    } = this.props;
    return (
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle style={{ marginBottom: '0', paddingBottom: '0' }}>
          {translate('resources.clientusers.createAccount')}
        </DialogTitle>
        <DialogContent>
          {displayPassword ? (
            <Fragment>
              <TextInput type="text" source="defaultPassword" label="" {...rest} />
              <Button onClick={this.toggleDisplayPassword}>
                <VisibilityOff />
              </Button>
            </Fragment>
          ) : (
            <Fragment>
              <TextInput type="password" source="defaultPassword" label="" {...rest} />
              <Button onClick={this.toggleDisplayPassword}>
                <Visibility />
              </Button>
            </Fragment>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCreateAccountWithDefaultPassword(selectedIds)} color="primary" autoFocus>
            {translate('resources.clientusers.defaultPassword')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
}

export default reduxForm({ form: 'defaultPasswordForm', enableReinitialize: true })(DefaultPasswordInput);
