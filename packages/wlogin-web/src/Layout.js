import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push as pushAction } from 'react-router-redux';
import classnames from 'classnames';
import { withRouter } from 'react-router';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import { defaultTheme, Sidebar, Menu, Notification, Error } from 'react-admin';

import { AppButton, LoginPage } from 'web-common';
import {
  CUSTOM,
  Storage,
  withDataProvider,
  CommonProviderContext,
  myAccessAction,
  AppBar,
  darkTheme,
  lightTheme,
} from 'ra-loopback3';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1,
    minHeight: '100vh',
    // backgroundColor: theme.palette.background.default,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    position: 'relative',
    minWidth: 'fit-content',
    width: '100%',
  },
  appFrame: {
    display: 'flex',
    flexDirection: 'column',
  },
  contentWithSidebar: {
    // marginTop: '32px',
    display: 'flex',
    flexGrow: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    padding: `24px 0 0 0`,
    // backgroundColor: theme.palette.grey[300],
    // [theme.breakpoints.up('xs')]: {
    //   paddingLeft: 8,
    //   paddingRight: 8,
    //   paddingBottom: 8,
    //   paddingTop: 24,
    // },
    // [theme.breakpoints.down('sm')]: {
    //   padding: 0,
    //   paddingTop: 24,
    // },
  },
});

const sanitizeRestProps = ({ staticContext, history, location, match, ...props }) => props;

class Layout extends Component {
  state = { hasError: false, errorMessage: null, errorInfo: null };
  containerRef = React.createRef();
  backgroundImageLoaded = false;

  constructor(props) {
    super(props);
    /**
     * Reset the error state upon navigation
     *
     * @see https://stackoverflow.com/questions/48121750/browser-navigation-broken-by-use-of-react-error-boundaries
     * */
    props.history.listen(() => {
      if (this.state.hasError) {
        this.setState({ hasError: false });
      }
    });
  }

  componentDidMount() {
    this.lazyLoadBackgroundImage();
  }

  componentDidCatch(errorMessage, errorInfo) {
    this.setState({ hasError: true, errorMessage, errorInfo });
  }

  lazyLoadBackgroundImage() {
    const { backgroundImage } = this.props;

    if (backgroundImage) {
      const img = new Image();
      img.onload = this.updateBackgroundImage;
      img.src = backgroundImage;
    }
  }

  updateBackgroundImage = () => {
    if (!this.backgroundImageLoaded && this.containerRef.current) {
      const { backgroundImage } = this.props;
      this.loadBackground(backgroundImage);
    }
  };

  loadBackground = link => {
    if (!this.backgroundImageLoaded && this.containerRef.current) {
      this.containerRef.current.style.backgroundImage = `url(${link})`;
      this.backgroundImageLoaded = true;
    }
  };

  render() {
    const {
      appBar,
      children,
      classes,
      className,
      customRoutes,
      error,
      dashboard,
      logout,
      menu,
      notification,
      notifyBage,
      extBar,
      open,
      sidebar,
      title,
      hiddenComponents,
      backgroundImage,
      ...props
    } = this.props;
    const { hasError, errorMessage, errorInfo } = this.state;
    return (
      <div
        className={classnames('layout', classes.root, className)}
        {...sanitizeRestProps(props)}
        ref={this.containerRef}
      >
        <div className={classes.appFrame}>
          {createElement(appBar, { title, open, logout, notifyBage, extBar })}
          <main className={classes.contentWithSidebar}>
            {/* {createElement(sidebar, {
              children: createElement(menu, {
                logout,
                hasDashboard: !!dashboard,
              }),
            })} */}
            <div className={classes.content}>
              {hasError
                ? createElement(error, {
                    error: errorMessage,
                    errorInfo,
                    title,
                  })
                : children}
            </div>
          </main>
          {hiddenComponents && hiddenComponents.map(({ key, component: Node }) => <Node key={key} />)}
          {createElement(notification)}
        </div>
      </div>
    );
  }
}

const componentPropType = PropTypes.oneOfType([PropTypes.func, PropTypes.string]);

Layout.propTypes = {
  appBar: componentPropType,
  extBar: PropTypes.any,
  notifyBage: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  classes: PropTypes.object,
  className: PropTypes.string,
  customRoutes: PropTypes.array,
  dashboard: componentPropType,
  error: componentPropType,
  history: PropTypes.object.isRequired,
  logout: PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.string]),
  menu: componentPropType,
  notification: componentPropType,
  open: PropTypes.bool,
  sidebar: componentPropType,
  title: PropTypes.node.isRequired,
  hiddenComponents: PropTypes.arrayOf(PropTypes.object),
  backgroundImage: PropTypes.string,
};

Layout.defaultProps = {
  appBar: AppBar,
  error: Error,
  menu: Menu,
  notification: Notification,
  sidebar: Sidebar,
  extBar: [{ key: 'apps', component: AppButton }],
    
  // backgroundImage: dailyBackgroundUrl,
};

const mapStateToProps = state => ({
  open: state.admin.ui.sidebarOpen,
});

const EnhancedLayout = compose(
  connect(
    mapStateToProps,
    {}, // Avoid connect passing dispatch in props
  ),
  withRouter,
  withStyles(styles),
)(Layout);

class LayoutWithTheme extends Component {
  constructor(props) {
    super(props);
    this.theme = createMuiTheme({
      ...props.theme,
      typography: {
        useNextVariants: true,
      },
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.theme !== this.props.theme) {
      this.theme = createMuiTheme({
        ...nextProps.theme,
        typography: {
          useNextVariants: true,
        },
      });
    }
  }

  // lay api cua user and save vao redux
  setAccess = project => {
    const { myaccess, userModel, dataProvider, setMyAccess, push } = this.props;
    if (!myaccess && !this.project) {
      this.project = project;
      dataProvider(CUSTOM, userModel, {
        subUrl: 'myAccess',
        body: { project },
        method: 'post',
      })
        .then(res => {
          if (res.data) {
            // console.log('myAccess', res.data);
            setMyAccess(res.data); // save my access to redux
          }
        })
        // eslint-disable-next-line no-unused-vars
        .catch(e => {
          Storage.removeUser();
          push('/login');
        });
    }
  };

  render() {
    const { theme, dataProvider, setMyAccess, userModel, myaccess, push, ...rest } = this.props;
    return (
      <CommonProviderContext.Consumer>
        {({ project }) => {
          if (!myaccess) {
            this.setAccess(project || 'bworks'); // default project: ctm
            return (
              <div className="loader-container">
                <div className="loader">Loading...</div>
              </div>
            );
          }
          return (
            <MuiThemeProvider theme={this.theme}>
              <EnhancedLayout {...rest} project={project} />
            </MuiThemeProvider>
          );
        }}
      </CommonProviderContext.Consumer>
    );
  }
}

LayoutWithTheme.propTypes = {
  theme: PropTypes.object,
  myaccess: PropTypes.object,
  dataProvider: PropTypes.func,
  userModel: PropTypes.string,
  setMyAccess: PropTypes.func,
  push: PropTypes.func,
};

LayoutWithTheme.defaultProps = {
  theme: defaultTheme,
  userModel: 'appusers',
};

const EnhanceLayoutWithTheme = compose(
  withDataProvider,
  connect(
    state => ({
      myaccess: state.sfdata.myaccess,
      theme: state.theme === 'dark' ? darkTheme : lightTheme,
    }),
    {
      setMyAccess: myAccessAction,
      push: pushAction,
    },
  ),
)(LayoutWithTheme);

export default EnhanceLayoutWithTheme;
