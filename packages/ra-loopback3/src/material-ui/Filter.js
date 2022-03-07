import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import FilterButton from 'ra-ui-materialui/lib/list/FilterButton';
import FilterForm from './FilterForm';

const styles = {
  button: {},
  form: {},
};

export class Filter extends Component {
  constructor(props) {
    super(props);
  }

  renderButton() {
    const {
      classes = {},
      context,
      debounce,
      resource,
      children,
      showFilter,
      hideFilter,
      displayedFilters,
      filterValues,
      submitButton,
      onFiltersChange,
      refFilter,
      ...rest
    } = this.props;

    return (
      <FilterButton
        className={classes.button}
        resource={resource}
        filters={React.Children.toArray(children)}
        showFilter={showFilter}
        displayedFilters={displayedFilters}
        filterValues={filterValues}
        {...rest}
      />
    );
  }

  renderForm() {
    const {
      classes = {},
      context,
      debounce,
      resource,
      children,
      hideFilter,
      displayedFilters,
      showFilter,
      filterValues,
      setFilters,
      refFilter,
      ...rest
    } = this.props;

    return (
      <FilterForm
        refFilter={refFilter}
        className={classes.form}
        resource={resource}
        filters={React.Children.toArray(children)}
        hideFilter={hideFilter}
        displayedFilters={displayedFilters}
        initialValues={filterValues}
        setFilters={setFilters}
        {...rest}
      />
    );
  }

  render() {
    return this.props.context === 'button' ? this.renderButton() : this.renderForm();
  }
}

Filter.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object,
  context: PropTypes.oneOf(['form', 'button']),
  debounce: PropTypes.number.isRequired,
  displayedFilters: PropTypes.object,
  filterValues: PropTypes.object,
  hideFilter: PropTypes.func,
  setFilters: PropTypes.func,
  showFilter: PropTypes.func,
  resource: PropTypes.string.isRequired,
  submitButton: PropTypes.element,
  refFilter: PropTypes.any,
  sub: PropTypes.bool,
  onFiltersChange: PropTypes.any,
};

Filter.defaultProps = {
  debounce: 500,
};

export default withStyles(styles)(Filter);
