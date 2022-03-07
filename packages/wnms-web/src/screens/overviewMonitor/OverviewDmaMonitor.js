import React, { Component } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import PropTypes from 'prop-types';
import { CardContent, Card, Chip, withTheme, withStyles, fade, Typography, CardHeader } from '@material-ui/core';
import { compose } from 'recompose';
import { useSpring, animated } from 'react-spring/web.cjs';
import Collapse from '@material-ui/core/Collapse';
import { withDataProvider, CUSTOM } from 'ra-loopback3';
import { isArray } from 'lodash';

const styles = {
  root: {
    height: 'auto',
    flexGrow: 1,
    // maxWidth: 400,
    '& > *': {
      margin: 4,
    },
  },
  item: {
    // padding: 8,
  },
  chipLabel: {
    margin: 4,
  },
};

function TransitionComponent(props) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
};

const StyledTreeItem = withStyles(theme => ({
  iconContainer: {
    '& .close': {
      opacity: 0.3,
    },
  },
  group: {
    marginLeft: 12,
    paddingLeft: 24,
    borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
  },
}))(props => <TreeItem {...props} TransitionComponent={TransitionComponent} />);

class OverviewDmaMonitor extends Component {
  state = {
    expanded: ['1', '5'],
    dmas: [],
    loading: true,
  };

  componentDidMount() {
    this.getDmas();
  }

  async getDmas() {
    const { dataProvider } = this.props;
    const res = await dataProvider(CUSTOM, 'dmas', { subUrl: 'tree' });
    if (!this.unmount && isArray(res.data)) {
      this.setState({ dmas: res.data, expanded: res.data.map(dma => dma.id) });
    }
  }

  handleChange = (event, expanded) => {
    this.setState({ expanded });
  };
  onChipClick = e => {
    // e.preventDefault();
    e.stopPropagation();
    // console.log(e);
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  renderItem = (dma, classes) => {
    return (
      <StyledTreeItem
        nodeId={dma.id}
        key={dma.id}
        className={classes.item}
        label={
          <Typography variant="h6">
            {dma.name}{' '}
            <Chip
              className={classes.chipLabel}
              onClick={this.onChipClick}
              variant="outlined"
              color="primary"
              clickable
              label="LL: 4500m3/h - 02/01 12:05"
            />
          </Typography>
        }
      >
        {dma.dmas && dma.dmas.map(sub => this.renderItem(sub, classes))}
      </StyledTreeItem>
    );
  };

  render() {
    const { classes } = this.props;
    const { dmas, expanded } = this.state;
    return (
      <Card>
        <CardHeader title="DMA" />
        <CardContent>
          <TreeView
            className={classes.root}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            expanded={expanded}
            onNodeToggle={this.handleChange}
          >
            {dmas.map(dma => this.renderItem(dma, classes))}
          </TreeView>
        </CardContent>
      </Card>
    );
  }
}
OverviewDmaMonitor.propTypes = {
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
};

export default compose(withTheme, withStyles(styles), withDataProvider)(OverviewDmaMonitor);
