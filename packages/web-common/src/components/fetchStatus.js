import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { CheckCircle, HighlightOff } from '@material-ui/icons';
import { defaultTheme } from 'react-admin';
import compose from 'recompose/compose';
import { push } from 'react-router-redux';

import { connect } from 'react-redux';
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

  button: {
    color: 'cyan',
  },
  card: {
    maxWidth: 400,
    minWidth: 300,
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

class RecoveryEmailResultPage extends Component {
  render() {
    const { classes, result, refFunc } = this.props;
    let icon = null;
    if (typeof result.success !== 'boolean') {
      return null;
    }

    if (result.success == true) {
      icon = <CheckCircle style={{ height: 30, width: 30 }} />;
    } else {
      icon = <HighlightOff style={{ height: 30, width: 30 }} />;
    }

    return (
      <Card className={classes.card}>
        <div className={classes.header}>
          <div className={classes.icon}>{icon}</div>
          <div className={classes.title}>
            <Typography variant="h6" gutterBottom>
              {result.title}
            </Typography>
          </div>
        </div>
        <div className={classes.description}>
          <Typography component="p">{result.description}</Typography>

          <div className={classes.retryLink}>
            <Button onClick={() => refFunc()}> {result.linktoMessage} </Button>
          </div>
        </div>
      </Card>
    );
  }
}

RecoveryEmailResultPage.propTypes = {
  classes: PropTypes.object,
  theme: PropTypes.any,
  location: PropTypes.any,
  result: PropTypes.object,
  refFunc: PropTypes.func,
};

RecoveryEmailResultPage.defaultProps = {
  result: {
    success: true,
    title: 'password link is sent',
    description: 'please check email to verify the information',
    linktoMessage: 'back to home',
  },
  theme: defaultTheme,
};

export default compose(
  withStyles(styles),
  connect(null, {
    push,
  }),
)(RecoveryEmailResultPage);
