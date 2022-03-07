import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  SFEditButton,
  List,
  Filter,
  Datagrid,
  TextField,
  // ReferenceField,
  DateField,
  TextInput,
  translate,
  BulkDeleteButton,
  CUSTOM,
  withDataProvider,
  startCustomUndoable,
} from 'ra-loopback3';
import { connect } from 'react-redux';

const NodeFilter = ({ translate, ...rest }) => (
  <Filter {...rest}>
    <TextInput label={translate('generic.search')} source="name" alwaysOn />
  </Filter>
);
NodeFilter.propTypes = {
  translate: PropTypes.func,
};

class BulkActionButtons extends Component {
  render() {
    return (
      <Fragment>
        <BulkDeleteButton {...this.props} permission={{ name: 'Design', action: 'delete' }} />
      </Fragment>
    );
  }
}

class NodeList extends Component {
  refList = React.createRef();
  onDelete = selectedIds => {
    if (!selectedIds || !selectedIds.length) {
      return;
    }

    const { dataProvider, startCustomUndoable } = this.props;
    startCustomUndoable({
      type: 'DELETE_NODE',
      payload: async () => {
        return (
          dataProvider(CUSTOM, 'nodes/deleteNode', { query: { ids: selectedIds } })
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
        deleteData: { resource: 'nodes', ids: selectedIds },
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
  componentDidMount() {
    this.refList.current.handleUnselectItems();
  }
  render() {
    let { translate, startCustomUndoable, updateView, onUpdateList, dataProvider, ...rest } = this.props;
    return (
      <List
        {...rest}
        refController={this.refList}
        bulkActionButtons={<BulkActionButtons onDelete={this.onDelete} />}
        resource="nodes"
        filters={<NodeFilter translate={translate} />}
        title={translate('generic.node')}
        permissionCreateDefault={{ name: 'Design', action: 'create' }}
      >
        <Datagrid>
          {/* <ReferenceField label="resources.nodes.fields.name" reference="nodes" source="id">
            <TextField source="name" />
          </ReferenceField> */}
          <TextField source="name" />
          <DateField source="updatedDate" />
          <SFEditButton permission={{ name: 'Design', action: 'edit' }} />
        </Datagrid>
      </List>
    );
  }
}

NodeList.propTypes = {
  dataProvider: PropTypes.func,
  updateView: PropTypes.number,
  onUpdateList: PropTypes.func,
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  startCustomUndoable: PropTypes.func,
};

NodeList.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(translate, withDataProvider, connect(null, { startCustomUndoable }));
export default enhance(NodeList);
