import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Card, Avatar, Typography } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import { Email } from '@material-ui/icons';
import { Notification, defaultTheme } from 'react-admin';
import { showNotification } from 'ra-core';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import compose from 'recompose/compose';
import { CUSTOM, withDataProvider, withTranslate } from 'ra-loopback3';
import RegistrationForm from './RegistrationForm';

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
    maxWidth: 400,
    minWidth: 300,
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

class RegistrationPage extends Component {
  theme = createMuiTheme(this.props.theme);
  containerRef = React.createRef();
  backgroundImageLoaded = false;

  state = {
    requestNotified: null,
  };

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
    this.props
      .dataProvider(CUSTOM, 'ClientUsers', {
        subUrl: 'requestToCreateNewAccount',
        method: 'POST',
        fullUrl: true,
        body: {
          username: values.code,
          email: values.email,
        },
      })
      .then(({ data: requestNotified }) => {
        this.setState({ requestNotified });
      })
      .catch(error => this.props.showNotification(error ? error.message : 'error.INTERNAL_SERVER_ERROR', 'warning'));
  };

  render() {
    const { requestNotified } = this.state;
    const { classes, className, ...rest } = this.props;

    return (
      <MuiThemeProvider theme={this.theme}>
        <div className={classnames(classes.main, className)} {...sanitizeRestProps(rest)} ref={this.containerRef}>
          <Card className={classes.card}>
            <div className={classes.avatar}>
              <Avatar className={classes.icon}>
                <Email />
              </Avatar>
              <div className={classes.description}>
                <Typography variant="h6" gutterBottom>
                  Xác nhận thông tin
                </Typography>
              </div>
            </div>
            <RegistrationForm onSubmit={this.submit} />
          </Card>
          {typeof requestNotified === 'string' ? (
            <Redirect to={{ pathname: '/registrationResult', state: { result: requestNotified } }} />
          ) : null}
          <Notification />
        </div>
      </MuiThemeProvider>
    );
  }
}

RegistrationPage.propTypes = {
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
  translate: PropTypes.func,
};

RegistrationPage.defaultProps = {
  backgroundImage: 'https://source.unsplash.com/collection/14471760/1920x1080',
  theme: defaultTheme,
};

export default compose(
  withStyles(styles),
  withDataProvider,
  withTranslate,
  connect(null, { showNotification }),
)(RegistrationPage);
