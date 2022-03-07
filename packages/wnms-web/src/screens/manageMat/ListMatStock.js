import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';
import get from 'lodash/get';
import {
  List,
  Datagrid,
  TextField,
  Button,
  DateField,
  SFEditButton,
  RefreshButton,
  ReferenceField,
  CustomReferenceField,
  translate,
  withDataProvider,
  CUSTOM,
  CardActions,
  FunctionField,
  TextInput,
  SelectInput,
  Filter,
  NumberWithUnitBaseMatTypeField,
  startCustomUndoable,
  BulkDeleteButton,
  SFCreateButton,
} from 'ra-loopback3';
import { push as pushAction } from 'react-router-redux';
import { ExportStockIcon } from '../../styles/Icons';
import config from '../../Config';
class RawPostActions extends Component {
  onClickExportStock = () => {
    this.props.push('/manageMaterial/export');
  };
  onClickPrint = () => {
    this.props.push('/manageMaterial/print');
  };
  render() {
    return (
      <CardActions>
        <SFCreateButton
          label={'generic.manageMat.importStock'}
          basePath={this.props.basePath}
          permission={{ name: 'ManageMat', action: 'importStock' }}
        />
        <Button
          onClick={this.onClickExportStock}
          label={this.props.translate('generic.manageMat.exportStock')}
          permission={{ name: 'ManageMat', action: 'exportStock' }}
        >
          <ExportStockIcon />
        </Button>
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

const MatStockFilter = props => {
  const { translate, filterValues, ...rest } = props;
  // console.log('MatStockFilter', filterValues);
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
MatStockFilter.propTypes = {
  translate: PropTypes.func,
  filterValues: PropTypes.any,
};
class BulkActionButtons extends Component {
  render() {
    return (
      <Fragment>
        <BulkDeleteButton {...this.props} permission={{ name: 'ManageMat', action: 'deleteStock' }} />
      </Fragment>
    );
  }
}
class ListMatStock extends Component {
  refList = React.createRef();
  constructor(props) {
    super(props);
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
    this.refList.current.handleUnselectItems();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  getRemainStock = (dataProvider, record) => {
    return dataProvider(CUSTOM, 'materialexports', {
      subUrl: 'getValueRemainStock',
      query: { stockId: record.id },
    }).then(res => {
      let valueRemain = get(res, 'data.value') || 0;
      let type = get(res, 'data.type') || '';
      return { valueRemain, type, isMounted: this._isMounted };
    });
  };
  getSumExportStock = (dataProvider, record) => {
    return dataProvider(CUSTOM, 'materialexports', {
      subUrl: 'getSumExportStock',
      query: { stockId: record.id },
    }).then(res => {
      let exportValue = get(res, 'data.value') || 0;
      let type = get(res, 'data.type') || '';
      return { exportValue, type, isMounted: this._isMounted };
    });
  };
  onDelete = selectedIds => {
    if (!selectedIds || !selectedIds.length) {
      return;
    }

    const { dataProvider, startCustomUndoable } = this.props;
    startCustomUndoable({
      type: 'DELETE_MAT_STOCK',
      payload: async () => {
        return (
          dataProvider(CUSTOM, 'materialstocks/customDelete', { query: { ids: selectedIds } })
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
        deleteData: { resource: 'materialstocks', ids: selectedIds },
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
    const { dataProvider, translate, startCustomUndoable, ...rest } = this.props;
    // console.log('render mat stock');
    return (
      <List
        {...rest}
        resource="materialstocks"
        actions={<PostActions {...this.props} />}
        title={translate('resources.materialstocks.titleList')}
        filters={<MatStockFilter />}
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
          <NumberWithUnitBaseMatTypeField source="initValue" translate={translate} textAlign={'left'} />
          <CustomReferenceField
            label={this.props.translate('resources.materialexports.fields.exportValue')}
            source="exportValue"
            reference="materialexports"
            customData={this.getSumExportStock}
            dataProvider={dataProvider}
            linkType={false}
          >
            <NumberWithUnitBaseMatTypeField source="exportValue" translate={translate} />
          </CustomReferenceField>
          <CustomReferenceField
            label={this.props.translate('resources.materialstocks.fields.remainValueStock')}
            source="valueRemain"
            reference="materialexports"
            customData={this.getRemainStock}
            dataProvider={dataProvider}
            linkType={false}
          >
            <NumberWithUnitBaseMatTypeField source="valueRemain" translate={translate} />
          </CustomReferenceField>

          <NumberWithUnitBaseMatTypeField source="adjustValue" translate={translate} textAlign={'left'} />

          <DateField source="importDate" />
          <DateField source="dom" />

          <ReferenceField source="creatorId" reference="appusers" linkType={false} allowEmpty>
            <TextField source="username" />
          </ReferenceField>
          <SFEditButton permission={{ name: 'ManageMat', action: 'editStock' }} />
          {/* <DeleteButton /> */}
        </Datagrid>
      </List>
    );
  }
}
ListMatStock.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  push: PropTypes.func,
  dataProvider: PropTypes.any,
  basePath: PropTypes.string,
  startCustomUndoable: PropTypes.func,
};

ListMatStock.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(
  translate,
  connect(null, {
    push: pushAction,
    startCustomUndoable,
  }),
  pure,
  withDataProvider,
);

export default enhance(ListMatStock);
