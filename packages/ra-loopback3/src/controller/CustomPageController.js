import React, { Component, Children } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-admin';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { push as pushActions } from 'react-router-redux';
import { withRouter } from 'react-router-dom';
import { SORT_DESC } from 'ra-core/lib/reducer/admin/resource/list/queryReducer';
import { debounce, isEqual, isEmpty } from 'lodash';
import removeEmpty from 'ra-core/lib/util/removeEmpty';
import queryString, { stringify } from 'query-string';
import {
  checkRegister as checkRegisterActions,
  sendParams as sendParamsActions,
  customPageSetState as customPageSetStateActions,
} from '../actions/customPageActions';
@translate
class CustomPageController extends Component {
  state = {};
  static propTypes = {
    // xsmall: PropTypes.element,
    // small: PropTypes.element,
    // medium: PropTypes.element,
    // large: PropTypes.element,
    title: PropTypes.string,
    children: PropTypes.any,
    rawTitle: PropTypes.string,
    translate: PropTypes.func,
    className: PropTypes.any,
    actions: PropTypes.element,
    card: PropTypes.bool,
    header: PropTypes.bool,
    filterDefaultValues: PropTypes.object,
    query: PropTypes.object,
    debounce: PropTypes.number,
    location: PropTypes.object,
    sort: PropTypes.shape({
      field: PropTypes.string,
      order: PropTypes.string,
    }),
    screen: PropTypes.string,
    perPage: PropTypes.number,
    filterValues: PropTypes.object,
    changeListParams: PropTypes.func,
    push: PropTypes.func,
    params: PropTypes.object,
    sub: PropTypes.bool,
    sendParams: PropTypes.func,
    checkRegister: PropTypes.func,
    filter: PropTypes.object,
    fixFilter: PropTypes.any,
    history: PropTypes.object,
    maxColumns: PropTypes.number,
    maxRows: PropTypes.number,
    subState: PropTypes.object,
    customPageSetState: PropTypes.func,
    state: PropTypes.object,
    hasFilter: PropTypes.bool,
    hasState: PropTypes.bool,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { params, state } = this.props;
    // console.log('UNSAFE_componentWillReceiveProps', nextProps.filter);
    if (nextProps.filter && !isEqual(nextProps.filter, params.filter)) {
      this.updateFilter(this.wrappingParams(nextProps.filter));
    }
    if (!isEqual(nextProps.state, state)) {
      this.updateState(nextProps.state);
    }
  }

  getParams() {
    const { params: paramsFromProps = {} } = this.props;
    const params = Object.keys(paramsFromProps).length > 0 ? paramsFromProps : { ...this.props.params };
    const filterDefaultValues = this.props.filter || {};
    params.filter = { ...filterDefaultValues, ...params.filter };

    if (!params.sort) {
      params.sort = this.props.sort.field;
      params.order = this.props.sort.order;
    }
    if (!params.perPage) {
      params.perPage = this.props.perPage;
    }
    if (!params.page) {
      params.page = 1;
    }
    return params;
  }

  componentDidMount() {
    const { params, hasFilter, state, hasState } = this.props;
    if (hasFilter) {
      this.updateFilter(params);
    }
    if (hasState) {
      this.updateState(state);
    }
  }

  updateFilter = (params = {}) => {
    const { sendParams, screen } = this.props;
    const { filter } = params;
    sendParams(screen, params);
    this.setFilters(filter);
  };

  debounceFilter = debounce(() => {
    this.updateFilter();
  }, 100);

  setDefaultFilter = () => {
    const {
      location: { search },
      params,
    } = this.props;
    const { filter: filterFromStore } = params;
    if (search && search.length !== 0) {
      return JSON.parse(queryString.parse(search).filter);
    } else if (filterFromStore && !isEmpty(filterFromStore)) {
      return filterFromStore;
    } else {
      const { filter } = this.props;
      return filter;
    }
  };

  setFilters = debounce(filters => {
    const { sub, push } = this.props;
    const filtersWithoutEmpty = removeEmpty(filters);
    if (!sub) {
      push({
        search: `?${stringify({
          filter: JSON.stringify(filtersWithoutEmpty),
        })}`,
      });
    }
  }, 500);

  updateState = state => {
    const { screen, customPageSetState } = this.props;
    customPageSetState(screen, state);
    this.setURLState(state);
  };

  setURLState = state => {
    const { sub, push } = this.props;
    const stateWithoutEmpty = removeEmpty(state);
    if (!sub) {
      push({
        search: `?${stringify({
          state: JSON.stringify(stateWithoutEmpty),
        })}`,
      });
    }
  };

  debounceSubState = debounce(state => {
    this.updateState(state);
  }, 500);

  getCurrentFilter = query => {
    const params = query || this.getQuery();
    const { filter } = params;
    const permanentFilter = this.props.filter;
    let finalFilter = { ...filter, ...permanentFilter };
    if (this.props.fixFilter) {
      finalFilter = this.props.fixFilter(finalFilter);
    }
    return finalFilter;
  };

  wrappingParams = filter => {
    const { params } = this.props;
    return {
      ...params,
      filter,
    };
  };

  // setSort = sort => this.changeParams({ type: SET_SORT, payload: sort });

  // setPage = page => this.changeParams({ type: SET_PAGE, payload: page });

  componentWillUnmount() {
    this.debounceFilter.cancel();
    this.setFilters.cancel();
    this.debounceSubState.cancel();
  }

  render() {
    const { children, hasFilter } = this.props;
    if (hasFilter) {
      return Children.map(children, element => {
        if (!React.isValidElement(element)) return;
        return React.cloneElement(element, {
          setFilters: this.setFilters,
          defaultValue: this.setDefaultFilter(),
        });
      });
    }
    return children;
  }
}
CustomPageController.defaultProps = {
  debounce: 500,
  hasFilter: false,
  hasState: false,
  filterValues: {},
  perPage: 10,
  sort: {
    field: 'id',
    order: SORT_DESC,
  },
  params: {
    sort: null,
    order: null,
    page: 1,
    perPage: null,
    filter: {},
  },
  // state: {},
};

const mapStateToProps = (state, props) => {
  const screenState = state.customPage[props.screen];
  if (!screenState) return;
  return {
    params: screenState.params,
    // stateFromStore: screenState.state,
  };
};

const mapDispatchToProps = dispatch => ({
  sendParams: (screen, params) => dispatch(sendParamsActions(screen, params)),
  checkRegister: screen => dispatch(checkRegisterActions(screen)),
  push: location => dispatch(pushActions(location)),
  customPageSetState: (screen, state) => dispatch(customPageSetStateActions(screen, state)),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  // translate,
)(CustomPageController);
