import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withDataProvider, URL_ONLY, GET_ONE } from 'ra-loopback3';
import { conversationUpdate as conversationUpdateAction } from '../../actions/conversationActions';
import { Call as CallingIcon, CallEnd as IdleIcon } from '@material-ui/icons';
import { isEqual, get } from 'lodash';
import { Paper, AppBar, Toolbar, Typography, Card, CardContent, Fab, Zoom, withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { green, blue, red } from '@material-ui/core/colors';
import TimeCounter from './TimeCounter';
import CustomerContactVew from './CustomerContactVew';
import CustomerConversationInfo from './CustomerConversationInfo';

const styles = theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    padding: theme.spacing(1),
    // display: 'inline-block',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  fabGreen: {
    color: theme.palette.common.white,
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[600],
    },
  },
  fabBlue: {
    color: theme.palette.common.white,
    backgroundColor: blue[500],
    '&:hover': {
      backgroundColor: blue[600],
    },
  },
  fabRed: {
    color: theme.palette.common.white,
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[600],
    },
  },
});

const PHONE_STATUS = {
  IDLE: 'idle',
  INCOMMING: 'incomming',
  OUTGOING: 'outgoing',
  INCOMMING_ACTIVE: 'incomming_active',
  OUTGOING_ACTIVE: 'outgoing_active',
  ENDED: 'ended',
};
class ConversationWindow extends Component {
  eventSource = null;
  state = {
    phoneStatus: PHONE_STATUS.IDLE,
    conversation: null,
    client: undefined,
    updateTime: null,
  };
  fabs = null;
  fabRef = React.createRef();

  constructor(props) {
    super(props);
    const { classes } = props;
    this.fabs = {
      idle: {
        icon: <IdleIcon className={classes.extendedIcon} />,
        color: 'primary',
        className: classNames(classes.fab, classes.fabBlue),
        'aria-label': 'Idle',
      },
      calling: {
        icon: <CallingIcon className={classes.extendedIcon} />,
        className: classNames(classes.fab, classes.fabGreen),
        color: 'secondary',
        'aria-label': 'Calling',
      },
    };
  }

  componentDidMount() {
    this.initEventSource();
  }

  static getDerivedStateFromProps(props, state) {
    const { conversation } = props;
    const { conversation: old = {} } = state;
    let client = undefined;
    if (conversation && isEqual(conversation.target, get(old, 'target'))) {
      client = state.client;
    }
    return {
      conversation: props.conversation,
      client,
      updateTime: new Date(),
    };
  }

  componentDidUpdate() {
    this.getUserInfo();
  }

  getUserInfo = async () => {
    const { conversation, client } = this.state;
    if (conversation && conversation.target && client === undefined) {
      const clientId = get(conversation, 'data.clientId');
      let client = null;
      const { dataProvider } = this.props;
      // get client
      if (clientId) {
        client = await dataProvider(GET_ONE, 'clients', { id: clientId });
      } else {
        client = await dataProvider(GET_ONE, 'clients', { id: '5d6f2df8f5f66f484bfb2ebb' }); //5d6f2df8f5f66f484bfb2ebb
      }

      this.setState({ client: client ? client.data : null });
    }
  };

  initEventSource = async () => {
    if (!EventSource) return; // check supoort
    const { dataProvider, conversationUpdate } = this.props;
    const { data } = await dataProvider(URL_ONLY, 'conversations', {
      subUrl: 'change-stream',
      rawFilter: {
        where: { type: 'PHONE', supporterId: '1a1a1a1a1a1a1a1a1a1a1a1b' },
      },
    });
    // console.log(data.url);
    this.eventSource = new EventSource(data.url);
    this.eventSource.addEventListener('data', function(msg) {
      conversationUpdate(JSON.parse(msg.data)); // the change object
    });
  };

  componentWillUnmount() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  onFabClick = () => {
    // console.log('onFabClick');
    const { phoneStatus } = this.state;
    this.setState({
      phoneStatus: phoneStatus === PHONE_STATUS.IDLE ? PHONE_STATUS.INCOMMING_ACTIVE : PHONE_STATUS.IDLE,
    });
  };

  render() {
    const { phoneStatus, client, conversation } = this.state;
    // console.log(phoneStatus);
    const { icon, ...fabOptions } = this.fabs[phoneStatus];
    return (
      <Fragment>
        {phoneStatus === 'calling' && <CustomerConversationInfo client={client} conversation={conversation} />}
        <Zoom in={true} timeout={500}>
          <Fab
            id="conversation-window-fab"
            ref={this.fabRef}
            size="small"
            variant="extended"
            onClick={this.onFabClick}
            {...fabOptions}
          >
            {this.fabs[phoneStatus].icon}
            {'[123]'}
            {phoneStatus === PHONE_STATUS.INCOMMING_ACTIVE ||
              (phoneStatus === PHONE_STATUS.OUTGOING_ACTIVE && (
                <Fragment>
                  <CustomerContactVew />
                  <TimeCounter />
                </Fragment>
              ))}
          </Fab>
        </Zoom>
      </Fragment>
    );
  }

  render2() {
    const { conversation, client } = this.state;
    if (conversation) {
      const { data: record } = conversation;
      if (record.status !== 'INPROGRESS') return null;
      return (
        <Paper style={{ position: 'fixed', width: 300, height: 200, bottom: 5, right: 20 }}>
          <AppBar position="static">
            <Toolbar variant="dense">
              <CallingIcon />
              <Typography variant="h6" color="inherit">
                {record.data.phoneNumber}
              </Typography>
            </Toolbar>
          </AppBar>
          <Card>
            <CardContent>
              {client ? (
                <div>
                  <p>{client.name}</p>
                  <Link to={`/clients/${client.id}`}>info</Link>
                </div>
              ) : (
                'Unknown Number'
              )}
            </CardContent>
          </Card>
          {JSON.stringify(conversation)}
        </Paper>
      );
    }
    return null;
  }
}

ConversationWindow.propTypes = {
  dataProvider: PropTypes.func,
  conversation: PropTypes.object,
  conversationUpdate: PropTypes.func,
  classes: PropTypes.object,
};

const mapStateToProps = state => ({
  conversation: state.conversation,
});

const mapActions = {
  conversationUpdate: conversationUpdateAction,
};

const ConversationWindowEnhance = compose(
  withDataProvider,
  withStyles(styles),
  connect(mapStateToProps, mapActions),
)(ConversationWindow);

export default ConversationWindowEnhance;
