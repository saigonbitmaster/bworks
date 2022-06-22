import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Avatar, Typography } from '@material-ui/core';
import { createMuiTheme, withStyles } from '@material-ui/core/styles';
import { Email } from '@material-ui/icons';
import { defaultTheme } from 'react-admin';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import PasswordSetForm from './PasswordSetForm';

import axios, { AxiosError } from 'axios';
import FetchStatus from '../../components/fetchStatus';
import LoginMenu from '../../components/apps/LoginMenu';
const queryString = require('query-string');

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
    maxWidth: 400,
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


class PasswordSetPage extends Component {
  theme = createMuiTheme(this.props.theme);
  containerRef = React.createRef();
  backgroundImageLoaded = false;

  state = {
    passwordHasBeenSet: null,
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
    const token = queryString.parse(this.props.location.search);
    axios
      .post(`/api/appusers/reset-password?access_token=${token.access_token}`, { newPassword: values.newPassword })
      .then(() => {
        this.setState({
          success: true,
          title: 'New password has been set',
          description: 'Please login with new password',
          linktoMessage: 'Back to login',
        });
      })
      .catch(err => {
        this.setState({
          success: false,
          title: 'Fail to reset password',
          description: err.response.data.error.message,
          linktoMessage: 'Try again',
        });
      });
  };

  refFunc = () => {
    this.state.success == false ? this.props.push('/resetPassword') : this.props.push('/login');
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
                  Enter new password
                </Typography>
              </div>
            </div>
            <PasswordSetForm onSubmit={this.post} />
          </Card>
        ) : (
          <FetchStatus result={this.state} refFunc={this.refFunc}></FetchStatus>
        )}
      </div>
    );
  }
}

PasswordSetPage.propTypes = {
  backgroundImage: PropTypes.string,
  classes: PropTypes.object,
  location: PropTypes.object,
  theme: PropTypes.any,
  push: PropTypes.func,
};

PasswordSetPage.defaultProps = {
  backgroundImage: 'https://source.unsplash.com/collection/14471760/1920x1080',
  theme: defaultTheme,
};

export default compose(withStyles(styles), connect(null, { push }))(PasswordSetPage);
