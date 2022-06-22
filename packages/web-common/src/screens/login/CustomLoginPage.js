import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import { Person as LoginIcon } from '@material-ui/icons';
import { defaultTheme, LoginForm as DefaultLoginForm } from 'ra-loopback3';
import { CardHeader, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
// import { debounce } from 'lodash';
import { dailyBackgroundUrl } from '../../constants';
import LoginMenu from '../../components/apps/LoginMenu';

const styles = theme => {
  return {
    main: {
      display: 'flex',
      minHeight: '100vh',
      height: '1px',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundColor: theme.palette.primary.light,
    },
    card: {
      maxWidth: 500,
      minWidth: 300,
    },
    cardHeader: {
      padding: 24,
    },
    fab: {
      position: 'absolute',
      bottom: 32,
      right: 32,
    },
    avatar: {
      margin: '1em',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'baseline',
    },
    button: {
      color: 'cyan',
    },
    icon: {
      backgroundColor: theme.palette.secondary.main,
      marginRight: '0.75em',
    },
  };
};

class Login extends Component {
  containerRef = React.createRef();
  backgroundImageLoaded = false;
  constructor(props) {
    super(props);
    this.theme = createMuiTheme(props.theme);
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

  // Load background image asynchronously to speed up time to interactive
  lazyLoadBackgroundImage() {
    const { backgroundImage } = this.props;

    if (backgroundImage) {
      const img = new Image();
      img.onload = this.updateBackgroundImage;
      img.src = backgroundImage;
    }
  }

  componentDidMount() {
    this.lazyLoadBackgroundImage();
  }

  componentDidUpdate() {
    if (!this.backgroundImageLoaded) {
      this.lazyLoadBackgroundImage();
    }
  }

  render() {
    const { classes, className, loginForm } = this.props;

    return (
      <MuiThemeProvider theme={this.theme}>
        <div className={classnames(classes.main, className)} ref={this.containerRef}>
          <LoginMenu />
          <Card className={classes.card}>
            <div className={classes.avatar}>
              <Avatar className={classes.icon}>
                <LoginIcon />
              </Avatar>

              <Typography variant="h6" gutterBottom>
             bWorks - Job marketplace
              </Typography>
            </div>
            {loginForm}
          </Card>
        </div>
      </MuiThemeProvider>
    );
  }
}

Login.propTypes = {
  backgroundImage: PropTypes.string,
  loginForm: PropTypes.element,
  theme: PropTypes.object,
  staticContext: PropTypes.object,
  classes: PropTypes.object,
  className: PropTypes.string,
};

const EnhancedLogin = withStyles(styles)(Login);

EnhancedLogin.defaultProps = {
  backgroundImage: dailyBackgroundUrl,
  theme: defaultTheme,
  loginForm: <DefaultLoginForm />,
};
export default EnhancedLogin;
