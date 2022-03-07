import React, { Component } from 'react';
// import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import Geocode from 'react-geocode';
import { hot } from 'react-hot-loader';
import { AuthProvider, Master, Title, LoopbackRest, layoutWithProps } from 'ra-loopback3';
import i18n from './i18n';
import menuConfig from './menu';
import CustomRoutes from './CustomRoutes';
import reducers from './reducers';
import Resources from './menu/Resources';
import config from './Config';
import customRest from './menu/customRest';
import { AppButton, LoginPage } from 'web-common';
window.API_URL = '/api';
const NODE_DEFAULT_LANGUAGE = process.env.NODE_DEFAULT_LANGUAGE || 'vi';
class App extends Component {
  state = { ready: false };
  constructor(props) {
    super(props);
    Geocode.setApiKey(config.mapApiKey);
  }
  componentDidMount() {
    // if ('serviceWorker' in navigator) {
    //   if (process.env.NODE_ENV === 'production') {
    //     runtime.register();
    //   } else {
    //     // eslint-disable-next-line no-console
    //     console.log('Not register service workers');
    //   }
    // }
    this.setState({ ready: true });
  }
  render() {
    if (!this.state.ready) {
      return (
        <div className="loader-container">
          <div className="loader">Loading...</div>
        </div>
      );
    }
    return (
      <Master
        loginPage={LoginPage}
        locale={NODE_DEFAULT_LANGUAGE}
        title={<Title defaultTitle={'For job seeker'} title={'generic.appName'} />}
        dataProvider={LoopbackRest(window.API_URL, customRest)}
        appLayout={layoutWithProps({ extBar: [{ key: 'apps', component: AppButton }] })}
        menuConfig={menuConfig}
        authProvider={AuthProvider(`${window.API_URL}/appusers/login`)}
        i18nProvider={i18n}
        resources={Resources}
        customReducers={reducers}
        customRoutes={CustomRoutes}
        ga={{ id: config.gaId, debug: false }}
        project={config.projectKey}
      />
    );
  }
}

export default hot(module)(App);
