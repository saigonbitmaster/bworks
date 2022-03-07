import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { compose } from 'recompose';
import { withStyles, IconButton } from '@material-ui/core';
import { Fullscreen as FullscreenIcon, FullscreenExit as FullscreenExitIcon } from '@material-ui/icons';
import classnames from 'classnames';

class FullScreen extends Component {
  static propTypes = {
    enabled: PropTypes.bool,
    children: PropTypes.any,
    styles: PropTypes.any,
    classes: PropTypes.object,
    className: PropTypes.string,
    onChange: PropTypes.func,
  };

  // exitHandler = e => {
  //   const { enabled } = this.props;
  //   const current =
  //     document.fullScreen ||
  //     document.mozFullScreen ||
  //     document.msFullscreenElement ||
  //     document.webkitIsFullScreen ||
  //     false;
  //   if (current != enabled) {
  //     this.toggle();
  //   }
  // };

  componentDidMount() {
    this.toggle();
    // document.addEventListener('fullscreenchange', this.exitHandler, false);
    // document.addEventListener('mozfullscreenchange', this.exitHandler, false);
    // document.addEventListener('MSFullscreenChange', this.exitHandler, false);
    // document.addEventListener('webkitfullscreenchange', this.exitHandler, false);
  }

  componentWillUnmount() {
    // document.removeEventListener('fullscreenchange', this.exitHandler, false);
    // document.removeEventListener('mozfullscreenchange', this.exitHandler, false);
    // document.removeEventListener('MSFullscreenChange', this.exitHandler, false);
    // document.removeEventListener('webkitfullscreenchange', this.exitHandler, false);
  }

  componentDidUpdate(preProps) {
    if (preProps.enabled != this.props.enabled) {
      this.toggle();
    }
  }

  toggle = () => {
    const { enabled } = this.props;
    const current =
      document.fullScreen ||
      document.mozFullScreen ||
      document.msFullscreenElement ||
      document.webkitIsFullScreen ||
      false;
    if (current === enabled) return;
    if (enabled) {
      this.openFullscreen();
    } else {
      this.closeFullscreen();
    }
  };

  debounceCheck = debounce(() => {
    const { enabled } = this.props;
    if (enabled) {
      this.toggle();
    }
  }, 2000);

  openFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  closeFullscreen() {
    // const elem = document.documentElement;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE/Edge */
      document.msExitFullscreen();
    }
  }

  render() {
    const { styles, className, classes, children, enabled, onChange } = this.props;
    const ToggleScreenIcon = enabled ? FullscreenExitIcon : FullscreenIcon;
    return (
      <div style={styles} className={classnames(enabled ? classes.full : classes.normal, className)}>
        <IconButton color="primary" onClick={() => onChange(!enabled)} className={classes.toggleButton}>
          <ToggleScreenIcon color="primary" style={{ fontSize: 32 }} />
        </IconButton>
        {children}
      </div>
    );
  }
}

const styles = theme => ({
  full: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 90,
    width: '100%',
    margin: 0,
    backgroundColor: '#CCCCCC',
    zIndex: theme.zIndex.drawer + 100,
  },
  normal: {
    position: 'relative',
  },
  toggleButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: theme.zIndex.drawer + 2,
  },
});

export default compose(withStyles(styles))(FullScreen);
