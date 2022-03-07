import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import CardActions from '@material-ui/core/CardActions';
import { sanitizeListRestProps } from 'react-admin';
// import { CreateButton } from 'ra-ui-materialui/lib/button';
import SFCreateButton from '../layout/SFCreateButton';
import ExportExcelButton from './ExportExcelButton';
const Actions = ({
  bulkActions,
  currentSort,
  className,
  resource,
  filters,
  displayedFilters,
  exporter,
  filterValues,
  hasCreate,
  basePath,
  selectedIds,
  onUnselectItems,
  showFilter,
  refFilter,
  extActions,
  listController,
  sourcesAndTranslations,
  rootModel,
  exportExcelPermission,
  currentQuery,
  fixUrl,
  disableExportExcel,
  templateKey,
  ...rest
}) => (
  <CardActions disableSpacing className={className} {...sanitizeListRestProps(rest)}>
    {bulkActions &&
      cloneElement(bulkActions, {
        basePath,
        filterValues,
        resource,
        selectedIds,
        onUnselectItems,
      })}
    {filters &&
      cloneElement(filters, {
        resource,
        refFilter,
        showFilter,
        displayedFilters,
        filterValues,
        context: 'button',
      })}
    {/* {hasCreate && <CreateButton basePath={basePath} />} => OLD */}
    {hasCreate && <SFCreateButton basePath={basePath} {...rest} />}
    {extActions &&
      cloneElement(extActions, {
        resource,
        refFilter,
        showFilter,
        displayedFilters,
        filterValues,
      })}
    {exportExcelPermission && (
      <ExportExcelButton
        rootModel={rootModel}
        sourcesAndTranslations={sourcesAndTranslations}
        permission={exportExcelPermission}
        currentQuery={currentQuery}
        fixUrl={fixUrl}
        templateKey={templateKey}
        disableExportExcel={disableExportExcel}
      />
    )}
    {/* <ExportButton resource={resource} sort={currentSort} filter={filterValues} exporter={exporter} />
    <RefreshButton /> */}
  </CardActions>
);

Actions.propTypes = {
  bulkActions: PropTypes.node,
  basePath: PropTypes.string,
  className: PropTypes.string,
  currentSort: PropTypes.object,
  displayedFilters: PropTypes.object,
  exporter: PropTypes.func,
  filters: PropTypes.element,
  filterValues: PropTypes.object,
  hasCreate: PropTypes.bool,
  resource: PropTypes.string,
  onUnselectItems: PropTypes.func.isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.any),
  showFilter: PropTypes.func,
  refFilter: PropTypes.any,
  extActions: PropTypes.any,
  listController: PropTypes.any,
  sourcesAndTranslations: PropTypes.any,
  templateKey: PropTypes.string,
  rootModel: PropTypes.any,
  exportExcelPermission: PropTypes.any,
  currentQuery: PropTypes.any,
  fixUrl: PropTypes.any,
  disableExportExcel: PropTypes.any,
};

Actions.defaultProps = {
  selectedIds: [],
};

export default onlyUpdateForKeys(['resource', 'filters', 'displayedFilters', 'filterValues', 'selectedIds'])(Actions);
