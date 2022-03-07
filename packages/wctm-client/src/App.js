import React, { Component } from 'react';
// import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import Geocode from 'react-geocode';
import { hot } from 'react-hot-loader';
import { AuthProvider, Master, Title, LoopbackRest } from 'ra-loopback3';
import moment from 'moment-timezone';
import momentvi from 'moment/locale/vi';
import i18n from './i18n';
import menuConfig from './menu';
import CustomRoutes from './CustomRoutes';
import reducers from './reducers';
import Layout from './Layout';
import Resources from './menu/Resources';
import config from './Config';
import customRest from './menu/customRest';
import LoginPage from './resources/login/LoginPage';
const NODE_DEFAULT_LANGUAGE = process.env.NODE_DEFAULT_LANGUAGE || 'vi';

class App extends Component {
  state = { ready: false };
  constructor(props) {
    super(props);
    Geocode.setApiKey(config.mapApiKey);
    moment.updateLocale('vi', momentvi);
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
        locale={NODE_DEFAULT_LANGUAGE}
        title={<Title defaultTitle={'For job seeker'} title={'generic.appName'} />}
        dataProvider={LoopbackRest('/api', customRest)}
        appLayout={Layout}
        menuConfig={menuConfig}
        authProvider={AuthProvider('/api/clientusers/login')}
        i18nProvider={i18n}
        resources={Resources}
        customReducers={reducers}
        customRoutes={CustomRoutes}
        loginPage={LoginPage}
        ga={{ id: config.gaId, debug: false }}
        showToClient={true}
      />
    );
  }
}

export default hot(module)(App);
