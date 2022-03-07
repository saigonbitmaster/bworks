import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Card, ListSubheader } from '@material-ui/core';
import GisLayerList from './GisLayerList';

class GisLeftSide extends Component {
  static propTypes = {
    layer: PropTypes.object.isRequired,
    title: PropTypes.string,
    activeGroup: PropTypes.string.isRequired,
    prefix: PropTypes.string,
  };

  render() {
    const { layer, title, activeGroup } = this.props;
    return (
      <div style={{ minWidth: 300, marginRight: 8, display: 'flex' }}>
        <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <GisLayerList
            prefix=""
            activeGroup={activeGroup}
            layer={layer}
            subheader={<ListSubheader component="div">{title}</ListSubheader>}
          />
        </Card>
      </div>
    );
  }
}

const stateToProps = (state, props) => ({
  layer: state.gis[props.layer || 'layer'],
  activeGroup: state.gis.activeGroup,
});

const EnhanceGisLeftSide = compose(connect(stateToProps))(GisLeftSide);

export default EnhanceGisLeftSide;
