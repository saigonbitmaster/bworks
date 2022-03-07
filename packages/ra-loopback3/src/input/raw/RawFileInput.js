import React, { Component, Fragment } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Attachment as AttachmentIcon } from '@material-ui/icons';
import get from 'lodash/get';
import { compose } from 'recompose';
import 'moment/locale/vi';
import PropTypes from 'prop-types';
import { UPLOAD } from '../../data/LoopbackRest';
import Button from '../../layout/Button';
import '../../style/date-time.css';
const styles = () => ({
  pathFile: {
    display: 'inline-block',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    marginRight: 5,
    minWidth: 200,
    // maxWidth: 200,
  },
  fixUrl: {
    height: 10,
  },
});
class RawFileInput extends Component {
  state = { saving: false };
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
    this.setState({ saving: true });
    let res = await this.props
      .dataProvider(UPLOAD, storage, { subUrl: 'upload', files: [file], fullUrl: true })
      .finally(() => this.setState({ saving: false }));
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
  addFile = async (filterFiles, storage, accept) => {
    let file = await this.selectFile(accept);
    let isAccess = this.checkTypeFile(filterFiles, file.name);
    if (isAccess) {
      let pathFile = await this.fileToServer(file, storage);
      this.props.onChange({ name: file.name, url: pathFile });
    }
  };

  onLinkClick = e => {
    e.preventDefault();
    const { value, dataProvider, storage } = this.props;
    if (value && value.url) {
      let fileName = value.url.substring(value.url.lastIndexOf('/') + 1);
      dataProvider('URL_ONLY', storage, { subUrl: `download/${fileName}` }).then(res => {
        let url = get(res, 'data.url');
        if (url) {
          window.location = url;
        }
      });
    }
  };
  render() {
    const { classes, filterFiles, storage, value, accept } = this.props;
    const { name = '' } = value || {};
    const { saving } = this.state;
    return (
      <Fragment>
        <div className={classes.pathFile}>
          <div className={classes.fixUrl} />
          <a href="#" onClick={this.onLinkClick}>
            {name}
          </a>
        </div>
        <Button saving={saving} label="generic.file" onClick={() => this.addFile(filterFiles, storage, accept)}>
          <AttachmentIcon />
        </Button>
      </Fragment>
    );
  }
}
RawFileInput.propTypes = {
  locale: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  dataProvider: PropTypes.func,
  filterFiles: PropTypes.any,
  storage: PropTypes.string,
  value: PropTypes.any,
  accept: PropTypes.string,
  classes: PropTypes.any,
};

const enhance = compose(withStyles(styles), withTheme);
export default enhance(RawFileInput);
