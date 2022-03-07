import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import { debounce } from 'lodash';
import { compose } from 'recompose';
import withDataProvider from '../../data/withDataProvider';
import { URL_ONLY } from '../../data/LoopbackRest';
import 'react-quill/dist/quill.snow.css';
// import { resolve } from '../../../../../node_modules/uri-js';
const style = {
  width: '100%',
};
class RawEditorInput extends Component {
  modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }], // custom button values
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'],

        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: [false, 'large', 'huge'] }], // custom dropdown
        // [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['link', 'image'],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],

        ['clean'],
      ],
      handlers: {
        image: () => this.handlerImage(),
      },
    },
  };
  formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'script',
    'super',
    'indent',
    'direction',
    'size',
    'link',
    'image',
    'color',
    'background',
    'font',
    'align',
  ];
  handlerImage = async () => {
    const quill = this.reactQuillRef.getEditor();
    this.insertImage(imagePath => {
      this.displayImage(quill, imagePath);
    });
  };
  insertImage = callback => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('name', 'file[]');
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (/^image\//.test(file.type)) {
        //send to server
        let imagePath = await this.fileToServer(file);
        //callback imagePath from server
        callback(imagePath);
      }
    };
  };
  fileToServer = async file => {
    const { url } = await this.props.dataProvider(URL_ONLY, 'NmsFiles', { subUrl: 'upload', fullUrl: true });
    let formData = new FormData();
    await formData.append('file', file);
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.onload = () => {
        if (xhr.status === 200) {
          // this is callback data: url
          const {
            result: {
              files: { file },
            },
          } = JSON.parse(xhr.responseText);
          if (file[0].name) {
            resolve('/api/nmsfiles/download' + file[0].name.substring(file[0].name.indexOf('/')));
          } else {
            reject('Upload error!');
          }
        } else {
          reject('Upload error!');
        }
      };
      xhr.send(formData);
    });
  };
  displayImage = (quill, imagePath) => {
    let currentIndex = quill.selection.lastRange.index || 0;
    quill.insertEmbed(currentIndex, 'image', imagePath);
  };
  handleChange = debounce(value => {
    this.props.onChange(value);
  }, 300);
  render() {
    return (
      <div className="text-editor" style={style}>
        <ReactQuill
          ref={el => {
            this.reactQuillRef = el;
          }}
          id="quilleditor"
          theme="snow"
          value={this.props.value}
          onChange={this.handleChange}
          modules={this.modules}
          formats={this.formats}
        />
      </div>
    );
  }
}
RawEditorInput.defaultProps = {
  value: '',
};
RawEditorInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  locale: PropTypes.string,
  ref: PropTypes.func,
  dataProvider: PropTypes.func,
};
const enhance = compose(withDataProvider);
export default enhance(RawEditorInput);
