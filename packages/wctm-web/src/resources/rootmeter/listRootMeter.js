import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  translate,
  TextField,
  List,
  Datagrid,
  SFEditButton,
  SFShowButton,
  ReferenceField,
  NumberField,
} from 'ra-loopback3';

import { compose } from 'recompose';

class ListRootMeter extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List
        {...rest}
        permissionCreateDefault={{ name: 'RootMeter', action: 'create' }}
        permissionDeleteDefault={{ name: 'RootMeter', action: 'delete' }}
      >
        <Datagrid>
          <TextField source="name" />
          <NumberField source="size" />
          <ReferenceField source="waterProviderId" reference="waterproviders">
            <TextField source="name" />
          </ReferenceField>
          <SFShowButton permission={{ name: 'RootMeter', action: 'examine' }} />
          <SFEditButton permission={{ name: 'RootMeter', action: 'edit' }} />
        </Datagrid>
      </List>
    );
  }
}

ListRootMeter.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

export default compose(translate)(ListRootMeter);
