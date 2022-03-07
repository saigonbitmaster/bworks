import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import {
  List,
  Filter,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  TextInput,
  SFEditButton,
  translate,
  CUSTOM,
  startCustomUndoable,
  withDataProvider,
  BulkDeleteButton,
  FunctionField,
  NumberField,
} from 'ra-loopback3';
// import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
// import { RestoreMatIcon } from '../../styles/Icons';
// import CustomButton from '../../components/buttons/CustomButton';
// import CustomBulkDeleteAction from '../../components/actions/CustomBulkDeleteAction';
// import CustomBulkAction from '../../components/actions/CustomBulkAction';
import { getFormValues } from 'redux-form';
import get from 'lodash/get';
import config from '../../Config';

const MaterialUseTitle = ({ translate, label }) => <span>{translate(label)}</span>;
MaterialUseTitle.propTypes = { label: PropTypes.string.isRequired, translate: PropTypes.func.isRequired };
const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});
const MaterialUseFilter = ({ translate, ...rest }) => (
  <Filter {...rest}>
    <TextInput label={translate('generic.search')} source="name" alwaysOn />
  </Filter>
);
MaterialUseFilter.propTypes = {
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
class MaterialUseList extends React.Component {
  refList = React.createRef();
  state = {
    dmaId: get(this.props.viewFormValues, 'viewDmaId', ''),
  };
  /*
  onClickRestoreMat = ({ record }) => {
    this.props.startCustomUndoable({
      type: 'ALERT_ERROR_MAT_MAP',
      payload: async () => {
        return this.props
          .dataProvider(CUSTOM, 'materialuses/alertErrorMatMap', { query: { data: JSON.stringify(record) } })
          .then(() => {
            this.refList.current.updateData();
            this.refList.current.handleUnselectItems();
            // this.props.mapChangeSelected({ update: 1 });
          });
      },
      meta: {
        deleteData: { resource: 'materialuses', id: record.id },
        onSuccess: {
          notification: {
            body: 'resources.materialuses.alertMatMatSuccess',
            level: 'info',
            messageArgs: {
              smart_count: 1,
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
  */

  onDelete = selectedIds => {
    this.props.startCustomUndoable({
      type: 'RESTORE_MAT_TO_STOCK',
      payload: async () => {
        return this.props
          .dataProvider(CUSTOM, 'materialuses/deleteMatMap', { query: { ids: selectedIds } })
          .then(() => {
            this.refList.current.updateData();
            this.refList.current.handleUnselectItems();
            // this.props.mapChangeSelected({ update: 1 });
          });
      },
      meta: {
        deleteData: { resource: 'materialuses', ids: selectedIds },
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
      translate,
      classes,
      dataProvider,
      startCustomUndoable,
      updateView,
      dispatch,
      onUpdateList,
      ...rest
    } = this.props;

    let { dmaId } = this.state;
    let cdt = { type: rest.model, isDeleted: { neq: true } };
    if (dmaId) {
      cdt.dmaId = dmaId;
    }
    return (
      <List
        {...rest}
        refController={this.refList}
        resource="materialuses"
        filters={<MaterialUseFilter translate={translate} />}
        filter={cdt}
        title={<MaterialUseTitle translate={translate} label={`generic.pages.design${rest.model}`} />}
        bulkActionButtons={<BulkActionButtons onDelete={this.onDelete} />}
        permissionCreateDefault={{ name: 'Design', action: 'create' }}
      >
        <Datagrid>
          {/* <ReferenceField label={translate('resources.materialuses.fields.name')} reference="materialuses" source="id">
            <TextField source="name" />
          </ReferenceField> */}
          <TextField source="name" />
          <ReferenceField
            label={translate('resources.materialuses.fields.dmaId')}
            reference="dmas"
            source="dmaId"
            linkType={false}
          >
            <TextField source="name" />
          </ReferenceField>
          {rest.model === 'Pipe' && <NumberField source="length" textAlign="left" />}
          {rest.model === 'FlowLogger' && (
            <TextField source="optionKey" label={translate('resources.materialuses.flowLoggers.optionKey')} />
          )}
          {rest.model === 'ElectricLogger' && (
            <TextField source="optionKey" label={translate('resources.materialuses.electricLoggers.optionKey')} />
          )}
          <DateField source="useStartDate" />
          <FunctionField
            source="health"
            render={record => {
              return translate(config.healthGroup[record.health]);
            }}
          />
          <SFEditButton permission={{ name: 'Design', action: 'edit' }} />

          {/* <CustomButton
            onClick={this.onClickRestoreMat}
            icon={<RestoreMatIcon className={classNames(classes.leftIcon)} />}
            text={translate('resources.materialuses.alertErrorMatMap')}
          /> */}
        </Datagrid>
      </List>
    );
  }
}
MaterialUseList.propTypes = {
  updateView: PropTypes.number,
  onUpdateList: PropTypes.func,
  dispatch: PropTypes.func,
  dataProvider: PropTypes.func,
  mapChangeSelected: PropTypes.func,
  model: PropTypes.string,
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  classes: PropTypes.object,
  startCustomUndoable: PropTypes.func,
  viewFormValues: PropTypes.object,
};

MaterialUseList.detaultProps = {
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
  withStyles(styles),
  translate,
  withDataProvider,
  connect(mapStateToProps, { startCustomUndoable }),
);
export default enhance(MaterialUseList);
