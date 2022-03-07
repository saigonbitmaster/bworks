import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  TextInput,
  Datagrid,
  Filter,
  SelectInput,
  TextField,
  DateField,
  ReferenceField,
  translate,
  FunctionField,
  NumberWithUnitBaseMatTypeField,
  CardActions,
  RefreshButton,
  startCustomUndoable,
  BulkDeleteButton,
  CUSTOM,
  withDataProvider,
} from 'ra-loopback3';
import { push as pushAction } from 'react-router-redux';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReturnMatForStockIcon } from '../../styles/Icons';
import CustomEditButton from '../../components/buttons/CustomEditButton';
import config from '../../Config';
class BulkActionButtons extends Component {
  render() {
    return (
      <Fragment>
        <BulkDeleteButton {...this.props} permission={{ name: 'ManageMat', action: 'deleteMatExport' }} />
      </Fragment>
    );
  }
}
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

const MatExportFilter = props => {
  const { translate, filterValues, ...rest } = props;
  // console.log('MatExportFilter', filterValues);
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
MatExportFilter.propTypes = {
  translate: PropTypes.func,
  filterValues: PropTypes.any,
};
class ListMatExport extends Component {
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
      type: 'DELETE_MAT_EXPORT',
      payload: async () => {
        return (
          dataProvider(CUSTOM, 'materialexports/customDelete', { query: { ids: selectedIds } })
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
        deleteData: { resource: 'materialexports', ids: selectedIds },
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
        resource="materialexports"
        title={translate('resources.materialexports.titleList')}
        filters={<MatExportFilter />}
        actions={<PostActions {...this.props} />}
        bulkActionButtons={<BulkActionButtons onDelete={this.onDelete} />}
        refController={this.refList}
      >
        <Datagrid>
          <FunctionField
            source="type"
            render={record => {
              return translate(config.materialGroup[record.type]);
            }}
          />
          <TextField source="name" />
          <NumberWithUnitBaseMatTypeField source="exportValue" translate={translate} textAlign={'left'} />
          <NumberWithUnitBaseMatTypeField source="currentValue" translate={translate} textAlign={'left'} />
          <DateField source="exportDate" />
          <ReferenceField source="creatorId" reference="appusers" linkType={false} allowEmpty>
            <TextField source="username" />
          </ReferenceField>
          <CustomEditButton
            icon={<ReturnMatForStockIcon />}
            subUrl={'editReturnStock'}
            text={translate('resources.materialexports.returnMatForStock')}
            permission={{ name: 'ManageMat', action: 'returnMat' }}
          />
        </Datagrid>
      </List>
    );
  }
}
ListMatExport.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  classes: PropTypes.object,
  push: PropTypes.func,
  startCustomUndoable: PropTypes.func,
  dataProvider: PropTypes.func,
};

ListMatExport.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(
  translate,
  withDataProvider,
  connect(null, {
    push: pushAction,
    startCustomUndoable,
  }),
);
export default enhance(ListMatExport);
