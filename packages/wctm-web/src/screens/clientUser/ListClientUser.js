import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  CustomReferenceField,
  CUSTOM,
  withTranslate,
  withDataProvider,
  Button,
  showNotification,
  refreshView,
} from 'ra-loopback3';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import Typography from '@material-ui/core/Typography';
import FalseIcon from '@material-ui/icons/Clear';
import TrueIcon from '@material-ui/icons/Done';
import get from 'lodash/get';
import ClientFilter from '../client/ClientFilter';
import AccountCircle from '@material-ui/icons/AccountCircle';
import DefaultPasswordForm from './DefaultPasswordForm';

const ClientUserBulkAction = ({ handleOpenDialog, selectedIds, translate, permission }) => (
  <Button
    label={translate('resources.clientusers.createAccountWithDefaultPassword')}
    onClick={() => handleOpenDialog(selectedIds)}
    permission={permission}
  >
    <AccountCircle />
  </Button>
);

class PasswordField extends Component {
  state = {
    displayPassword: false,
  };

  toggleDisplayPassword = () => {
    const { displayPassword } = this.state;
    this.setState({ displayPassword: !displayPassword });
  };

  render = () => {
    const { displayPassword } = this.state;
    const { value } = this.props;
    return (
      <Button
        style={{ textTransform: 'none' }}
        label={displayPassword ? value : '*'.repeat(value.length)}
        onClick={this.toggleDisplayPassword}
      />
    );
  };
}

class ListClientUser extends Component {
  refFilter = React.createRef();
  state = {
    isMounted: false,
    openDialog: false,
    selectedIds: [],
  };

  componentDidMount = () => {
    this.setState({ isMounted: true });
  };

  componentWillUnmount = () => {
    this.setState({ isMounted: false });
  };

  handleDistrictChange = filterValues => {
    if (filterValues.wardId || filterValues.quarterId) {
      this.refFilter.current.props.change('wardId', '');
      this.refFilter.current.props.change('quarterId', '');
    }
  };

  handleWardChange = filterValues => {
    if (filterValues.quarterId) {
      this.refFilter.current.props.change('quarterId', '');
    }
  };

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  };

  handleOpenDialog = selectedIds => {
    this.setState({ openDialog: true, selectedIds });
  };

  handleCreateAccountWithDefaultPassword = ids => {
    const { showNotification, defaultPassword, dataProvider, refreshView, translate } = this.props;

    if (!defaultPassword) {
      showNotification(400, translate('error.EMPTY_DEFAULT_PASSWORD'));
    } else {
      dataProvider(CUSTOM, 'ClientUsers', {
        subUrl: 'createAccountWithDefaultPassword',
        method: 'POST',
        body: { clientIds: ids, defaultPassword },
      }).then(() => {
        this.setState({ openDialog: false }, () => refreshView());
      });
    }
  };

  getReferencedClient = (dataProvider, record) => {
    const { isMounted } = this.state;
    return dataProvider(CUSTOM, 'ClientUsers', {
      fullUrl: true,
      query: {
        filter: JSON.stringify({
          where: { clientId: record.id },
          fields: { approved: true, createdByAdmin: true, defaultPassword: true },
        }),
      },
    }).then(({ data }) => {
      if (Array.isArray(data) && data.length > 0) {
        const approvalStatus = get(data, '[0].approved');
        const createdByAdmin = get(data, '[0].createdByAdmin');
        const defaultPassword = get(data, '[0].defaultPassword');
        const accountCreationStatus = createdByAdmin ? createdByAdmin : approvalStatus;
        const referencedData = { approved: accountCreationStatus, isMounted, defaultPassword };
        return referencedData;
      }
    });
  };

  render() {
    const { openDialog, selectedIds } = this.state;
    const { translate, dataProvider, ...rest } = this.props;

    return (
      <Fragment>
        <List
          {...rest}
          refFilter={this.refFilter}
          filters={
            <ClientFilter
              handleDistrictChange={this.handleDistrictChange}
              handleWardChange={this.handleWardChange}
              handleDefaultPassword={this.handleDefaultPassword}
            />
          }
          bulkActionButtons={
            <ClientUserBulkAction
              translate={translate}
              handleOpenDialog={this.handleOpenDialog}
              permission={{ name: 'clientusers', action: 'createAccountWithDefaultPassword' }}
            />
          }
        >
          <Datagrid>
            <TextField source="code" sortable={false} />
            <TextField source="name" sortable={false} />
            <TextField source="formattedAddress" sortable={false} />
            <CustomReferenceField
              customData={this.getReferencedClient}
              label={translate('resources.clientusers.fields.defaultPassword')}
              reference="clientusers"
              dataProvider={dataProvider}
              linkType={false}
            >
              <FunctionField
                render={record => (
                  <Typography component="span" variant="body1">
                    {record.defaultPassword ? <PasswordField value={record.defaultPassword} /> : null}
                  </Typography>
                )}
              />
            </CustomReferenceField>
            <CustomReferenceField
              customData={this.getReferencedClient}
              label={translate('resources.clientusers.fields.accountCreationStatus')}
              reference="clientusers"
              dataProvider={dataProvider}
              linkType={false}
            >
              <FunctionField
                render={record => (
                  <Typography component="span" variant="body1" style={{}}>
                    {record.approved ? <TrueIcon data-testid="true" /> : <FalseIcon data-testid="false" />}
                  </Typography>
                )}
              />
            </CustomReferenceField>
          </Datagrid>
        </List>
        <DefaultPasswordForm
          openDialog={openDialog}
          handleCloseDialog={this.handleCloseDialog}
          handleCreateAccountWithDefaultPassword={this.handleCreateAccountWithDefaultPassword}
          selectedIds={selectedIds}
          translate={translate}
        />
      </Fragment>
    );
  }
}

ListClientUser.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
};

export default compose(
  connect(
    state => ({
      defaultPassword: formValueSelector('defaultPasswordForm')(state, 'defaultPassword'),
    }),
    { showNotification, refreshView },
  ),
  withTranslate,
  withDataProvider,
)(ListClientUser);
