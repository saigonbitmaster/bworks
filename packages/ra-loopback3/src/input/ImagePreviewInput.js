import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { ArrayInput } from 'react-admin';
import get from 'lodash/get';
import { Attachment as AttachmentIcon, Delete as DeleteIcon } from '@material-ui/icons';
import Button from '../layout/Button';
import { URL_ONLY, UPLOAD } from '../data/LoopbackRest';
import ImageFromPathField from '../field/ImageFromPathField';
import withDataProvider from '../data/withDataProvider';
const styles = () => ({
  input: { width: '100%' },
  addFile: {
    margin: '.5em',
    padding: '0 1em',
  },
  attachFiles: {
    margin: '1em 0',
    padding: '0',
    width: 256,
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

class ImagePreviewInput extends Component {
  state = {
    saving: false,
  };
  selectFile = accept => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', accept);
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
    const filePath = get(res, 'data.result.files.files[0].name');
    if (!filePath) throw new Error('error.UPLOAD_FILE_ERROR');
    return { name: filePath.substring(filePath.indexOf('/') + 1), url: filePath };
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

  addFile = async (fields, filterFiles, storage) => {
    let file = await this.selectFile();
    let isAccess = this.checkTypeFile(filterFiles, file.name);
    if (isAccess) {
      this.safeSetState({ saving: true });
      const img = await this.fileToServer(file, storage);
      this.safeSetState({ saving: false });
      return fields.push(img);
    }
  };
  onRemove = (fields, index) => {
    fields.remove(index);
  };

  renderDetails = ({ fields = [] }) => {
    const { classes, titleimage, dataProvider, filterFiles, accept, storage, disabled } = this.props;
    const { saving } = this.state;

    return (
      <ul className={classes.attachFiles}>
        <Grid middle={'true'} item sm={12} xs={6}>
          {fields.map((key, index) => {
            let item = fields.get(index);
            // console.log(item);
            return (
              <Grid middle={'true'} item sm={12} xs={12} key={index}>
                <li className={classes.file} key={index}>
                  <Grid middle={'true'} item sm={10} xs={10}>
                    <a className={classes.pathFile}>{item.name}</a>
                  </Grid>
                  {!disabled && (
                    <Grid middle={'true'} item sm={2} xs={2}>
                      <Button
                        className={classes.removeFile}
                        type="button"
                        title="Remove"
                        onClick={() => this.onRemove(fields, index)}
                      >
                        <DeleteIcon />
                      </Button>
                    </Grid>
                  )}
                </li>
                <Grid middle={'true'} item sm={12} xs={12}>
                  <ImageFromPathField
                    key={index}
                    source="images"
                    className={classes.preview}
                    title={titleimage}
                    dataProvider={dataProvider}
                    imageName={item.name}
                    storage={storage}
                  />
                </Grid>
              </Grid>
            );
          })}
        </Grid>
        {!disabled && (
          <Grid middle={'true'} item sm={12} xs={12}>
            <li style={{ listStyleType: 'none' }}>
              <Button
                saving={saving}
                aria-label="Attachment"
                type="button"
                className={classes.addFile}
                label="generic.file"
                disabled={fields.length >= 1}
                onClick={() => this.addFile(fields, filterFiles, storage, accept)}
              >
                <AttachmentIcon style={{ paddingRight: '.5em' }} />
              </Button>
            </li>
          </Grid>
        )}
      </ul>
    );
  };

  safeSetState = state => {
    if (!this.unmount) {
      this.setState(state);
    }
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  compareImages(olds, news) {
    if (olds && news && olds.length && olds.length === news.length) {
      const s1 = olds.reduce((acc, curr) => acc.name + curr.name, '');
      const s2 = news.reduce((acc, curr) => acc.name + curr.name, '');
      return s1 !== s2;
    }

    return true;
  }

  shouldComponentUpdate(nextProps) {
    const { source, record = {} } = this.props;
    const olds = get(record, source);
    const news = get(nextProps, `record.${source}`);
    return this.compareImages(olds, news);
  }

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

ImagePreviewInput.propTypes = {
  accept: PropTypes.any,
  className: PropTypes.any,
  classes: PropTypes.object,
  data: PropTypes.object,
  dataProvider: PropTypes.func,
  disabled: PropTypes.bool,
  field: PropTypes.string,
  filterFiles: PropTypes.array,
  id: PropTypes.string,
  record: PropTypes.any,
  resource: PropTypes.string,
  source: PropTypes.string,
  storage: PropTypes.string,
  titleimage: PropTypes.string,
  translate: PropTypes.any,
};

const enhance = compose(withStyles(styles), withDataProvider, withTheme);
export default enhance(ImagePreviewInput);
