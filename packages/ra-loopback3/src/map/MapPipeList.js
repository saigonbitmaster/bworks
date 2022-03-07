import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import MapPipe from './MapPipe';

class MapPipeList extends Component {
  static propTypes = {
    pipes: PropTypes.any,
    options: PropTypes.object,
  };
  render() {
    const { pipes, ...rest } = this.props;
    if (pipes && pipes.length > 0) {
      return (
        <Fragment>
          {pipes.map(pipe => (
            <MapPipe key={pipe.id} {...rest} pipe={pipe} />
          ))}
        </Fragment>
      );
    }
    return null;
  }
}

export default MapPipeList;
