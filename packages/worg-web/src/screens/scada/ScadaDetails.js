import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CustomPage } from 'ra-loopback3';
import { compose } from 'recompose';
// import classNames from 'classnames';
// eslint-disable-next-line
import { Canvas } from 'react-design-editor/dist/react-design-editor.min';
import ScadaDeviceView from 'web-common/src/components/scadas/ScadaDeviceView';

class ScadaDetails extends Component {
  static propTypes = {
    classes: PropTypes.object,
    title: PropTypes.string,
    id: PropTypes.string,
  };

  canvasRef = React.createRef();

  render() {
    const { id, title } = this.props;
    return (
      <CustomPage title={title} card>
        <ScadaDeviceView id={id} />
      </CustomPage>
    );
  }
}

const ScadaDetailsEnhance = compose()(ScadaDetails);

export default ScadaDetailsEnhance;
