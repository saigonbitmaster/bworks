import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  TextInput,
  Filter,
  SelectInput,
  List,
  Datagrid,
  TextField,
  FunctionField,
  translate,
  CUSTOM,
  startCustomUndoable,
  withDataProvider,
  BulkDeleteButton,
  SFEditButton,
} from 'ra-loopback3';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import config from '../../Config';

const MatTypeFilter = props => {
  const { translate, filterValues, ...rest } = props;
  // console.log('MatTypeFilter', filterValues);
  return (
    <Filter {...rest} filterValues={filterValues}>
      <TextInput label={'resources.materialdetailtypes.fields.searchType'} source="$text.search" alwaysOn />
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
MatTypeFilter.propTypes = {
  translate: PropTypes.func,
  filterValues: PropTypes.any,
};
class BulkActionButtons extends Component {
  render() {
    return (
      <Fragment>
        <BulkDeleteButton {...this.props} permission={{ name: 'MatDetailType', action: 'delete' }} />
      </Fragment>
    );
  }
}

class ListMatType extends Component {
  refList = React.createRef();
  componentDidMount() {
    this.refList.current.handleUnselectItems();
  }
  onDelete = selectedIds => {
    if (!selectedIds || !selectedIds.length) {
      return;
    }

    const { dataProvider, startCustomUndoable } = this.props;
    startCustomUndoable({
      type: 'DELETE_MAT_TYPE',
      payload: async () => {
        return (
          dataProvider(CUSTOM, 'materialdetailtypes/customDelete', { query: { ids: selectedIds } })
            .then(() => {
              this.refList.current.updateData();
              this.refList.current.handleUnselectItems();
            })
            // eslint-disable-next-line
          .catch(e => {
              // console.log('eror delete', e);
            })
        );
      },
      meta: {
        deleteData: { resource: 'materialdetailtypes', ids: selectedIds },
        onSuccess: {
          notification: {
            body: 'generic.confirmDelete',
            level: 'info',
            messageArgs: {
              smart_count: selectedIds.length,
            },
          },
        },
        onFailure: {
          notification: {
            body: 'ra.notification.http_error',
            level: 'warning',
          },
        },
      },
    });
  };
  render() {
    const { translate, startCustomUndoable, ...rest } = this.props;
    return (
      <List
        {...rest}
        bulkActionButtons={<BulkActionButtons onDelete={this.onDelete} />}
        resource="materialdetailtypes"
        filters={<MatTypeFilter />}
        refController={this.refList}
        permissionCreateDefault={{ name: 'MatDetailType', action: 'create' }}
      >
        <Datagrid>
          <FunctionField
            source="type"
            render={record => {
              return translate(config.materialGroup[record.type]);
            }}
          />
          <TextField source="name" />
          <SFEditButton permission={{ name: 'MatDetailType', action: 'edit' }} />
        </Datagrid>
      </List>
    );
  }
}
ListMatType.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  filterValues: PropTypes.any,
  dataProvider: PropTypes.func,
  startCustomUndoable: PropTypes.func,
};

ListMatType.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const enchance = compose(translate, withDataProvider, connect(null, { startCustomUndoable }));
export default enchance(ListMatType);
