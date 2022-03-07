import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Layers as GroupIcon, ExpandLess, ExpandMore } from '@material-ui/icons';
import { compose } from 'recompose';
import {
  ListItemIcon,
  Checkbox,
  ListItemSecondaryAction,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { translate } from 'ra-core';
import GisLayerList from './GisLayerList';
import { gisActiveGroup as gisActiveGroupAction, gisToggleGroup as gisToggleGroupAction } from './gisActions';
const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing(2),
  },
  icon: {
    // marginLeft: theme.spacing(4),
    marginRight: 0,
  },
});
class GisLayerListItem extends PureComponent {
  state = {
    open: false,
  };

  handleActive = () => {
    const { gisActiveGroup, prefix, activeGroup } = this.props;
    if (activeGroup !== prefix) {
      gisActiveGroup(prefix);
    }
  };

  handleExpand = () => {
    this.setState({ open: !this.state.open });
  };

  handleToggle = () => {
    const { gisToggleGroup, prefix } = this.props;
    gisToggleGroup(prefix);
    this.forceUpdate();
  };

  render() {
    const { item, classes, translate, menuLevel, activeGroup, prefix } = this.props;
    const { open } = this.state;
    return (
      <Fragment>
        <ListItem button onClick={this.handleActive} selected={activeGroup === prefix}>
          <ListItemIcon className={classes.icon}>{item.icon ? item.icon : <GroupIcon />}</ListItemIcon>
          <ListItemText inset primary={translate(item.label, { _: item.resource })} />
          <ListItemSecondaryAction>
            <Checkbox
              onChange={this.handleToggle}
              checked={item.checked}
              // tabIndex={1000}
              inputProps={{ 'aria-labelledby': item.resource }}
            />
            <IconButton onClick={this.handleExpand}>
              {item.sub && open && item.checked ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        {item.sub && (
          <Collapse in={item.sub && open && item.checked} timeout="auto" unmountOnExit>
            <GisLayerList menuLevel={menuLevel + 1} layer={item.sub} activeGroup={activeGroup} prefix={prefix} />
          </Collapse>
        )}
      </Fragment>
    );
  }
}

GisLayerListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
  menuLevel: PropTypes.number.isRequired,
  activeGroup: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired,
  gisActiveGroup: PropTypes.func,
  gisToggleGroup: PropTypes.func,
};

const EnhanceGisLayerListItem = compose(
  withStyles(styles),
  translate,
  connect(undefined, {
    gisActiveGroup: gisActiveGroupAction,
    gisToggleGroup: gisToggleGroupAction,
  }),
)(GisLayerListItem);
export default EnhanceGisLayerListItem;
