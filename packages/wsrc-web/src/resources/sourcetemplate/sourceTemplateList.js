import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  withDataProvider,
  translate,
  TextField,
  List,
  Datagrid,
  DateField,
  EditButton,
  ShowButton,
} from 'ra-loopback3';
import { compose } from 'recompose';

class SourceTemplateList extends Component {
  render() {
    const { dataProvider, dispatch, ...rest } = this.props;
    return (
      <List {...rest}>
        <Datagrid>
          <TextField source="id" />
          <TextField source="name" />
          <DateField source="updatedDate" />
          <ShowButton />
          <EditButton />
          {/* <DeleteButton /> */}
        </Datagrid>
      </List>
    );
  }
}

SourceTemplateList.propTypes = {
  dataProvider: PropTypes.func,
  translate: PropTypes.func,
  dispatch: PropTypes.func,
};

const enhance = compose(withDataProvider, translate);
export default enhance(SourceTemplateList);
