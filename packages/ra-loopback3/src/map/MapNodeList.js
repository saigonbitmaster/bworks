import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import MapNode from './MapNode';

class MapNodeList extends Component {
  static propTypes = {
    nodes: PropTypes.any,
    options: PropTypes.object,
    onClick: PropTypes.func,
    activeId: PropTypes.any,
  };

  render() {
    const { nodes, activeId, ...rest } = this.props;
    if (nodes && nodes.length > 0) {
      return (
        <Fragment>
          {nodes.map(node => (
            <MapNode key={node.id} {...rest} node={node} active={activeId} />
          ))}
        </Fragment>
      );
    }
    return null;
  }
}

export default MapNodeList;
