import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Avatar, Typography } from '@material-ui/core';
import {  withStyles } from '@material-ui/core/styles';
import { Email } from '@material-ui/icons';
import { defaultTheme } from 'react-admin';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import PasswordRecoveryForm from './PasswordRecoveryForm';
import LoginMenu from '../../components/apps/LoginMenu';

import axios, {AxiosError} from 'axios';
import FetchStatus from '../../components/fetchStatus';

import { push } from 'react-router-redux';

const styles = theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    height: '1px',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  card: {
    maxWidth: 600,
    minWidth: 300,
  },

  button: {
    color: 'cyan',
  },
  avatar: {
    margin: '1em',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
  },
  icon: {
    backgroundColor: theme.palette.secondary.main,
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

class PasswordRecoveryPage extends Component {
  containerRef = React.createRef();
  backgroundImageLoaded = false;

  state = {
    emailHasBeenSent: null,

    success: null,
    title: '',
    description: '',
    linkto: '',
    linktoMessage: '',
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

  post = values => {    
    axios
      .post('/api/appusers/reset', { email: values.credential })
      .then(() => {
        this.setState({
          success: true,
          title: 'Reset password link is sent',
          description: 'Please check email to reset password',
          linktoMessage: 'Back to home',
        });
      })
      .catch(err => {
        this.setState({
          success: false,
          title: 'Fail to send the link',
          description: err.response.data.error.message,
          linktoMessage: 'Try again',
        });
      });
  };

  refFunc = () => {
    this.state.success == false
      ? this.setState({
          success: null,
          title: '',
          description: '',
          linkto: '',
          linktoMessage: '',
        })
      : this.props.push('/login');
  };

  render() {
    const { classes, ...rest } = this.props;

    return (
      <div className={classes.main} {...sanitizeRestProps(rest)} ref={this.containerRef}>
        <LoginMenu />

        {this.state.success == null ? (
          <Card className={classes.card}>
            <div className={classes.avatar}>
              <Avatar className={classes.icon}>
                <Email />
              </Avatar>
              <div className={classes.description}>
                <Typography variant="h6" gutterBottom>
                  Reset your password
                </Typography>
              </div>
            </div>
            <PasswordRecoveryForm onSubmit={this.post} />
          </Card>
        ) : (
          <FetchStatus result={this.state} refFunc={this.refFunc}></FetchStatus>
        )}
      </div>
    );
  }
}

PasswordRecoveryPage.propTypes = {
  backgroundImage: PropTypes.string,
  classes: PropTypes.object,
  theme: PropTypes.any,
  push: PropTypes.func,
};

PasswordRecoveryPage.defaultProps = {
  backgroundImage: 'https://source.unsplash.com/collection/14471760/1920x1080',
  theme: defaultTheme,
};

export default compose(withStyles(styles), connect(null, { push }))(PasswordRecoveryPage);