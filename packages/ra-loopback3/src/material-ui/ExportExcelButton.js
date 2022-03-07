import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ra-ui-materialui';
import ExportIcon from '@material-ui/icons/CloudDownload';
import { CUSTOM } from '../data/LoopbackRest';
import withDataProvider from '../data/withDataProvider';

@withDataProvider
export default class ExportExcelButton extends Component {
  static propTypes = {
    sourcesAndTranslations: PropTypes.object,
    currentQuery: PropTypes.object,
    rootModel: PropTypes.string,
    fixUrl: PropTypes.string,
    dataProvider: PropTypes.func,
    exportExcelPermission: PropTypes.object,
    disableExportExcel: PropTypes.bool,
    templateKey: PropTypes.string,
  };

  state = { saving: false };

  exportExcel = () => {
    const { currentQuery, sourcesAndTranslations, rootModel, fixUrl, templateKey } = this.props;
    const params = {
      rootModel,
      templateKey,
      sourcesAndTranslations: JSON.stringify(sourcesAndTranslations),
      filter: JSON.stringify(currentQuery),
      fixUrl,
    };
    this.setState({ saving: true });
    this.props
      .dataProvider(CUSTOM, 'ExcelUtils', {
        subUrl: 'exportExcelFile',
        fullUrl: true,
        query: params,
        stream: 'file',
      })
      .finally(() => {
        this.setState({ saving: false });
      });
  };

  render() {
    const { saving } = this.state;
    const { exportExcelPermission, disableExportExcel } = this.props;
    return (
      <Button
        label="generic.export"
        saving={saving}
        onClick={this.exportExcel}
        permission={exportExcelPermission}
        disabled={disableExportExcel}
      >
        <ExportIcon />
      </Button>
    );
  }
}
