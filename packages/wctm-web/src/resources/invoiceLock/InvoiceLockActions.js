import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { CardActions } from 'ra-loopback3';
import InvoiceLockAllButton from './InvoiceLockAllButton';

const InvoiceLockActions = ({
  basePath,
  // currentSort,
  displayedFilters,
  // exporter,
  filters,
  filterValues,
  bulkActionButtons,
  onUnselectItems,
  resource,
  selectedIds,
  showFilter,
  lockInvoices,
  dataProvider,
  // translate,
}) => (
  <CardActions>
    {bulkActionButtons &&
      cloneElement(bulkActionButtons, {
        basePath,
        filterValues,
        resource,
        selectedIds,
        onUnselectItems,
      })}
    {filters &&
      React.cloneElement(filters, {
        resource,
        showFilter,
        displayedFilters,
        filterValues,
        context: 'button',
      })}
    <InvoiceLockAllButton
      dataProvider={dataProvider}
      lockInvoices={lockInvoices}
      filterValues={filterValues}
      permission={{ name: 'invoiceLock', action: 'lock' }}
    />
  </CardActions>
);
InvoiceLockActions.propTypes = {
  bulkActionButtons: PropTypes.any,
  basePath: PropTypes.any,
  currentSort: PropTypes.any,
  displayedFilters: PropTypes.any,
  exporter: PropTypes.any,
  filters: PropTypes.any,
  filterValues: PropTypes.any,
  onUnselectItems: PropTypes.any,
  resource: PropTypes.any,
  selectedIds: PropTypes.any,
  showFilter: PropTypes.any,
  dataProvider: PropTypes.any,
  lockInvoices: PropTypes.any,
};
export default InvoiceLockActions;
