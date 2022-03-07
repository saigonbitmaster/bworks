import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  List,
  Filter,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  TextInput,
  EditButton,
  translate,
  Responsive,
  FunctionField,
} from 'ra-loopback3';

const ConfigurationFilter = ({ translate, ...rest }) => (
  <Filter {...rest}>
    <TextInput label={translate('generic.search')} source="value" alwaysOn />
  </Filter>
);
ConfigurationFilter.propTypes = {
  translate: PropTypes.func,
};

class ConfigurationList extends Component {
  valueField = record => {
    if (typeof record.value === 'number') return record.value;
    else if (typeof record.value === 'object') {
      let tmp = Object.keys(record.value);
      if (tmp.length === 1) {
        return record.value[tmp[0]].value;
      } else return '...';
    }
  };
  translateId = element => {
    let id = element.id;
    return this.props.translate(`resources.srcconfigs.fields.ids.${id}`);
  };
  translateSide = element => {
    let side = element.side;
    return this.props.translate(`resources.srcconfigs.fields.sides.${side}`);
  };
  render() {
    return (
      <List
        title={this.props.translate('resources.srcconfigs.listTitle')}
        {...this.props}
        resource="srcconfigs"
        filters={<ConfigurationFilter translate={this.props.translate} />}
      >
        <Responsive
          medium={
            <Datagrid>
              <ReferenceField reference="srcconfigs" source="id">
                <FunctionField source="id" render={this.translateId} />
              </ReferenceField>
              {/* <FunctionField source="side" render={this.translateSide} /> */}
              <FunctionField source="value" render={this.valueField} />
              <DateField source="updatedDate" />
              <EditButton />
            </Datagrid>
          }
          small={
            <Datagrid>
              <TextField source="id" />
              <TextField source="side" />
              <EditButton />
            </Datagrid>
          }
        />
      </List>
    );
  }
}
ConfigurationList.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

ConfigurationList.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(translate);
export default enhance(ConfigurationList);
