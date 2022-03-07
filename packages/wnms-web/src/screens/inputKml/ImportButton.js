import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Button, UPLOAD } from 'ra-loopback3';
import { get } from 'lodash';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { AttachFileIcon } from '../../styles/Icons';

const styles = () => ({
  input: { width: '100%' },
  addFile: {
    margin: '.5em',
    padding: '0 1em',
  },
  attachFiles: {
    margin: '1em 0',
    padding: '0',
  },
  file: {
    margin: '.5em 0',
    width: '100%',
    listStyleType: 'none',
    display: 'inline-flex',
    borderBottom: '1px solid rgba(0, 0, 0, 0.54)',
  },
  pathFile: {
    display: 'inline-flex',
    padding: '.5em 0',
    textDecoration: 'none',
  },
  removeFile: {
    display: 'inline-flex',
    float: 'right',
    padding: '.5em',
  },
});
class ImportButton extends Component {
  state = {
    saving: false,
  };
  selectFile = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'kml');
    input.click();
    return new Promise((resolve, reject) => {
      input.onchange = value => {
        if (value) resolve(value.path[0].files[0]);
        else reject('undefined');
      };
    });
  };
  // upload kml to s3
  fileToServer = async (file, storage) => {
    let res = await this.props
      .dataProvider(UPLOAD, storage, { subUrl: 'uploadPublic', files: [file], fullUrl: true })
      .finally(() => {});
    let fileName = get(res, 'data.result.files.files[0].name');
    if (!fileName) throw new Error('error.UPLOAD_FILE_ERROR');

    let urlS3 = get(res, 'data.result.files.files[0].providerResponse._rawMetadata.Location');
    let info = {
      fileNameS3: fileName.substring(fileName.indexOf('/') + 1),
      urlS3,
    };
    return info;
  };
  checkTypeFile = (filterFiles, fileName) => {
    let name = fileName.substring(fileName.lastIndexOf('.') + 1);
    let relative = RegExp(name, 'gi');
    let accepted = relative.test(filterFiles && filterFiles.toString());
    if (accepted || !filterFiles) {
      return true;
    }
    return false;
  };
  addFile = async () => {
    let storage = 'NmsFiles';
    let file = await this.selectFile();
    // console.log('file: ', file);
    let isAccess = true; //this.checkTypeFile(filterFiles, file.name);
    if (isAccess) {
      this.setState({ saving: true });
      let info = await this.fileToServer(file, storage);
      // console.log('info: ', info);
      if (info) {
        let { fileNameS3, urlS3 } = info;
        this.props.getFile({ fileNameReal: file.name, fileNameS3, urlS3 });
      }

      this.setState({ saving: false });
    }
  };
  render() {
    // eslint-disable-next-line
    const { classes, translate, ...rest } = this.props;
    let { saving } = this.state;
    return (
      <Button
        variant="contained"
        color="primary"
        aria-label="Attachment"
        className={classes.addFile}
        saving={saving}
        onClick={this.addFile}
        label={this.props.translate('resources.kmls.selectFile')}
      >
        <AttachFileIcon style={{ paddingLeft: 0 }} />
      </Button>
    );
  }
}
ImportButton.propTypes = {
  push: PropTypes.func,
  translate: PropTypes.func,
  basePath: PropTypes.string,
  dataProvider: PropTypes.func,
  classes: PropTypes.object,
  getFile: PropTypes.func.isRequired,
};
const enhance = compose(withStyles(styles), withTheme);
export default enhance(ImportButton);
