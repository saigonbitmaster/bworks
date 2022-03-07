import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import {
  CUSTOM,
  List,
  Datagrid,
  TextField,
  Filter,
  SelectInput,
  BooleanField,
  withTranslate,
  withDataProvider,
  refreshView,
} from 'ra-loopback3';
import ApprovedButton from './ApprovedButton';

const CustomFilter = ({ filterValues, handleApprovalFilter, ...rest }) => (
  <Filter {...rest} filterValues={filterValues}>
    <SelectInput
      source="approved"
      alwaysOn
      choices={[
        { id: true, name: 'Đã phê duyệt' },
        { id: false, name: 'Chưa phê duyệt' },
      ]}
    />
  </Filter>
);

class ListClientUser extends Component {
  refFilter = React.createRef();

  handleApproved = id => {
    const { dataProvider, refreshView } = this.props;
    dataProvider(CUSTOM, 'ClientUsers', { subUrl: 'approveNewRequest', method: 'POST', body: { id } }).then(() =>
      refreshView(),
    );
  };

  render() {
    const { translate, dataProvider, ...rest } = this.props;
    return (
      <List
        {...rest}
        refFilter={this.refFilter}
        resource="clientusers"
        filter={{ and: [{ approved: { neq: null } }, { createdByAdmin: { neq: true } }], $keepNull: true }}
        filters={<CustomFilter handleApproved={this.handleApprovalFilter} />}
        permissionDeleteDefault={{ name: 'clientUserRequest', action: 'delete' }}
      >
        <Datagrid>
          <TextField source="name" sortable={false} />
          <TextField source="username" sortable={false} />
          <TextField source="email" sortable={false} />
          <TextField source="phoneNumber" sortable={false} />
          <BooleanField source="approved" sortable={false} />
          <ApprovedButton
            permission={{ name: 'clientUserRequest', action: 'approve' }}
            label={translate('resources.clientusers.fields.accountCreation')}
            handleApproved={this.handleApproved}
          />
        </Datagrid>
      </List>
    );
  }
}

ListClientUser.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
  refreshView: PropTypes.func,
};

export default compose(connect(null, { refreshView }), withTranslate, withDataProvider)(ListClientUser);
