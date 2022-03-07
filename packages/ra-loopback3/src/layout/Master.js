import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Admin, Resource } from 'react-admin';
import { get, set, uniq } from 'lodash';
import ReactGA from 'react-ga';
import JssProvider from 'react-jss/lib/JssProvider';
import '../style/transition.css';
import '../style/common.css';
import numeral from 'numeral';
import numeralVi from 'numeral/locales/vi';
import numeralEn from 'numeral/locales/en-au';
import momentVi from 'moment/locale/vi';
import momentEn from 'moment/locale/en-au';
import moment from 'moment-timezone';
import customUndo from '../sideEffect/customUndo';
import customPage from '../sideEffect/customPage';
import CommonProviderContext from '../data/CommonProviderContext';
import reducers from '../reducers';
import PageShell from './PageShell';
import Menu from './Menu';
import generateClassName from './generateClassName';
import CustomLoginPage from './CustomLoginPage';
import { Storage } from '../data/Storage';
const sanitizeRest = (props, url) => {
  const { ga, ...rest } = props;
  if (url && !rest.basePath) {
    rest.basePath = `/${url}`;
  }
  return rest;
};

class Master extends Component {
  static propTypes = {
    customSagas: PropTypes.array,
    menuConfig: PropTypes.object,
    resources: PropTypes.array,
    customRoutes: PropTypes.array,
    transition: PropTypes.object,
    customReducers: PropTypes.object,
    ga: PropTypes.object,
    locale: PropTypes.any, // not use, user profile or browser's location instead
    notifyBage: PropTypes.any,
    project: PropTypes.string,
    showToClient: PropTypes.any,
    loginPage: PropTypes.any,
  };
  state = {
    loading: true,
    locale: 'vi',
  };

  static defaultProps = {
    ga: { id: 'UA-120553426-1' },
    debug: false,
  };

  getLocale = async () => {
    const user = Storage.getUser();
    let locale = 'vi';
    if (user) {
      locale = get(user, 'language', 'vi');
    }
    // toannt
    // hard code
    let timeZone = 'Asia/Ho_Chi_Minh';
    moment.tz.setDefault(timeZone);
    moment.locale(locale);
    // if (user && user.locale) {
    //   locale = user.locale;
    // } else {
    //   try {
    //     const locationInfo = await fetch('http://ip-api.com/json');
    //     if (locationInfo.status === 200) {
    //       const locationInfoData = await locationInfo.json();
    //       locale = locationInfoData.countryCode === 'VN' ? 'vi' : 'en';
    //     }
    //   } catch (e) {
    //     //
    //   }
    // }

    return locale;
  };

