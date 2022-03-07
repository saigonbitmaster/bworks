import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Datagrid, FunctionField, translate, showNotification, withDataProvider } from 'ra-loopback3';
// import moment from 'moment-timezone';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import config from '../../Config';
import ExportTemplateButton from '../../components/common/button/ExportTemplateButton';
import ImportDataButton from '../../components/common/button/ImportDataButton';

@connect(null, { showNotification })
@withDataProvider
class ListClientFormat extends Component {
  render() {
    const { dataProvider, showNotification, translate, ...rest } = this.props;
    return (
      <List {...rest} resource="clientformats" bulkActionButtons={false}>
        <Datagrid>
          <FunctionField
            source="name"
            render={record => (record.name.includes('.') ? record.name.split('.')[0] : record.name)}
          />
          <FunctionField
            source="model"
            render={record =>
              translate(config.modelChoices.filter(({ id }) => id === record.model).map(({ name }) => name))
            }
          />
          <ImportDataButton
            showNotification={showNotification}
            acceptedFileExtensions={['.xlsx']}
            fileModelData={{ modelName: 'ExcelFiles', modelUrl: 'uploaded/upload' }}
            sourceFromRecord="model"
          />
          <ExportTemplateButton templateData={{ storedName: 'record.realName', downloadName: 'record.name' }} />
        </Datagrid>
      </List>
    );
  }
}
ListClientFormat.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
  showNotification: PropTypes.func,
};

export default compose(translate)(ListClientFormat);
