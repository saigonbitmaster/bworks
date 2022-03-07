/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { parse, stringify } from 'query-string';
import { push as pushAction } from 'react-router-redux';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import inflection from 'inflection';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import pickBy from 'lodash/pickBy';

import removeEmpty from 'ra-core/lib/util/removeEmpty';
import queryReducer, {
  SET_SORT,
  SET_PAGE,
  SET_FILTER,
  SORT_DESC,
  SET_PER_PAGE,
} from 'ra-core/lib/reducer/admin/resource/list/queryReducer';
import { crudGetList as crudGetListAction } from 'ra-core/lib/actions/dataActions';
import {
  changeListParams as changeListParamsAction,
  setListSelectedIds as setListSelectedIdsAction,
  toggleListItem as toggleListItemAction,
} from 'ra-core/lib/actions/listActions';
import { translate } from 'react-admin';
import removeKey from 'ra-core/lib/util/removeKey';

/**
 * List page component
 *
 * The <List> component renders the list layout (title, buttons, filters, pagination),
 * and fetches the list of records from the REST API.
 * It then delegates the rendering of the list of records to its child component.
 * Usually, it's a <Datagrid>, responsible for displaying a table with one row for each post.
 *
 * In Redux terms, <List> is a connected component, and <Datagrid> is a dumb component.
 *
 * Props:
 *   - title
 *   - perPage
 *   - sort
 *   - filter (the permanent filter to apply to the query)
 *   - actions
 *   - filters (a React Element used to display the filter form)
 *   - pagination
 *
 * @example
 *     const PostFilter = (props) => (
 *         <Filter {...props}>
 *             <TextInput label="Search" source="q" alwaysOn />
 *             <TextInput label="Title" source="title" />
 *         </Filter>
 *     );
 *     export const PostList = (props) => (
 *         <List {...props}
 *             title="List of posts"
 *             sort={{ field: 'published_at' }}
 *             filter={{ is_published: true }}
 *             filters={<PostFilter />}
 *         >
 *             <Datagrid>
 *                 <TextField source="id" />
 *                 <TextField source="title" />
 *                 <EditButton />
 *             </Datagrid>
 *         </List>
 *     );
 */
export class ListController extends Component {
  constructor(props) {
    super(props);
    const { resetOnInit = false } = props;
    this.state = { ready: !resetOnInit };
    if (resetOnInit) {
      this.updateData({ filter: { $reset: true } });
    }
  }

  componentDidMount() {
    if (this.props.refController) {
      this.props.refController.current = this;
    }
    const { ready } = this.state;
    if (!ready) {
      this.setState({ ready: true });
    }
    if (
      !this.props.query.page &&
      !(this.props.ids || []).length &&
      this.props.params.page > 1 &&
      this.props.total > 0
    ) {
      this.setPage(this.props.params.page - 1);
      return;
    }

    this.updateData();
    if (Object.keys(this.props.query).length > 0) {
      this.props.changeListParams(this.props.resource, this.props.query);
    }
    if (this.props.refController) {
      this.props.refController.current = this;
    }
  }

