import React, { Component } from 'react';
import { CustomLoginPage } from 'web-common';
import Geocode from 'react-geocode';
import { hot } from 'react-hot-loader';
import { AuthProvider, Master, Title, LoopbackRest } from 'ra-loopback3';
import moment from 'moment-timezone';
import momentvi from 'moment/locale/vi';
import i18n from './i18n';
import menuConfig from './menu';
import CustomRoutes from './CustomRoutes';
import reducers from './reducers';
import Resources from './menu/Resources';
import config from './Config';
import customRest from './menu/customRest';
import Layout from './Layout';
const NODE_DEFAULT_LANGUAGE = process.env.NODE_DEFAULT_LANGUAGE || 'en';

class App extends Component {
  state = { ready: false };
  constructor(props) {
    super(props);
    Geocode.setApiKey(config.mapApiKey);
    moment.updateLocale('vi', momentvi);
  }
  componentDidMount() {
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
        loginPage={CustomLoginPage}
        locale={NODE_DEFAULT_LANGUAGE}
        title={<Title defaultTitle={'bWorks'} title={'generic.appName'} />}
        dataProvider={LoopbackRest('/api', customRest)}
        appLayout={Layout}
        menuConfig={menuConfig}
        authProvider={AuthProvider('/api/appusers/login')}
        i18nProvider={i18n}
        resources={Resources}
        customReducers={reducers}
        customRoutes={CustomRoutes}
        ga={{ id: config.gaId, debug: false }}
      />
    );
  }
}

export default hot(module)(App);
