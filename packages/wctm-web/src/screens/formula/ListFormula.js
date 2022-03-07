import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Datagrid, TextField, Filter, translate, TextInput, SFEditButton } from 'ra-loopback3';
import compose from 'recompose/compose';

const FormulaFilter = ({ translate, ...rest }) => (
  <Filter {...rest}>
    <TextInput label={'generic.search'} source="name" alwaysOn />
  </Filter>
);
FormulaFilter.propTypes = {
  translate: PropTypes.func,
};
class ListFormula extends Component {
  render() {
    return (
      <List
        {...this.props}
        resource="formulas"
        filters={<FormulaFilter />}
        permissionCreateDefault={{ name: 'formula', action: 'create' }}
        permissionDeleteDefault={{ name: 'formula', action: 'delete' }}
      >
        <Datagrid>
          <TextField source="name" />
          <TextField source="sewageFee" />
          <TextField source="tax" />
          <SFEditButton permission={{ name: 'formula', action: 'edit' }} />
        </Datagrid>
      </List>
    );
  }
}
ListFormula.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

ListFormula.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default compose(translate)(ListFormula);
