import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Filter,
  TextInput,
  SelectInput,
  FunctionField,
  Datagrid,
  TextField,
  NumberWithUnitField,
  translate,
  withDataProvider,
  CardActions,
  // Button,
  RefreshButton,
} from 'ra-loopback3';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';
import { push as pushAction } from 'react-router-redux';
// import { PrintIcon } from '../../styles/Icons';
import config from '../../Config';
class RawPostActions extends Component {
  onClickPrint = () => {
    this.props.push('/manageMaterial/print');
  };
  render() {
    return (
      <CardActions>
        {/* <Button onClick={this.onClickPrint} label={this.props.translate('generic.print')}>
          <PrintIcon />
        </Button> */}
        <RefreshButton />
      </CardActions>
    );
  }
}
RawPostActions.propTypes = {
  push: PropTypes.func,
  translate: PropTypes.func,
  basePath: PropTypes.string,
};
const PostActions = connect(null, {
  push: pushAction,
})(RawPostActions);

const MatUseFilter = props => {
  const { translate, filterValues, ...rest } = props;
  // console.log('MatUseFilter', filterValues);
  return (
    <Filter {...rest} filterValues={filterValues}>
      <TextInput label={'generic.searchMatName'} source="$text.search" alwaysOn />
      <SelectInput
        choices={config.materialChoices}
        translateChoice={true}
        optionText="name"
        optionValue="id"
        source="type"
        alwaysOn
      />
    </Filter>
  );
};
MatUseFilter.propTypes = {
  translate: PropTypes.func,
  filterValues: PropTypes.any,
};
class ListMatUse extends Component {
  state = {
    filter: {},
  };
  render() {
    const { translate, ...rest } = this.props;
    return (
      <List
        refController={this.refController}
        {...rest}
        resource="materialuses"
        fixUrl="materialuses/getUsedMat"
        title={translate('resources.materialuses.titleList')}
        filter={this.state.filter || {}}
        bulkActions={false}
        hasCreate={false}
        filters={<MatUseFilter />}
        actions={<PostActions {...this.props} />}
      >
        <Datagrid>
          <FunctionField
            source="type"
            render={record => {
              return translate(config.materialGroup[record.type]);
            }}
          />
          <TextField source="name" />
          <NumberWithUnitField source="usedTotal" unitKey={'unit'} translate={translate} textAlign={'left'} />
        </Datagrid>
      </List>
    );
  }
}
ListMatUse.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

ListMatUse.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const enhance = compose(
  translate,
  connect(null, {
    push: pushAction,
  }),
  pure,
  withDataProvider,
);
export default enhance(ListMatUse);
