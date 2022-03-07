import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  withDataProvider,
  CUSTOM,
  translate,
  TextField,
  List,
  Datagrid,
  DateField,
  SFEditButton,
  SFShowButton,
} from 'ra-loopback3';
import { compose } from 'recompose';

class CtmTemplateList extends Component {
  state = {
    hasCreate: true,
  };

  componentDidMount = () => {
    const { dataProvider } = this.props;
    dataProvider(CUSTOM, 'ctmtemplates', { subUrl: 'getId' }).then(({ data }) => {
      if (!data || data.length === 0) {
        this.setState({ hasCreate: !this.state.hasCreate });
      }
    });
  };

  render() {
    const { hasCreate } = this.state;
    const { dataProvider, dispatch, ...rest } = this.props;
    return (
      <List
        {...rest}
        bulkActionButtons={false}
        permissionCreateDefault={{ name: 'CtmTemplate', action: 'create' }}
        hasCreate={hasCreate}
      >
        <Datagrid>
          <TextField source="id" />
          <DateField source="updatedDate" />
          {/* <SFShowButton permission={{ name: 'CtmTemplate', action: 'examine' }} /> */}
          <SFEditButton permission={{ name: 'CtmTemplate', action: 'edit' }} />
        </Datagrid>
      </List>
    );
  }
}

CtmTemplateList.propTypes = {
  dataProvider: PropTypes.func,
  translate: PropTypes.func,
  dispatch: PropTypes.func,
};

const enhance = compose(withDataProvider, translate);
export default enhance(CtmTemplateList);
