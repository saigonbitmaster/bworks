import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialUseList from '../../resources/materialUse/MaterialUseList';
import DmaList from '../../resources/dma/DmaList';
import NodeList from '../../resources/node/NodeList';
import PipeList from '../../resources/materialUse/PipeList';
import FactoryList from '../../resources/factory/FactoryList';

class DesignList extends Component {
  render() {
    const { model } = this.props;
    switch (model) {
      case 'Dma':
        return <DmaList {...this.props} />;
      case 'Node':
        return <NodeList {...this.props} />;
      case 'Pipe':
        return <PipeList {...this.props} />;
      case 'Factory':
        return <FactoryList {...this.props} />;
      default:
        return <MaterialUseList key={model} {...this.props} />;
    }
  }
}
DesignList.propTypes = {
  model: PropTypes.string,
};
DesignList.defaultProps = {
  model: 'Dma',
};

export default DesignList;
