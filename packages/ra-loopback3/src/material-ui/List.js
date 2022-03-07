/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import DefaultPagination from 'ra-ui-materialui/lib/list/Pagination';
import defaultTheme from 'ra-ui-materialui/lib/defaultTheme';
import Header from '../layout/Header';
import ListController from '../ra-core/ListController';
import Title from './Title';
import BulkActionsToolbar from './BulkActionsToolbar';
import DefaultActions from './ListActions';
import DefaultBulkActionButtons from './BulkDeleteButton';

const styles = {
  root: {
    position: 'relative',
  },
  paper: {},
  actions: {},
  header: {},
  noResults: { padding: 20 },
};

const injectedProps = [
  'basePath',
  'currentSort',
  'data',
  'defaultTitle',
  'displayedFilters',
  'filterValues',
  'hasCreate',
  'hideFilter',
  'ids',
  'isLoading',
  'onSelect',
  'onToggleItem',
  'onUnselectItems',
  'page',
  'perPage',
  'refresh',
  'resource',
  'selectedIds',
  'setFilters',
  'setPage',
  'setPerPage',
  'setSort',
  'showFilter',
  'total',
  'translate',
  'version',
];
const getListControllerProps = props => injectedProps.reduce((acc, key) => ({ ...acc, [key]: props[key] }), {});

const sanitizeRestProps = ({
  children: rawChildren,
  classes,
  className,
  filters,
  pagination,
  actions,
  resource,
  hasCreate,
  hasEdit,
  hasList,
  hasShow,
  filter,
  filterDefaultValues,
  filterValues,
  crudGetList,
  changeListParams,
  perPage,
  title,
  data,
  ids,
  total,
  isLoading,
  translate,
  version,
  push,
  history,
  locale,
  location,
  match,
  options,
  params,
  permissions,
  query: q,
  selectedIds,
  setSelectedIds,
  sort,
  theme,
  toggleItem,
  sub,
  refController,
  fixUrl,
  hideHeader,
  ...rest
}) => rest;

