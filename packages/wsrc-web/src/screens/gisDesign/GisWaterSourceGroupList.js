import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  translate,
  TextField,
  List,
  Datagrid,
  // EditButton,
  ShowButton,
  SelectField,
  // Filter,
  // TextInput,
  NumberField,
} from 'ra-loopback3';
import { compose } from 'recompose';
import config from '../../Config';
// import { Create as CreateIcon } from '@material-ui/icons';

// const Filters = props => (
//   <Filter {...props}>
//     <TextInput source="name" label={'generic.search'} alwaysOn />
//   </Filter>
// );

class GisWaterSourceGroupList extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List {...rest} sub={true} resource="watersourcegroups">
        <Datagrid>
          <TextField source="name" />
          <SelectField
            source="type"
            choices={config.typeOfWaterSourceGroup}
            translateChoice={true}
            optionText="name"
            optionValue="id"
          />
          <NumberField source="estimatedReserves" />
          <TextField source="address" />
          <ShowButton />
          {/* <EditButton linkTo={null} onClick={() => console.log('hello')} /> */}
        </Datagrid>
      </List>
    );
  }
}

GisWaterSourceGroupList.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

export default compose(translate)(GisWaterSourceGroupList);