  componentWillUnmount() {
    this.setFilters.cancel();
    this.updateFilter.cancel();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.sub) {
      if (
        nextProps.resource !== this.props.resource ||
        nextProps.params.sort !== this.props.params.sort ||
        nextProps.params.order !== this.props.params.order ||
        nextProps.params.page !== this.props.params.page ||
        nextProps.query.perPage !== this.props.query.perPage ||
        !isEqual(nextProps.query.filter, this.props.query.filter) ||
        !isEqual(nextProps.filter, this.props.filter) ||
        !isEqual(nextProps.sort, this.props.sort) ||
        !isEqual(nextProps.perPage, this.props.perPage)
      ) {
        this.updateData(nextProps.params);
      }
    } else {
      if (
        nextProps.resource !== this.props.resource ||
        nextProps.query.sort !== this.props.query.sort ||
        nextProps.query.order !== this.props.query.order ||
        nextProps.query.page !== this.props.query.page ||
        nextProps.query.filter !== this.props.query.filter
      ) {
        this.updateData(Object.keys(nextProps.query).length > 0 ? nextProps.query : nextProps.params);
      }
    }
    if (nextProps.version !== this.props.version) {
      this.updateData();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.translate === this.props.translate &&
      nextProps.isLoading === this.props.isLoading &&
      nextProps.version === this.props.version &&
      nextState === this.state &&
      nextProps.data === this.props.data &&
      nextProps.selectedIds === this.props.selectedIds
    ) {
      return false;
    }
    return true;
  }

  getBasePath() {
    return this.props.location.pathname.replace(/\/$/, '');
  }

  /**
   * Merge list params from 4 different sources:
   *   - the query string
   *   - the params stored in the state (from previous navigation)
   *   - the filter defaultValues
   *   - the props passed to the List component
   */
  getQuery() {
    const query = Object.keys(this.props.query).length > 0 ? this.props.query : { ...this.props.params };
    const filterDefaultValues = this.props.filterDefaultValues || {};
    query.filter = { ...filterDefaultValues, ...query.filter };

    if (!query.sort) {
      query.sort = this.props.sort.field;
      query.order = this.props.sort.order;
    }
    if (!query.perPage) {
      query.perPage = this.props.perPage;
    }
    if (!query.page) {
      query.page = 1;
    }
    return query;
  }

  updateData(query) {
    const params = query || this.getQuery();
    const { sort, order, page = 1, perPage } = params;
    const pagination = {
      page: parseInt(page, 10),
      perPage: parseInt(perPage, 10),
    };
    // const permanentFilter = this.props.filter;
    // let $fixUrl = this.props.fixUrl;
    // let finalFilter = { ...filter, ...permanentFilter, $fixUrl };
    // if (this.props.fixFilter) {
    //   finalFilter = this.props.fixFilter(finalFilter);
    // }
    const finalFilter = this.getCurrentFilter(query);
    this.props.onFilterChange && this.props.onFilterChange(finalFilter);
    this.props.crudGetList(this.props.resource, pagination, { field: sort, order }, finalFilter);
  }

  getCurrentFilter = query => {
    const params = query || this.getQuery();
    const { fields } = this.props;
    const { filter } = params;
    const permanentFilter = this.props.filter;
    let $fixUrl = this.props.fixUrl;
    let finalFilter = { ...filter, ...permanentFilter, $fixUrl };
    if (this.props.fixFilter) {
      finalFilter = this.props.fixFilter(finalFilter);
    }
    if (fields) {
      finalFilter.$fields = fields;
    }
    return finalFilter;
  };

  updateFilter = debounce(() => {
    this.updateData();
  }, 100);

  setSort = sort => this.changeParams({ type: SET_SORT, payload: sort });

  setPage = page => this.changeParams({ type: SET_PAGE, payload: page });

  setFilters = debounce(filters => {
    if (isEqual(filters, this.props.filterValues)) {
      return;
    }

    // fix for redux-form bug with onChange and enableReinitialize
    const filtersWithoutEmpty = removeEmpty(filters);
    this.changeParams({ type: SET_FILTER, payload: filtersWithoutEmpty });
  }, this.props.debounce);

  showFilter = (filterName, defaultValue) => {
    this.setState({ [filterName]: true });
    if (typeof defaultValue !== 'undefined') {
      this.setFilters({
        ...this.props.filterValues,
        [filterName]: defaultValue,
      });
    }
  };

  hideFilter = filterName => {
    this.setState({ [filterName]: false });
    const newFilters = removeKey(this.props.filterValues, filterName);
    this.setFilters(newFilters);
  };

  handleSelect = ids => {
    this.props.setSelectedIds(this.props.resource, ids);
  };

  handleUnselectItems = () => {
    this.props.setSelectedIds(this.props.resource, []);
  };

  handleToggleItem = id => {
    this.props.toggleItem(this.props.resource, id);
  };

  setPerPage = perPage => this.changeParams({ type: SET_PER_PAGE, payload: perPage });

  changeParams(action) {
    const newParams = queryReducer(this.getQuery(), action);
    if (!this.props.sub) {
      this.props.push({
        ...this.props.location,
        search: `?${stringify({
          ...newParams,
          filter: JSON.stringify(newParams.filter),
        })}`,
      });
    }
    this.props.changeListParams(this.props.resource, newParams);
    this.handleUnselectItems();
  }

  render() {
    const { ready } = this.state;
    if (!ready) return null;
    const { children, resource, hasCreate, data, ids, total, isLoading, translate, version, selectedIds } = this.props;
    const query = this.getQuery();

    // Add ordinal number to each records within `data`
    const dataWithOrdinalNumber = Object.entries(data)
      .map(([key, value], index) => ({
        [key]: { ...value, ra_index: index + 1 },
      }))
      .reduce((acc, val) => ({ ...acc, ...val }), {});

    const queryFilterValues = query.filter || {};
    const basePath = this.getBasePath();

    const resourceName = translate(`resources.${resource}.name`, {
      smart_count: 2,
      _: inflection.humanize(inflection.pluralize(resource)),
    });
    const defaultTitle = translate('ra.page.list', {
      name: `${resourceName}`,
    });

    return children({
      basePath,
      currentSort: {
        field: query.sort,
        order: query.order,
      },
      data: dataWithOrdinalNumber,
      defaultTitle,
      displayedFilters: this.state,
      filterValues: queryFilterValues,
      hasCreate,
      hideFilter: this.hideFilter,
      ids,
      isLoading,
      onSelect: this.handleSelect,
      onToggleItem: this.handleToggleItem,
      onUnselectItems: this.handleUnselectItems,
      page: parseInt(query.page || 1, 10),
      perPage: parseInt(query.perPage, 10),
      refresh: this.refresh,
      selectedIds,
      setFilters: this.setFilters,
      setPage: this.setPage,
      setSort: this.setSort,
      showFilter: this.showFilter,
      setPerPage: this.setPerPage,
      translate,
      total,
      version,
    });
  }
}

