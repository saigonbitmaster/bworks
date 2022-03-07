import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import GisLayerListItem from './GisLayerListItem';

class GisLayerList extends PureComponent {
  state = {
    open: true,
  };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  render() {
    const { layer, subheader, menuLevel, activeGroup, prefix } = this.props;
    return (
      <List component="nav" subheader={subheader} style={{ marginLeft: 8 * menuLevel * 2 }}>
        {Object.keys(layer).map(key => (
          <GisLayerListItem
            prefix={prefix ? `${prefix}.sub.${key}` : key}
            activeGroup={activeGroup}
            item={layer[key]}
            key={key}
            menuLevel={menuLevel}
          />
        ))}
      </List>
    );
  }
}

GisLayerList.propTypes = {
  layer: PropTypes.object.isRequired,
  subheader: PropTypes.any,
  menuLevel: PropTypes.number,
  activeGroup: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired,
};

GisLayerList.defaultProps = {
  menuLevel: 0,
};

export default GisLayerList;