export const ListView = props => {
  const {
    actions: rawAction,
    basePath,
    bulkActions,
    bulkActionButtons: rawBulkActionButtons,
    children: rawChildren,
    className,
    classes = {},
    currentSort,
    data,
    defaultTitle,
    displayedFilters,
    filters,
    filterValues,
    hasCreate,
    hideFilter,
    ids,
    isLoading,
    onSelect,
    onToggleItem,
    onUnselectItems,
    page,
    pagination = <DefaultPagination />,
    perPage,
    refresh,
    resource,
    selectedIds,
    setFilters,
    setPage,
    setPerPage,
    setSort,
    showFilter,
    title,
    total,
    translate,
    version,
    sub,
    submitButton,
    subTitle,
    refFilter,
    extActions,
    permissionCreateDefault,
    permissionDeleteDefault,
    dataProvider,
    displayOrdinalNumber,
    rootModel,
    sourcesAndTranslations,
    exportExcelPermission,
    fixUrl,
    templateKey,
    customFilter,
    disableExportExcel,
    hideHeader,
    ...rest
  } = props;
  const titleElement = <Title title={title} defaultTitle={defaultTitle} />;
  // console.log('list: ', actions, bulkActionButtons);
  // eslint-disable-next-line no-console
  // eslint-disable-next-line no-console
  // console.log(props);
  let actions = rawAction;
  if (actions === undefined) {
    actions = (
      <DefaultActions
        permission={permissionCreateDefault}
        {...{
          sourcesAndTranslations,
          rootModel,
          exportExcelPermission,
          templateKey,
          currentQuery: customFilter
            ? customFilter
            : {
                where: filterValues,
                order: `${currentSort['field']} ${currentSort['order']}`,
              },
          fixUrl,
          disableExportExcel,
        }}
      />
    );
  }
  let bulkActionButtons = rawBulkActionButtons;
  if (bulkActionButtons === undefined) {
    bulkActionButtons = <DefaultBulkActionButtons permission={permissionDeleteDefault} />;
  }
  let children = rawChildren;
  if (displayOrdinalNumber && children) {
    children = {
      ...children,
      props: { children: [<OrdinalNumberField key="-1" label="STT" source="ra_index" />, ...children.props.children] },
    };
  }
  // eslint-disable-next-line no-console
  return (
    <div className={classnames('list-page', classes.root, className)} {...sanitizeRestProps(rest)}>
      <Card className={classes.paper}>
        {bulkActions !== false && bulkActionButtons !== false && bulkActionButtons && !bulkActions && (
          <BulkActionsToolbar
            {...getListControllerProps(rest)}
            data={data}
            selectedIds={selectedIds}
            basePath={basePath}
            filterValues={filterValues}
            resource={resource}
            translate={translate}
          >
            {bulkActionButtons}
          </BulkActionsToolbar>
        )}
        {!hideHeader && (
          <Header
            className={classes.header}
            title={titleElement}
            actions={React.cloneElement(actions, {
              className: classes.actions,
              extActions,
            })}
            actionProps={{
              basePath,
              bulkActions,
              displayedFilters,
              filters,
              refFilter,
              filterValues,
              hasCreate,
              onUnselectItems,
              refresh,
              resource,
              selectedIds,
              showFilter,
            }}
          />
        )}
        {subTitle && subTitle.length > 0 && (
          <CardContent style={styles.noResults}>
            {subTitle.map(item => {
              return (
                <Typography key={item.id} variant="body1">
                  {item.content}
                </Typography>
              );
            })}
          </CardContent>
        )}

        {filters &&
          React.cloneElement(filters, {
            displayedFilters,
            filterValues,
            hideFilter,
            refFilter,
            resource,
            sub,
            submitButton,
            setFilters,
            context: 'form',
          })}
        {isLoading || total > 0 ? (
          <div key={version}>
            {children &&
              React.cloneElement(children, {
                basePath,
                currentSort,
                data,
                hasBulkActions: bulkActions !== false && bulkActionButtons !== false,
                ids,
                isLoading,
                onSelect,
                onToggleItem,
                resource,
                selectedIds,
                setSort,
                version,
              })}
            {!isLoading && !ids.length && (
              <CardContent style={styles.noResults}>
                <Typography variant="body1">
                  {translate('ra.navigation.no_more_results', {
                    page,
                  })}
                </Typography>
              </CardContent>
            )}
            {pagination &&
              React.cloneElement(pagination, {
                setPerPage,
                page,
                perPage,
                setPage,
                total,
              })}
          </div>
        ) : (
          <CardContent className={classes.noResults}>
            <Typography variant="body1">{translate('ra.navigation.no_results')}</Typography>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

ListView.propTypes = {
  actions: PropTypes.element,
  basePath: PropTypes.string,
  bulkActions: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
  bulkActionButtons: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
  children: PropTypes.element,
  className: PropTypes.string,
  classes: PropTypes.object,
  currentSort: PropTypes.shape({
    field: PropTypes.string,
    order: PropTypes.string,
  }),
  data: PropTypes.object,
  defaultTitle: PropTypes.string,
  displayedFilters: PropTypes.object,
  filterDefaultValues: PropTypes.object,
  filters: PropTypes.element,
  filterValues: PropTypes.object,
  hasCreate: PropTypes.bool,
  hideFilter: PropTypes.func,
  ids: PropTypes.array,
  isLoading: PropTypes.bool,
  onSelect: PropTypes.func,
  onToggleItem: PropTypes.func,
  onUnselectItems: PropTypes.func,
  page: PropTypes.number,
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
  perPage: PropTypes.number,
  refresh: PropTypes.func,
  resource: PropTypes.string,
  selectedIds: PropTypes.array,
  setFilters: PropTypes.func,
  setPage: PropTypes.func,
  setSort: PropTypes.func,
  showFilter: PropTypes.func,
  title: PropTypes.any,
  total: PropTypes.number,
  translate: PropTypes.func,
  sub: PropTypes.bool,
  submitButton: PropTypes.element,
  version: PropTypes.number,
  setPerPage: PropTypes.any,
  subTitle: PropTypes.any,
  refFilter: PropTypes.any,
  extActions: PropTypes.any,
  permissionCreateDefault: PropTypes.any,
  permissionDeleteDefault: PropTypes.any,
  dataProvider: PropTypes.func,
  displayOrdinalNumber: PropTypes.any,
  rootModel: PropTypes.any,
  sourcesAndTranslations: PropTypes.any,
  templateKey: PropTypes.string,
  exportExcelPermission: PropTypes.any,
  fixUrl: PropTypes.any,
  customFilter: PropTypes.any,
  disableExportExcel: PropTypes.any,
  local: PropTypes.any,
  hideHeader: PropTypes.bool,
};

ListView.defaultProps = {
  filter: {},
  perPage: 25,
  theme: defaultTheme,
  subTitle: [],
  displayOrdinalNumber: false,
  hideHeader: false,
};

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
const List = ({ location: fixLocation, fixFilter, onFilterChange, extActions, displayOrdinalNumber, ...props }) => {
  // console.log('list', props);
  if (props.sub) {
    fixLocation.search = '';
  }
  return (
    <ListController {...props} fixFilter={fixFilter} onFilterChange={onFilterChange} location={fixLocation}>
      {({ fixUrl, refController, ...controllerProps }) => (
        <ListView
          {...props}
          displayOrdinalNumber={displayOrdinalNumber}
          extActions={extActions}
          location={fixLocation}
          {...controllerProps}
        />
      )}
    </ListController>
  );
};

List.propTypes = {
  // the props you can change
  actions: PropTypes.element,
  extActions: PropTypes.element,
  bulkActions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  filter: PropTypes.object,
  filterDefaultValues: PropTypes.object,
  filters: PropTypes.element,
  pagination: PropTypes.element,
  perPage: PropTypes.number.isRequired,
  sort: PropTypes.shape({
    field: PropTypes.string,
    order: PropTypes.string,
  }),
  title: PropTypes.any,
  // the props managed by react-admin
  authProvider: PropTypes.func,
  hasCreate: PropTypes.bool.isRequired,
  hasEdit: PropTypes.bool.isRequired,
  hasList: PropTypes.bool.isRequired,
  hasShow: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  path: PropTypes.string,
  resource: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  sub: PropTypes.bool,
  fixUrl: PropTypes.string,
  fixFilter: PropTypes.func,
  onFilterChange: PropTypes.func,
  refController: PropTypes.any,
  subTitle: PropTypes.array,
  displayOrdinalNumber: PropTypes.bool,
};

List.defaultProps = {
  filter: {},
  perPage: 25,
  theme: defaultTheme,
  subTitle: [],
  displayOrdinalNumber: false,
};

const OrdinalNumberField = ({ record = {} }) => <span>{record['ra_index']}</span>;

OrdinalNumberField.propTypes = {
  record: PropTypes.object,
};

export default withStyles(styles)(List);
