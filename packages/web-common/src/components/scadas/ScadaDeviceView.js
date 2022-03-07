import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ScadaView from './ScadaView';
import Skeleton from '@material-ui/lab/Skeleton';
import { compose } from 'recompose';
import { withDataProvider, GET_ONE, CUSTOM } from 'ra-loopback3';
import { LinearProgress } from '@material-ui/core';
import { get } from 'lodash';
import ScadaMonitorApi from './ScadaMonitorApi';

class ScadaDeviceView extends Component {
  static propTypes = {
    id: PropTypes.string,
    dataProvider: PropTypes.func,
  };
  refView = React.createRef();

  state = { loading: true, device: null, error: '', deviceConfig: null, apiStatus: 'idle' };

  async componentDidMount() {
    const { dataProvider, id } = this.props;
    const res = await dataProvider(GET_ONE, 'iotdevices', { id });
    this.setState({ loading: false, device: res.data });
  }

  onViewReady = () => {
    const { device } = this.state;
    const deviceConfig = {
      organization: window.location.origin,
      key: device.id,
      secret: device.secrets[0],
    };
    this.setState({ deviceConfig });
  };

  viewData = async () => {
    const { device } = this.state;
    const { dataProvider } = this.props;
    const jsonFile = get(device, 'meta.canvas[0].url', null);
    if (jsonFile) {
      const fileName = jsonFile.split(/(\\|\/)/g).pop();
      let res = await dataProvider(CUSTOM, 'nmsfiles', { subUrl: `download/${encodeURIComponent(fileName)}` });
      if (res.data) {
        return res.data;
      }
    }
    return [];
  };

  onChangeData = data => {
    this.refView.current.onData(data);
  };

  render() {
    const { device, loading, deviceConfig, apiStatus } = this.state;
    return (
      <Fragment>
        {loading && (
          <Fragment>
            <LinearProgress />
            <Skeleton variant="rect" width={'100%'} height={400} />
          </Fragment>
        )}
        {device && (
          <ScadaView ref={this.refView} onViewReady={this.onViewReady} viewData={this.viewData}>
            {deviceConfig && (
              <ScadaMonitorApi
                deviceConfig={deviceConfig}
                onApiData={this.onChangeData}
                onApiStatusChange={newStatus => this.setState({ apiStatus: newStatus })}
                retryOnError
                apiStatus={apiStatus}
              />
            )}
          </ScadaView>
        )}
      </Fragment>
    );
  }
}

export default compose(withDataProvider)(ScadaDeviceView);
