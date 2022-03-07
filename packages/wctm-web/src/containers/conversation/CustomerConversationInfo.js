import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popper, withStyles, Card, CardContent, Paper, Typography } from '@material-ui/core';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';

const styles = theme => ({
  root: {
    padding: theme.spacing(1),
    zIndex: 10000,
  },
});

class CustomerConversationInfo extends Component {
  anchorEl = null;
  constructor(props) {
    super(props);
    this.anchorEl = document.getElementById('conversation-window-fab');
  }

  renderClient(client) {
    <Card>
      <CardContent>
        {client && (
          <div>
            <p>{client.name}</p>
            <Link to={`/clients/${client.id}`}>info</Link>
          </div>
        )}
      </CardContent>
    </Card>;
  }

  render() {
    const { classes, client } = this.props;
    return (
      <Popper placement="top-end" disablePortal={false} open anchorEl={this.anchorEl} className={classes.root}>
        <Paper>
          <Typography className={classes.typography}>The content of the Popper.</Typography>
          <Card>
            <CardContent>
              <h1>Hello</h1>
              {client && (
                <div>
                  <p>{client.name}</p>
                  <Link to={`/clients/${client.id}`}>info</Link>
                </div>
              )}
            </CardContent>
          </Card>
        </Paper>
      </Popper>
    );
  }
}

CustomerConversationInfo.propTypes = {
  classes: PropTypes.object,
  conversation: PropTypes.object,
  client: PropTypes.object,
};

const CustomerConversationInfoEnhance = compose(withStyles(styles))(CustomerConversationInfo);

export default CustomerConversationInfoEnhance;
