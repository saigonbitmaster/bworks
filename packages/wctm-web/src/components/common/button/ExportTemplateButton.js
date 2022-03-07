import React, { Component } from 'react';
import { Button, translate, CUSTOM, withDataProvider } from 'ra-loopback3';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import set from 'lodash/set';
import compose from 'recompose/compose';
import { ExportIcon } from '../../../styles/Icons';

@withDataProvider
class ExportTemplateButton extends Component {
  static propTypes = {
    templateData: PropTypes.shape({
      storedName: PropTypes.string,
      downloadName: PropTypes.string,
    }),
    dataProvider: PropTypes.func,
    refController: PropTypes.object,
  };

  state = { saving: false };

  exportTemplate = () => {
    const { templateData, dataProvider, refController } = this.props;
    if (refController) {
      const currentFilter = refController.current.getCurrentFilter();
      // Get selected month
      const selectedMonth = get(currentFilter, 'and[0].startMeterDate.lt', new Date());
      set(templateData, 'queryData.query.currentMonth', selectedMonth);

      // Get selected geoIds
      const selectedGeoIds = currentFilter.and.filter(filterObject => {
        const filterKeyValue = Object.entries(filterObject);
        for (let [k, v] of filterKeyValue) {
          if (['quarterId', 'wardId', 'districtId'].includes(k) && v) return { [k]: v };
        }
        return false;
      });
      set(templateData, 'queryData.query.filter', JSON.stringify(selectedGeoIds));
    }

    // Get props containing template data
    let storedName = null;
    let downloadName = null;
    let fileModel = 'ExcelFiles';
    let queryData = null;

    if (templateData) {
      storedName = templateData.storedName ? templateData.storedName : null;
      downloadName = templateData.downloadName ? templateData.downloadName : null;
      if (storedName && storedName.startsWith('record')) {
        storedName = get(this.props, storedName);
      }
      if (downloadName && downloadName.startsWith('record')) {
        downloadName = get(this.props, downloadName);
      }
      fileModel = templateData.fileModel ? templateData.fileModel : fileModel;
      queryData = templateData.queryData
        ? templateData.queryData
        : { subUrl: `template/download/${storedName}`, fullUrl: true };
    }

    if (queryData) {
      this.setState({ saving: true });
      dataProvider(CUSTOM, fileModel, { ...queryData, method: 'GET', stream: 'file' }).finally(() =>
        this.setState({ saving: false }),
      );
    }
  };

  render() {
    const { saving } = this.state;

    return (
      <Button label="generic.exportTemplate" saving={saving} onClick={this.exportTemplate}>
        <ExportIcon />
      </Button>
    );
  }
}

export default compose(translate)(ExportTemplateButton);
