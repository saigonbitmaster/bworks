import React, { Component, Fragment } from 'react';
import { Button, withDataProvider, CUSTOM, URL_ONLY, translate, refreshView, showNotification } from 'ra-loopback3';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { ImportIcon } from '../../../styles/Icons';

class ImportDataButton extends Component {
  static propTypes = {
    dataProvider: PropTypes.func,
    showNotification: PropTypes.func,
    refreshView: PropTypes.func,
    translate: PropTypes.func,
    record: PropTypes.object,
    classes: PropTypes.object,
    acceptedFileExtensions: PropTypes.arrayOf(PropTypes.string),
    fileModelData: PropTypes.shape({
      modelName: PropTypes.string,
      modelUrl: PropTypes.string,
    }),
    importModelData: PropTypes.shape({
      modelName: PropTypes.string,
      modelUrl: PropTypes.string,
    }),
    sourceFromRecord: PropTypes.string,
    disableEinvoiceExport: PropTypes.bool,
    isNotJob: PropTypes.bool,
  };

  state = {
    saving: false,
    disabled: true,
  };

  handleImport = async () => {
    const {
      dataProvider,
      showNotification,
      translate,
      acceptedFileExtensions,
      sourceFromRecord,
      record,
      fileModelData,
      importModelData,
      isNotJob,
    } = this.props;
    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', acceptedFileExtensions.join(','));
    fileInput.click();

    let file = null;
    try {
      file = await new Promise((resolve, reject) => {
        fileInput.onchange = file => {
          if (file) resolve(file.path[0].files[0]);
          reject();
        };
      });
    } catch (err) {
      showNotification(translate('error.file.fileNotGiven'), 'warning');
    }

    this.setState({ saving: true });

    let modelName, modelUrl;
    if (sourceFromRecord) {
      modelName = get(record, sourceFromRecord);
      modelUrl = `import${modelName}FromExcel`;
    } else if (importModelData) {
      modelName = importModelData.modelName;
      modelUrl = importModelData.modelUrl;
    }

    const {
      data: { url },
    } = await dataProvider(URL_ONLY, fileModelData.modelName, { subUrl: fileModelData.modelUrl, fullUrl: 'true' });
    const formData = new FormData();
    await formData.append('file', file);
    let filepath = null;
    try {
      filepath = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.send(formData);
        xhr.onload = () => {
          if (xhr.status === 200) {
            const {
              result: {
                files: { file },
              },
            } = JSON.parse(xhr.responseText);
            if (file[0].name) {
              resolve({ name: file[0].name, container: file[0].container });
            }
          }
          reject();
        };
      });
    } catch (err) {
      showNotification(translate('error.file.cantUploadFile'), 'warning');
    }

    if (!filepath.err) {
      showNotification(translate('notification.file.fileUploadSuccess'));
      const savedRequestParams = {
        filename: filepath.name,
      };
      this.setState({ modelName, modelUrl, savedRequestParams }, () => {
        this.importDataJob();
        if (!isNotJob) {
          const checkJobStatus = setInterval(this.importDataJob, 5000);
          this.setState({ checkJobStatus });
        }
      });
    }
  };

  importDataJob = () => {
    const { modelName, modelUrl, savedRequestParams } = this.state;
    const { dataProvider, showNotification, refreshView, translate, isNotJob } = this.props;
    dataProvider(CUSTOM, modelName, {
      subUrl: modelUrl,
      fullUrl: true,
      query: savedRequestParams,
    })
      .then(({ data: { jobStatus, jobError, message } }) => {
        if (isNotJob) {
          this.setState({ saving: false });
          if (message) {
            showNotification(translate(message));
          } else {
            showNotification(translate('notification.data.dataSaveSuccess'));
          }
          refreshView();
        } else {
          switch (jobStatus) {
            case 'QUEUED': {
              showNotification(translate('notification.data.dataSaveQueued'));
              break;
            }
            case 'FINISH': {
              showNotification(translate('notification.data.dataSaveSuccess'));
              this.setState({ saving: false });
              clearInterval(this.state.checkJobStatus);
              refreshView();
              break;
            }
            case 'ERROR': {
              showNotification(translate(jobError), 'warning');
              this.setState({ saving: false });
              clearInterval(this.state.checkJobStatus);
              break;
            }
            default: {
              showNotification(translate('notification.data.dataSaveInProgress'), 'info');
            }
          }
        }
      })
      .catch(err => {
        this.setState({ saving: false });
        showNotification(translate(err.message), 'warning');
      });
  };

  componentWillUnmount = () => {
    if (this.state.checkJobStatus) {
      clearInterval(this.state.checkJobStatus);
    }
  };

  render() {
    const { disableEinvoiceExport } = this.props;
    const { saving } = this.state;
    return (
      <Fragment>
        <Button label="generic.import" onClick={this.handleImport} disabled={!!disableEinvoiceExport} saving={saving}>
          <ImportIcon />
        </Button>
      </Fragment>
    );
  }
}

export default compose(withDataProvider, translate, connect(null, { refreshView, showNotification }))(ImportDataButton);
