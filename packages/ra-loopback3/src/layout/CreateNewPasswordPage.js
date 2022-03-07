import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Card, Avatar, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { showNotification } from 'ra-core';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import { LockOutlined } from '@material-ui/icons';
import { Notification, defaultTheme } from 'react-admin';
import compose from 'recompose/compose';
import withDataProvider from '../data/withDataProvider';
import { URL_ONLY } from '../data/LoopbackRest';
import CreateNewPasswordForm from './CreateNewPasswordForm';

const styles = theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    height: '1px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  card: {
    maxWidth: 500,
    minWidth: 400,
    marginTop: '6em',
  },
  avatar: {
    margin: '1em',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
  },
  icon: {
    backgroundColor: theme.palette.secondary[500],
    marginRight: '0.75em',
  },
  description: {
    marginBottom: 0,
    marginTop: '12px',
  },
});

const sanitizeRestProps = ({
  array,
  backgroundImage,
  classes,
  className,
  location,
  staticContext,
  theme,
  title,
  ...rest
}) => rest;

class CreateNewPasswordPage extends Component {
  theme = createMuiTheme(this.props.theme);
  containerRef = React.createRef();
  backgroundImageLoaded = false;

  updateBackgroundImage = (lastTry = false) => {
    if (!this.backgroundImageLoaded && this.containerRef.current) {
      const { backgroundImage } = this.props;
      this.containerRef.current.style.backgroundImage = `url(${backgroundImage})`;
      this.backgroundImageLoaded = true;
    }
    if (lastTry) {
      this.backgroundImageLoaded = true;
    }
  };

  lazyLoadBackgroundImage = () => {
    const { backgroundImage } = this.props;
    if (backgroundImage) {
      const img = new Image();
      img.onload = this.updateBackgroundImage();
      img.src = backgroundImage;
    }
  };

  componentDidMount = () => {
    this.lazyLoadBackgroundImage();
  };

  componentDidUpdate = () => {
    if (!this.backgroundImageLoaded) {
      this.lazyLoadBackgroundImage(true);
    }
  };

  submit = values => {
    const { dataProvider, showNotification, method, extraArgsToBody } = this.props;
    // Get access token
    const accessToken = window.location.href.split('accessToken=')[1];

    dataProvider(URL_ONLY, this.props.pluralizedModel, {
      subUrl: `${method ? method : 'reset-password'}?access_token=${accessToken}`,
      fullUrl: true,
      ignoreToken: true,
    })
      .then(({ data: { url } }) => {
        const parsedExtraArgsToBody = Object.entries(extraArgsToBody || {})
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&');
        return fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `newPassword=${encodeURIComponent(values.newPassword)}&${parsedExtraArgsToBody}`,
        });
      })
      .then(response => {
        if (response.status === 204) {
          showNotification('notification.passwords.createNewPasswordSuccess');
        } else {
          showNotification('notification.passwords.createNewPasswordFailure', 'warning');
        }
      })

      .catch(() => this.props.showNotification('notification.passwords.createNewPasswordFailure', 'warning'))
      .finally(() => this.props.history.push('/login'));
  };

  render() {
    const { classes, className, ...rest } = this.props;

    return (
      <MuiThemeProvider theme={this.theme}>
        <div className={classnames(classes.main, className)} {...sanitizeRestProps(rest)} ref={this.containerRef}>
          <Card className={classes.card}>
            <div className={classes.avatar}>
              <Avatar className={classes.icon}>
                <LockOutlined />
              </Avatar>
              <div className={classes.description}>
                <Typography variant="h6" gutterBottom>
                  Tạo mật khẩu mới
                </Typography>
              </div>
            </div>
            <CreateNewPasswordForm onSubmit={this.submit} />
          </Card>
          <Notification />
        </div>
      </MuiThemeProvider>
    );
  }
}

CreateNewPasswordPage.propTypes = {
  authProvider: PropTypes.func,
  backgroundImage: PropTypes.string,
  classes: PropTypes.object,
  className: PropTypes.string,
  input: PropTypes.object,
  form: PropTypes.element,
  meta: PropTypes.object,
  previousRoute: PropTypes.string,
  theme: PropTypes.any,
  dataProvider: PropTypes.func,
  showNotification: PropTypes.any,
  history: PropTypes.any,
  pluralizedModel: PropTypes.string,
  method: PropTypes.string,
  extraArgsToBody: PropTypes.object,
};

CreateNewPasswordPage.defaultProps = {
  backgroundImage: 'https://source.unsplash.com/collection/14471760/1920x1080',
  theme: defaultTheme,
};

export default compose(
  connect(null, { showNotification }),
  withStyles(styles),
  withDataProvider,
  withRouter,
)(CreateNewPasswordPage);
