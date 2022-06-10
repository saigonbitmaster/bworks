import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { compose } from 'recompose';
import { withStyles, Card, CardContent, Paper } from '@material-ui/core';

class SlideDemo extends Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    classes: PropTypes.object,
  };

  options = {
    showArrows: false,
    autoPlay: true,
    showThumbs: false,
    infiniteLoop: true,
  };

  // eslint-disable-next-line no-unused-vars
  onClickItem = index => {
    // todo
  };

  render() {
    const { images } = this.props;
    return (
      <Paper style={{ marginTop: 16 }}>
        <Carousel {...this.options} onClickItem={this.onClickItem}>
          {images.map(({ url: imgUrl, title }) => (
            <div key={imgUrl}>
              <img src={imgUrl} style={{ borderRadius: 4 }} />
              <p className="legend">{title}</p>
            </div>
          ))}
        </Carousel>
      </Paper>
    );
  }
}

SlideDemo.defaultProps = {
  images: [
    // {
    //   url: 'https://source.unsplash.com/800x600/daily?water',
    //   title: 'Tọa đàm về Giá nước sinh hoạt: Góc nhìn từ chuyên gia',
    // },
    // {
    //   url: 'https://source.unsplash.com/800x600/daily?ocean',
    //   title: 'Nước sông Hàn nhiễm Coliform gấp 8 lần quy chuẩn',
    // },
    // {
    //   url: 'https://source.unsplash.com/800x600/daily?ocean-sea',
    //   title: 'Nguồn nước cấp cho Nhà máy nước sạch Hải Phòng nhiễm mặn',
    // },
    // {
    //   url: 'https://source.unsplash.com/800x600/daily?water-drop',
    //   title: 'Tọa đàm về Giá nước sinh hoạt: Góc nhìn từ chuyên gia',
    // },
  ],
};

export default SlideDemo;
