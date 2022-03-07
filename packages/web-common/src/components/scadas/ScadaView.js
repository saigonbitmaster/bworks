import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Backdrop, CircularProgress } from '@material-ui/core';
import { compose } from 'recompose';
// import classNames from 'classnames';
import { get, inRange } from 'lodash';
// eslint-disable-next-line
import { Canvas } from 'react-design-editor/dist/react-design-editor.min';
import ScadaViewTool from './ScadaViewTool';
import { FullScreen } from 'ra-loopback3';

const itemStatusMap = {
  default: {
    fill: '#ffffff',
    backgroundColor: '#0069c0',
    animation: true,
  },
  normal: {
    fill: '#ffffff',
    backgroundColor: '#087f23',
    animation: false,
  },
  warning: {
    fill: '#ffffff',
    backgroundColor: '#bb4d00',
    animation: true,
  },
  error: {
    fill: '#ffffff',
    backgroundColor: '#ba000d',
    animation: true,
  },
};

const styles = theme => ({
  tooltipRoot: {
    zIndex: theme.zIndex.drawer + 10000,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    position: 'absolute',
    backgroundColor: '#CCCCCC',
    color: '#fff',
  },
  containerFull: {
    position: 'relative',
    height: 'calc(100vh - 32px)',
    backgroundColor: 'black',
    minHeight: 600,
    padding: theme.spacing(2),
  },
  container: {
    position: 'relative',
    height: 'calc(100vh - 96px)',
    backgroundColor: 'black',
    minHeight: 600,
    padding: theme.spacing(2),
  },
  toggleButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: theme.zIndex.drawer + 2,
  },
});

const ANIMATION = {
  type: 'fade',
  loop: true,
  autoplay: false,
  delay: 200,
  duration: 1000,
};

const defaultKeyboardEvent = {
  move: true,
  all: true,
  copy: true,
  paste: true,
  esc: true,
  del: true,
  clipboard: false,
  transaction: true,
};

class ScadaView extends Component {
  static propTypes = {
    title: PropTypes.string,
    viewData: PropTypes.any,
    classes: PropTypes.object,
    onViewReady: PropTypes.func,
    children: PropTypes.node,
  };

  canvasRef = React.createRef();

  state = { isFull: false, canvasStatus: 'loading', zoom: 1 };
  reported = {};
  status = {}; // item status in canvas

  onToggle = () => {
    const { isFull } = this.state;
    this.setState({ isFull: !isFull }, () => setTimeout(this.canvasRef.current.handler.zoomHandler.zoomToFit, 100));
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  onCanvasReady = ref => {
    this.canvasRef.current = ref;
    this.setState({ canvasStatus: 'empty' }, this.loadView);
  };

  isInRange = (rangeText, val) => {
    try {
      const range = JSON.parse(rangeText);
      const value = parseFloat(val);
      if (range.length === 2) {
        return inRange(value, range[0], range[1]);
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  getItemStatus = (item, reported) => {
    if (!reported.normalRange) {
      return itemStatusMap.default;
    }
    if (this.isInRange(reported.normalRange, reported.val)) {
      return itemStatusMap.normal;
    }
    if (reported.warningRange && this.isInRange(reported.warningRange, reported.val)) {
      return itemStatusMap.warning;
    }

    return itemStatusMap.error;
  };

  updateItem = (item, reported, handler) => {
    if (item && reported && handler) {
      const value = reported.val || reported.value;
      handler.setById(item.id, 'text', value);
      const itemStatus = this.getItemStatus(item, reported);
      // update to view
      if (itemStatus.fill) {
        handler.setById(item.id, 'fill', itemStatus.fill);
      }
      if (itemStatus.backgroundColor) {
        // console.log(itemStatus.backgroundColor);
        handler.setById(item.id, 'backgroundColor', itemStatus.backgroundColor);
      }
      if (itemStatus.animation) {
        handler.animationHandler.play(item.id);
      } else {
        handler.animationHandler.stop(item.id);
      }
    }
  };

  onData = data => {
    // todo
    const reported = get(data, 'reported', {});
    // console.log('ScadaView.onData', reported);
    // this.reported = reported || {};
    const { canvasStatus } = this.state;
    if (canvasStatus === 'ready') {
      const keys = Object.keys(reported);
      // eslint-disable-next-line array-callback-return
      keys.map(key => {
        const item = this.status[key];
        const itemReport = reported[key];
        this.reported[key] = itemReport;
        if (item) {
          this.updateItem(item, itemReport, this.canvasRef.current.handler);
        }
      });
    }
  };

  updateCanvas = () => {
    //
  };

  loadView = async () => {
    const { viewData, onViewReady } = this.props;
    const rawItems = typeof viewData === 'function' ? await viewData() : viewData;
    const items = rawItems.objects.map(item => {
      if (item.type === 'textbox') {
        const newItem = { ...item };
        newItem.link = { enabled: true };
        newItem.animation = ANIMATION;
        newItem.text = 'N/A';
        this.status[item.name] = newItem;
        return newItem;
      }
      return item;
    });
    this.canvasRef.current.handler.importJSON(items, () => {
      this.canvasRef.current.handler.zoomHandler.zoomToFit();
      this.setState({ canvasStatus: 'ready' }, () => {
        if (onViewReady) {
          onViewReady();
        }
      });
    });
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(preProps, preState) {
    // todo
  }

  onTooltip = (item, target) => {
    const { classes } = this.props;
    return (
      <div classNames={classes.tooltipRoot}>
        <p style={{ backgroundColor: itemStatusMap.default.backgroundColor, margin: 4, padding: 8, borderRadius: 3 }}>
          Tag: {target.name}
        </p>
        <p
          style={{
            backgroundColor: target.backgroundColor || itemStatusMap.default.backgroundColor,
            margin: 4,
            padding: 8,
            borderRadius: 3,
          }}
        >
          Value: {target.text}
        </p>
      </div>
    );
  };

  render() {
    const { classes, children } = this.props;
    const { isFull, canvasStatus, zoom } = this.state;
    return (
      <FullScreen enabled={this.state.isFull} onChange={this.onToggle}>
        <div className={isFull ? classes.containerFull : classes.container}>
          <Backdrop className={classes.backdrop} open={canvasStatus !== 'ready'}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <Canvas
            editable={false}
            ref={this.onCanvasReady}
            minZoon={50}
            maxZoom={200}
            onTooltip={this.onTooltip}
            onZoom={zoom => this.setState({ zoom })}
            keyEvent={{ ...defaultKeyboardEvent }}
          />
          <ScadaViewTool canvasRef={this.canvasRef} zoom={zoom} />
          {children}
        </div>
      </FullScreen>
    );
  }
}

const ScadaViewEnhance = compose(withStyles(styles))(ScadaView);

export default ScadaViewEnhance;
