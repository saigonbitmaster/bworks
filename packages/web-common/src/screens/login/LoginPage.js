import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import { Person as LoginIcon } from '@material-ui/icons';
import { defaultTheme, LoginForm as DefaultLoginForm } from 'ra-loopback3';
import { CardHeader } from '@material-ui/core';
import Button from '@material-ui/core/Button';
// import { debounce } from 'lodash';
import { dailyBackgroundUrl } from '../../constants';

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
      // css
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
      marginRight: '2em',
      justifyContent: 'center',
    },
    icon: {
      backgroundColor: theme.palette.primary.main,
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

  // reloadBackground = debounce(() => {
  //   this.backgroundImageLoaded = false;
  //   this.loadBackground(`https://source.unsplash.com/1600x900/daily?${bgQuery()}`);
  // }, 2000);

  render() {
    const { classes, className, loginForm } = this.props;

    return (
      <MuiThemeProvider theme={this.theme}>
        
        <div className={classnames(classes.main, className)} ref={this.containerRef}>
        <div style={{ marginTop: 0, marginRight: 10, top: 0, right: 0, position: "absolute"}} >
        </div>
        
          {/* <Tooltip title="Background">
            <Fab color="primary" aria-label="random-image" onClick={this.reloadBackground} className={classes.fab}>
              <BackgroundIcon />
            </Fab>
          </Tooltip> */}

          <Card className={classes.card}>
            <CardHeader
              avatar={
                <Avatar className={classes.icon}>
                  <LoginIcon />
                </Avatar>
              }
              className={classes.cardHeader}
              // subheader="Bworks"
              title="Bworks - Job marketplace"
            />
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
