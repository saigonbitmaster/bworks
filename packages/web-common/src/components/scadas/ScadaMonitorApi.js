import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { debounce } from 'lodash';
import { LinearProgress, withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import { yellow, orange, green, red } from '@material-ui/core/colors';

const uri = 'api/iotdevices/scadaDebug';

const statusMapping = {
  idle: yellow[500],
  connecting: orange[500],
  connected: green[500],
  error: red[500],
};
class ScadaMonitorApi extends Component {
  static propTypes = {
    onApiStatusChange: PropTypes.func,
    onApiData: PropTypes.func,
    retryOnError: PropTypes.bool,
    deviceConfig: PropTypes.object,
    apiStatus: PropTypes.string,
    classes: PropTypes.object,
  };

  state = {
    data: {},
  };

  componentDidMount() {
    if (this.props.deviceConfig) {
      this.callApi();
    }
  }

  getUrl = organization => {
    if (organization) {
      if (organization.indexOf('http') === 0) {
        return `${organization}/${uri}`;
      }
      if (organization.indexOf('waterlink') > 0 || organization.indexOf('Bworks') > 0) {
        return `https://${organization}/${uri}`;
      }
      const orgSplit = organization.split('.');
      if (orgSplit.length > 3 && typeof orgSplit[1] !== 'number') {
        return `http://${organization}/${uri}`;
      }
      return `https://${organization}.Bworks.io/${uri}`;
    }
    return `http://localhost:4001/${uri}`;
  };

  componentDidUpdate(preProps) {
    if (!preProps.deviceConfig && this.props.deviceConfig) {
      this.callApi();
    }
  }

  getDeviceConfig = () => {
    const { deviceConfig } = this.props;
    const { organization, key, secret } = deviceConfig;
    if (!organization) return null;
    if (!key) return null;
    if (!secret) return null;
    return { organization, key, secret };
  };

  callApi = async () => {
    const deviceConfig = this.getDeviceConfig();
    if (!deviceConfig) return;
    // eslint-disable-next-line no-underscore-dangle
    const __this = this;
    const { key, secret, organization } = deviceConfig;
    const { onApiStatusChange, onApiData } = this.props;
    let status = 'connecting';
    this.stopApi();
    onApiStatusChange(status);
    const url = this.getUrl(organization);
    this.eventSource = new EventSourcePolyfill(url, {
      headers: { 'x-device-key': key, 'x-device-secret': secret },
      heartbeatTimeout: 300000, // 5 minutes else 45 seconds by default, it initiates another request
    });
    this.eventSource.addEventListener('data', msg => {
      if (msg.data) {
        const data = JSON.parse(msg.data);
        onApiData(data);
        if (status !== 'connected') {
          status = 'connected';
          onApiStatusChange(status);
        }
      }
    });
    this.eventSource.addEventListener('close', () => {
      // console.log('CLOSE');
      __this.stopApi();
    });
    this.eventSource.onerror = function(e) {
      console.error('EventSource failed.', e);
      __this.stopApi('error');
    };
  };

  stopApi = (status = 'idle') => {
    // console.log('STOP');
    const { onApiStatusChange, retryOnError } = this.props;
    if (this.eventSource && this.eventSource.close) {
      this.eventSource.close();
      this.eventSource = null;
      onApiStatusChange(status);
    }
    if (status === 'error' && retryOnError) {
      this.retry();
    }
  };

  retry = debounce(this.callApi, 3000);

  componentWillUnmount() {
    this.stopApi();
  }

  render() {
    const { classes, apiStatus } = this.props;
    return (
      <LinearProgress
        className={classes.root}
        style={{ backgroundColor: statusMapping[apiStatus] }}
        variant={apiStatus === 'connecting' ? 'indeterminate' : 'determinate'}
        value={0}
      />
    );
  }
}

const styles = theme => ({
  root: {
    zIndex: theme.zIndex.drawer + 101,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default compose(withStyles(styles))(ScadaMonitorApi);
