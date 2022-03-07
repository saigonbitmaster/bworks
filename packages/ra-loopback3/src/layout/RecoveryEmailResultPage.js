import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Card, Typography } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import { CheckCircle, HighlightOff } from '@material-ui/icons';
import { Notification, defaultTheme } from 'react-admin';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import withDataProvider from '../data/withDataProvider';

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
  header: {
    margin: '1em',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  icon: {
    marginRight: '0.75em',
  },
  title: {},
  description: {
    margin: theme.spacing(2),
  },
  retryLink: {
    marginTop: '1em',
    marginBottom: 0,
    textAlign: 'right',
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

class RecoveryEmailResultPage extends Component {
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

  render() {
    const { classes, className, ...rest } = this.props;

    const emailSent = this.props.location ? this.props.location.state.emailSent : null;

    let description = null;
    let title = null;
    let icon = null;

    if (emailSent !== true && emailSent !== false) {
      return null;
    }

    if (emailSent) {
      icon = <CheckCircle style={{ height: 30, width: 30 }} />;
      title = 'Thành công';
      description = 'Email đã được gửi. Xin vui lòng kiểm tra mail để tạo mật khẩu mới.';
    } else {
      icon = <HighlightOff style={{ height: 30, width: 30 }} />;
      title = 'Không thành công';
      description = 'Có vấn đề xảy ra đương lúc gửi email.';
    }

    return (
      <MuiThemeProvider theme={this.theme}>
        <div className={classnames(classes.main, className)} {...sanitizeRestProps(rest)} ref={this.containerRef}>
          <Card className={classes.card}>
            <div className={classes.header}>
              <div className={classes.icon}>{icon}</div>
              <div className={classes.title}>
                <Typography variant="h6" gutterBottom>
                  {title}
                </Typography>
              </div>
            </div>
            <div className={classes.description}>
              <Typography component="p">{description}</Typography>
              {emailSent ? null : (
                <div className={classes.retryLink}>
                  <Link to={'/resetPassword'}>Quay về</Link>
                </div>
              )}
            </div>
          </Card>
          <Notification />
        </div>
      </MuiThemeProvider>
    );
  }
}

RecoveryEmailResultPage.propTypes = {
  authProvider: PropTypes.func,
  backgroundImage: PropTypes.string,
  classes: PropTypes.object,
  className: PropTypes.string,
  input: PropTypes.object,
  form: PropTypes.element,
  meta: PropTypes.object,
  previousRoute: PropTypes.string,
  theme: PropTypes.any,
  location: PropTypes.any,
};

RecoveryEmailResultPage.defaultProps = {
  backgroundImage: 'https://source.unsplash.com/collection/14471760/1920x1080',
  theme: defaultTheme,
};

export default compose(withStyles(styles), withDataProvider)(RecoveryEmailResultPage);