  async componentDidMount() {
    let navigator = window.navigator;
    if (navigator && navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
          if (registration && registration.unregister) {
            registration.unregister();
          }
        }
      });
    }
    // update menu data
    let { menuConfig, resources = [], customRoutes = [], transition = {}, ga } = this.props;
    // init GA
    if (ga && ga.id) {
      ReactGA.initialize(ga.id, { debug: ga.debug });
    }
    let stack = menuConfig.menu.map((item, index) => ({ item, parent: '', path: `[${index}]` }));
    const accessMap = {};
    while (stack.length > 0) {
      let { item, path, parent } = stack.pop();
      if (item.menu && item.menu.length > 0) {
        item.menu.map((subItem, index) => {
          stack.push({ item: subItem, parent: path, path: path + `[${index}]` });
        });
      } else {
        // check custome
        const { screens, resources: itemResources, url, name, access = {} } = item;
        if (screens) {
          accessMap[name] = access;
          let screenKeys = Object.keys(screens);
          let props = {};
          props.hasList = screens.list || screens.main ? true : false;
          props.hasEdit = screens.edit ? true : false;
          props.hasShow = screens.show ? true : false;
          props.hasCreate = screens.create ? true : false;

          if (itemResources) {
            if (typeof itemResources === 'string') {
              props.resource = resources;
              resources.push(itemResources);
            } else {
              props.resource = resources[0];
              resources = resources.concat(itemResources);
            }
            props.resource = typeof resources === 'string' ? resources : itemResources[0];
          }

          screenKeys.map(screenKey => {
            customRoutes.push(this.getRoute(transition, item, screenKey, props));
          });
        }

        if (parent) {
          // add dict to menu
          set(menuConfig.menu, `${parent}.sub['/${url}']`, true);
        }
      }
    }
    resources = uniq(resources);

    const fixResources = resources.map(resource => <Resource key={resource} name={resource} />);
    // ad temp
    fixResources.push(<Resource key={'temps'} name={'temps'} />);

    // update locale
    // user
    let locale = await this.getLocale();

    if (locale === 'vi') {
      // numeral.register('locale', locale, numeralVi);
      numeral.locale(locale, numeralVi);
      moment.updateLocale(locale, momentVi);
    } else {
      // numeral.register('locale', locale, numeralEn);
      numeral.locale(locale, numeralEn);
      moment.updateLocale(locale, momentEn);
    }

    this.setState({
      locale,
      loading: false,
      fixCustomRoutes: customRoutes.concat(this.props.customRoutes),
      fixResources,
      fixMenuConfig: { ...menuConfig, accessMap },
    });
  }

  routePath(url, screenKey, screen) {
    let path = typeof screen === 'object' && screen.url ? `/${screen.url}` : `/${url}`;
    switch (screenKey) {
      case 'list':
      case 'main':
        break;
      case 'create':
        path += '/create';
        break;
      case 'edit':
        path += '/:id';
        break;
      case 'show':
        path += '/:id/show';
        break;
      default:
        path += `/${screenKey}`;
    }
    if (screen.subPath) {
      path += `/${screen.subPath}`;
    }
    return path.replace('//', '/');
  }

  getRoute(transition, item, screenKey, props) {
    const screen = item.screens[screenKey];
    const { screens, url, routeParams = {} } = item;
    let exact = typeof screen.exact === 'boolean' ? screen.exact : true;
    const routePath = this.routePath(url, screenKey, screen);
    return (
      <Route
        key={'page' + routePath}
        exact={exact}
        path={routePath}
        component={PageShell(item, screens, screen, sanitizeRest(props, url))}
        {...routeParams}
      />
    );
  }

  renderResources() {}

  render() {
    if (this.state.loading) {
      return (
        <div className="loader-container">
          <div className="loader">Loading...</div>
        </div>
      );
    }
    const {
      resources,
      customRoutes,
      customSagas = [],
      menuConfig,
      transition,
      ga,
      notifyBage,
      customReducers,
      project,
      showToClient,
      loginPage,
      ...rest
    } = this.props;
    const { fixCustomRoutes, fixResources, fixMenuConfig, locale } = this.state;
    const adminRender = (
      <Admin
        {...rest}
        locale={locale}
        notifyBage={notifyBage}
        customReducers={{ ...(customReducers || {}), ...reducers }}
        customSagas={[customUndo, customPage, ...customSagas]}
        menu={Menu({ menuConfig: fixMenuConfig, showToClient })}
        customRoutes={fixCustomRoutes}
        loginPage={loginPage ? loginPage : CustomLoginPage}
      >
        {fixResources}
      </Admin>
    );
    const providerValue = {
      dataProvider: rest.dataProvider,
      locales: locale || 'vi',
      menu: fixMenuConfig,
      project: project,
    };
    if (process.env.NODE_ENV === 'development') {
      return <CommonProviderContext.Provider value={providerValue}>{adminRender}</CommonProviderContext.Provider>;
    }
    return (
      <CommonProviderContext.Provider value={providerValue}>
        <JssProvider generateClassName={generateClassName}>{adminRender}</JssProvider>
      </CommonProviderContext.Provider>
    );
  }
}

export default Master;
