import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  List,
  Datagrid,
  TextField,
  SFEditButton,
  translate,
  withDataProvider,
  CardActions,
  Button,
  DateField,
  BooleanField,
  BulkDeleteButton,
  CUSTOM,
  startCustomUndoable,
} from 'ra-loopback3';
import { connect } from 'react-redux';
import { push as pushAction } from 'react-router-redux';
import { ImportKmlIcon } from '../../styles/Icons';
class RawPostActions extends Component {
  onImport = () => {
    const { basePath } = this.props;
    this.props.push(`${basePath}/create`);
  };

  render() {
    // eslint-disable-next-line
    const { translate, push, ...rest } = this.props;
    return (
      <CardActions>
        <Button
          onClick={this.onImport}
          label={this.props.translate('resources.kmls.import')}
          permission={{ name: 'InputKml', action: 'import' }}
        >
          <ImportKmlIcon />
        </Button>
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

class BulkActionButtons extends Component {
  render() {
    return (
      <Fragment>
        <BulkDeleteButton {...this.props} permission={{ name: 'InputKml', action: 'delete' }} />
      </Fragment>
    );
  }
}
class KmlList extends Component {
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
      type: 'DELETE_KML',
      payload: async () => {
        return (
          dataProvider(CUSTOM, 'kmls/deleteKml', { query: { ids: selectedIds } })
            .then(() => {
              this.props.refeshMap();
              this.refList.current.updateData();
              this.refList.current.handleUnselectItems();
            })
            // eslint-disable-next-line
          .catch(e => {
              // console.log('error delete', e);
            })
        );
      },
      meta: {
        deleteData: { resource: 'kmls', ids: selectedIds },
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
    // console.log('kmllist render: ', this.props);
    const { refeshMap, dataProvider, startCustomUndoable, translate, subheading, ...rest } = this.props;
    return (
      <List
        {...rest}
        resource="kmls"
        refController={this.refList}
        actions={<PostActions {...this.props} />}
        bulkActionButtons={<BulkActionButtons onDelete={this.onDelete} />}
      >
        <Datagrid>
          <TextField source="fileNameReal" />
          {/* <TextField source="fileNameS3" /> */}
          <DateField source="createdDate" />
          <BooleanField source="active" />
          <SFEditButton permission={{ name: 'InputKml', action: 'edit' }} />
        </Datagrid>
      </List>
    );
  }
}
KmlList.propTypes = {
  refeshMap: PropTypes.func.isRequired,
  dataProvider: PropTypes.func,
  startCustomUndoable: PropTypes.func,
  translate: PropTypes.func,
  subheading: PropTypes.any,
};
KmlList.defaultProps = {};

const enhance = compose(
  connect(null, {
    startCustomUndoable,
  }),
  withDataProvider,
  translate,
);
export default enhance(KmlList);
