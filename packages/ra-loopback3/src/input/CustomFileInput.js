import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { ArrayInput } from 'react-admin';
import Button from '../layout/Button';
import { Attachment as AttachmentIcon, Delete as DeleteIcon, CloudDownload } from '@material-ui/icons';
// import { filter } from 'rxjs/operator/filter';
import get from 'lodash/get';
import { URL_ONLY, UPLOAD, CUSTOM } from '../data/LoopbackRest';
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
    display: 'inline-block',
    borderBottom: '1px solid rgba(0, 0, 0, 0.54)',
  },
  pathFile: {
    display: 'inline-flex',
    padding: '.5em 0',
    textDecoration: 'none',
  },
  removeFile: {
    // display: 'inline-flex',
    float: 'right',
    // padding: '.5em',
  },
  downloadFile: {
    marginRight: '1em !important',
    float: 'right',
    // padding: '.5em',
  },
});

class CustomFileInput extends Component {
  state = {
    urls: [],
    saving: false,
  };
  selectFile = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();
    return new Promise((resolve, reject) => {
      input.onchange = value => {
        if (value) resolve(value.path[0].files[0]);
        else reject('undefined');
      };
    });
  };
  fileToServer = async (file, storage) => {
    let res = await this.props
      .dataProvider(UPLOAD, storage, { subUrl: 'upload', files: [file], fullUrl: true })
      .finally(() => {});
    let fileName = get(res, 'data.result.files.files[0].name');
    if (!fileName) throw new Error('error.UPLOAD_FILE_ERROR');
    return `/api/${storage}/download` + fileName.substring(fileName.indexOf('/'));
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
  getPathFileFromAWS = async url => {
    const { storage } = this.props;
    let fileName = url.substring(url.lastIndexOf('/') + 1);
    let res = await this.props.dataProvider(URL_ONLY, storage, { subUrl: `download/${fileName}` });
    if (res.data.url) {
      let tmp = this.state.urls;
      tmp.push(res.data.url);
      this.setState({ urls: tmp });
    }
  };
  addFile = async (fields, filterFiles, storage) => {
    let file = await this.selectFile();
    let isAccess = this.checkTypeFile(filterFiles, file.name);
    if (isAccess) {
      this.setState({ saving: true });
      let pathFile = await this.fileToServer(file, storage);
      await this.getPathFileFromAWS(pathFile);
      this.setState({ saving: false });
      return fields.push({ name: file.name, url: pathFile });
    }
  };
  downloadFile = item => {
    if (item) {
      const { dataProvider, storage } = this.props;
      const fileName = item.url.split(/(\\|\/)/g).pop();
      return dataProvider(CUSTOM, storage, {
        stream: true,
        method: 'get',
        subUrl: `download/${fileName}`,
        query: { f: item.name },
      });
    }
  };
  renderDetails = ({ fields }) => {
    const { classes, translate, filterFiles, storage, max } = this.props;
    const { saving } = this.state;
    // console.log('renderDetails', saving, this.props);
    return (
      <ul className={classes.attachFiles}>
        <Grid middle={'true'} item sm={12} xs={12}>
          {fields.map((key, index) => {
            let item = fields.get(index);
            return (
              <Grid middle={'true'} item sm={12} xs={12} key={index}>
                <li className={classes.file} key={index}>
                  <a className={classes.pathFile}>{item.name}</a>
                  <Button
                    className={classes.removeFile}
                    type="button"
                    title="Remove"
                    color="secondary"
                    onClick={() => fields.remove(index)}
                  >
                    <DeleteIcon />
                  </Button>
                  <Button
                    className={classes.downloadFile}
                    type="button"
                    title="Download"
                    onClick={() => this.downloadFile(item)}
                  >
                    <CloudDownload />
                  </Button>
                </li>
              </Grid>
            );
          })}
        </Grid>
        {max > fields.length && (
          <Grid middle={'true'} item sm={12} xs={12}>
            <li style={{ listStyleType: 'none' }}>
              <Button
                saving={saving}
                variant="contained"
                color="primary"
                aria-label="Attachment"
                type="button"
                className={classes.addFile}
                label={translate('generic.file') || 'File'}
                onClick={() => this.addFile(fields, filterFiles, storage)}
              >
                <AttachmentIcon style={{ paddingRight: '.5em' }} />
              </Button>
            </li>
          </Grid>
        )}
      </ul>
    );
  };

  render() {
    const { className, classes, dataProvider, translate, filterFiles, storage, ...props } = this.props;
    const Detail = this.renderDetails;
    return (
      <ArrayInput {...props}>
        <Detail />
      </ArrayInput>
    );
  }
}

CustomFileInput.propTypes = {
  className: PropTypes.any,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
  resource: PropTypes.string,
  id: PropTypes.string,
  field: PropTypes.string,
  translate: PropTypes.any,
  filterFiles: PropTypes.array,
  storage: PropTypes.string,
  max: PropTypes.number,
};
CustomFileInput.defaultProps = {
  max: 10,
};

const enhance = compose(withStyles(styles), withTheme);
export default enhance(CustomFileInput);
