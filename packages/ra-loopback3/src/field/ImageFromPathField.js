import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import get from 'lodash/get';
import sanitizeRestProps from './sanitizeRestProps';
import { URL_ONLY } from '../data/LoopbackRest';

const styles = {
  list: {
    display: 'flex',
    listStyleType: 'none',
  },
  image: {
    margin: '0.5rem',
    maxHeight: '10rem',
  },
};

class ImageFromPathField extends Component {
  state = { isOpen: false, url: '' };
  componentDidMount() {
    const { imageName, dataProvider, pathImage, storage } = this.props;
    if (imageName) {
      dataProvider(URL_ONLY, storage, { subUrl: `download/${imageName}` }).then(res => {
        this.setState({ url: get(res, 'data.url', '') });
      });
    } else {
      this.setState({ url: pathImage });
    }
  }
  onClick = () => {};
  render() {
    const {
      className,
      classes = {},
      record,
      source,
      src,
      pathImage,
      imageName,
      title,
      thumbnail,
      dispatch,
      ...rest
    } = this.props;
    const { url } = this.state;
    // console.log('path image', pathImage);
    if (!thumbnail && !(pathImage || imageName)) {
      return <div className={className} {...sanitizeRestProps(rest)} />;
    }
    const { isOpen } = this.state;

    return (
      <div className={className} {...sanitizeRestProps(rest)}>
        <ButtonBase focusRipple title={title} onClick={() => this.setState({ isOpen: true })}>
          {thumbnail || <img title={title} alt={title} src={url} className={classes.image} />}
        </ButtonBase>
        {isOpen && <Lightbox mainSrc={url} onCloseRequest={() => this.setState({ isOpen: false })} />}
      </div>
    );
  }
}
ImageFromPathField.propTypes = {
  addLabel: PropTypes.bool,
  basePath: PropTypes.string,
  className: PropTypes.string,
  cellClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  classes: PropTypes.object,
  record: PropTypes.object,
  sortBy: PropTypes.string,
  source: PropTypes.string.isRequired,
  src: PropTypes.string,
  title: PropTypes.string,
  pathImage: PropTypes.string,
  thumbnail: PropTypes.any,
  dataProvider: PropTypes.func,
  storage: PropTypes.string,
  imageName: PropTypes.string,
  dispatch: PropTypes.func,
};

export default withStyles(styles)(ImageFromPathField);
