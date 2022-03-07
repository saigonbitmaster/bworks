import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { CustomPage, withDataProvider, CustomPageController, AuthView } from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import queryString from 'query-string';
import { isEmpty, debounce } from 'lodash';
import TopStatistic from './widget/TopStatistic';
import config from '../../Config';
import MapDashboard from './MapDashboard';
class Main extends React.Component {
  constructor(props) {
    super(props);
    const defaultState = this.getDefaultState();
    const { baseOnFlowLogger: defaultBaseOnFlowLogger } = defaultState;
    this.state = {
      baseOnFlowLogger: defaultBaseOnFlowLogger || false,
      screen: 'dashboard',
      focus: { id: '', type: '', position: '' },
    };
  }

  getDefaultState = () => {
    const {
      location: { search },
      defaultState,
    } = this.props;
    if (search && search.length !== 0) {
      return JSON.parse(queryString.parse(search).state);
    } else if (defaultState && !isEmpty(defaultState)) {
      return defaultState;
    }
    return { baseOnFlowLogger: true };
  };
  onChangeDisPlay = value => {
    this.setState({ baseOnFlowLogger: value });
  };
  onChangeFocus = debounce(val => {
    const { focus } = this.state;
    if (val && val.id && typeof val.id === 'string' && focus.id !== val.id) {
      this.setState({ focus: val });
    } else {
      this.setState({ focus: { id: '', type: '', position: '' } });
    }
  }, 500);
  render() {
    // const { theme } = this.props;
    const { baseOnFlowLogger, screen, focus } = this.state;
    return (
      <CustomPage title={'generic.pages.dashboard'} header={false} screen={screen}>
        <CustomPageController screen={screen} state={{ baseOnFlowLogger, focus }} hasState>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopStatistic />
            </Grid>
            <Grid item xs={12}>
              <AuthView permission={{ name: 'Dashboard', action: 'currentStatus' }} project={config.projectKey}>
                <MapDashboard
                  {...this.props}
                  baseOnFlowLogger={baseOnFlowLogger}
                  focus={focus}
                  onChangeDisPlay={this.onChangeDisPlay}
                  onChangeFocus={this.onChangeFocus}
                />
              </AuthView>
            </Grid>
          </Grid>
        </CustomPageController>
      </CustomPage>
    );
  }
}

Main.propTypes = {
  dataProvider: PropTypes.func.isRequired,
  theme: PropTypes.object,
  defaultState: PropTypes.object,
  location: PropTypes.object,
};

const mapStateToProps = state => {
  const screenState = state.customPage['dashboard'];
  return {
    defaultState: screenState ? screenState.state : null,
  };
};

const enhance = compose(
  connect(mapStateToProps),
  withDataProvider,
  // withTheme,
);

export default enhance(Main);