ListController.propTypes = {
  // the props you can change
  refController: PropTypes.any,
  resetOnInit: PropTypes.bool,
  children: PropTypes.func.isRequired,
  filter: PropTypes.object,
  filters: PropTypes.element,
  filterDefaultValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  pagination: PropTypes.element,
  perPage: PropTypes.number.isRequired,
  sort: PropTypes.shape({
    field: PropTypes.string,
    order: PropTypes.string,
  }),
  // the props managed by react-admin
  authProvider: PropTypes.func,
  changeListParams: PropTypes.func.isRequired,
  crudGetList: PropTypes.func.isRequired,
  data: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  debounce: PropTypes.number,
  filterValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  hasCreate: PropTypes.bool.isRequired,
  hasEdit: PropTypes.bool.isRequired,
  hasList: PropTypes.bool.isRequired,
  hasShow: PropTypes.bool.isRequired,
  ids: PropTypes.array,
  selectedIds: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  path: PropTypes.string,
  params: PropTypes.object.isRequired,
  push: PropTypes.func.isRequired,
  query: PropTypes.object.isRequired,
  resource: PropTypes.string.isRequired,
  setSelectedIds: PropTypes.func.isRequired,
  toggleItem: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  translate: PropTypes.func.isRequired,
  sub: PropTypes.bool,
  fixUrl: PropTypes.string,
  fixFilter: PropTypes.func,
  onFilterChange: PropTypes.func,
  version: PropTypes.number,
  fields: PropTypes.object,
};

ListController.defaultProps = {
  debounce: 500,
  filter: {},
  filterValues: {},
  perPage: 10,
  sort: {
    field: 'id',
    order: SORT_DESC,
  },
};

const validQueryParams = ['page', 'perPage', 'sort', 'order', 'filter'];
const getLocationPath = props => props.location.pathname;
const getLocationSearch = props => props.location.search;
const getQuery = createSelector(getLocationPath, getLocationSearch, (path, search) => {
  const query = pickBy(parse(search), (v, k) => validQueryParams.indexOf(k) !== -1);
  if (query.filter && typeof query.filter === 'string') {
    try {
      query.filter = JSON.parse(query.filter);
    } catch (err) {
      delete query.filter;
    }
  }
  return query;
});

function mapStateToProps(state, props) {
  const resourceState = state.admin.resources[props.resource];

  return {
    query: getQuery(props),
    params: resourceState.list.params,
    ids: resourceState.list.ids,
    selectedIds: resourceState.list.selectedIds,
    total: resourceState.list.total,
    data: resourceState.data,
    isLoading: state.admin.loading > 0,
    filterValues: resourceState.list.params.filter,
    version: state.admin.ui.viewVersion,
  };
}

export default compose(
  connect(mapStateToProps, {
    crudGetList: crudGetListAction,
    changeListParams: changeListParamsAction,
    setSelectedIds: setListSelectedIdsAction,
    toggleItem: toggleListItemAction,
    push: pushAction,
  }),
  translate,
)(ListController);
