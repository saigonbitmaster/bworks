import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  List,
  Filter,
  Datagrid,
  TextField,
  // ReferenceField,
  // DateField,
  TextInput,
  SFEditButton,
  translate,
  NumberField,
  BulkDeleteButton,
  CUSTOM,
  startCustomUndoable,
  withDataProvider,
} from 'ra-loopback3';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { getFormValues } from 'redux-form';

const DmaFilter = ({ translate, ...rest }) => (
  <Filter {...rest}>
    <TextInput label={translate('generic.search')} source="name" alwaysOn />
  </Filter>
);
DmaFilter.propTypes = {
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

class DmaList extends Component {
  refList = React.createRef();
  state = {
    dmaId: get(this.props.viewFormValues, 'viewDmaId', {}),
  };
  componentDidMount() {
    this.refList.current.handleUnselectItems();
  }
  onDelete = selectedIds => {
    if (!selectedIds || !selectedIds.length) {
      return;
    }

    const { dataProvider, startCustomUndoable } = this.props;
    startCustomUndoable({
      type: 'DELETE_DMA',
      payload: async () => {
        return (
          dataProvider(CUSTOM, 'dmas/deleteDma', { query: { ids: selectedIds } })
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
        deleteData: { resource: 'dmas', ids: selectedIds },
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
  UNSAFE_componentWillReceiveProps(nextProps) {
    let dmaId = get(nextProps.viewFormValues, 'viewDmaId');
    if (dmaId != this.state.dmaId) {
      this.setState({ dmaId });
      this.refList.current.updateFilter();
    }
  }
  render() {
    const {
      viewFormValues,
      dataProvider,
      startCustomUndoable,
      translate,
      updateView,
      onUpdateList,
      subheading,
      ...rest
    } = this.props;
    let { dmaId } = this.state;
    return (
      <List
        {...rest}
        resource="dmas"
        filters={<DmaFilter translate={translate} />}
        bulkActionButtons={<BulkActionButtons onDelete={this.onDelete} />}
        refController={this.refList}
        title="DMA"
        filter={dmaId ? { id: dmaId } : {}}
        permissionCreateDefault={{ name: 'Design', action: 'create' }}
      >
        <Datagrid>
          {/* <ReferenceField label={translate('resources.dmas.fields.name')} reference="dmas" source="id">
            <TextField source="name" />
          </ReferenceField> */}
          <TextField source="name" />
          <NumberField source="level" textAlign="left" />
          <NumberField source="avgDemandDay" textAlign="left" />
          <NumberField source="supplyCapacityDay" textAlign="left" />
          <NumberField source="designPressure" textAlign="left" />
          <SFEditButton permission={{ name: 'Design', action: 'edit' }} />
        </Datagrid>
      </List>
    );
  }
}
DmaList.propTypes = {
  updateView: PropTypes.number,
  onUpdateList: PropTypes.func,
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  dataProvider: PropTypes.func,
  startCustomUndoable: PropTypes.func,
  subheading: PropTypes.func,
  viewFormValues: PropTypes.object,
};

DmaList.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
function mapStateToProps(state) {
  return {
    viewFormValues: getFormValues('view-form')(state),
  };
}
const enhance = compose(
  connect(mapStateToProps, {
    startCustomUndoable,
  }),
  withDataProvider,
  translate,
);
export default enhance(DmaList);
