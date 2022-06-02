'use strict';
import {
  List,
  TextField,
  withDataProvider,
  SFEditButton,
  // EditButton,
  Button,
  // BooleanField,
  CUSTOM,
  translate,
  refreshView,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
  CustomDatagrid,
} from 'ra-loopback3';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BooleanFieldCustom from '../../components/common/field/BooleanFieldCustom';
import { BanIcon, ResumeIcon, ChangePasswordIcon } from '../../styles/Icons';
import RoleForAppUserField from './RoleForAppUserField';

import ChangePasswordPanel from './ChangePasswordPanel';

@connect(null, { refreshView })
@withDataProvider
class BanButton extends Component {
  static propTypes = {
    dataProvider: PropTypes.func,
    record: PropTypes.object,
    refreshView: PropTypes.func,
    permission: PropTypes.object,
  };

  ban = async (id, isBanned) => {
    const reversedBanStatus = !!isBanned;
    await this.props.dataProvider(CUSTOM, 'AppUsers', {
      method: 'POST',
      subUrl: 'banUser',
      fullUrl: true,
      body: { isBanned: !reversedBanStatus, userId: id },
    });
    this.props.refreshView();
  };

  render() {
    const { record, permission } = this.props;

    let icon, label;

    if (record.isBanned) {
      icon = <ResumeIcon />;
      label = 'generic.resume';
    } else {
      icon = <BanIcon />;
      label = 'generic.ban';
    }
    return (
      <Button onClick={() => this.ban(record.id, record.isBanned)} label={label} permission={permission}>
        {icon}
      </Button>
    );
  }
}

@withDataProvider
@translate
class ListAppUser extends Component {
  static propTypes = {
    dataProvider: PropTypes.func,
    record: PropTypes.object,
    translate: PropTypes.func,
    permission: PropTypes.object,
  };
  render() {
    return (
      <List
        {...this.props}
      
        permissionCreateDefault={{ name: 'appuser', action: 'create' }}
        permissionDeleteDefault={{ name: 'appuser', action: 'delete' }}
      >
        <CustomDatagrid expand={<ChangePasswordPanel />}>
          <TextField source="fullName" />
          <TextField source="username" />
          <TextField source="email" />
          <BooleanFieldCustom source="isBanned" />
          <RoleForAppUserField
            record={this.props.record}
            label={this.props.translate('resources.appusers.fields.role')}
          />
          <BanButton permission={{ name: 'appuser', action: 'ban' }} />
          <Button label="Đổi mật khẩu" expandPanel={true}>
            <ChangePasswordIcon />
          </Button>
          <SFEditButton permission={{ name: 'appuser', action: 'edit' }} />
        </CustomDatagrid>
      </List>
    );
  }
}

export default ListAppUser
