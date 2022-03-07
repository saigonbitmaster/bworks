import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, getFormValues, change } from 'redux-form';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import lodashSet from 'lodash/set';
import omit from 'lodash/omit';

import FilterFormInput from 'ra-ui-materialui/lib/list/FilterFormInput';

const styles = ({ palette: { primary1Color } }) => ({
  card: {
    marginTop: '-14px',
    paddingTop: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  body: { display: 'flex', alignItems: 'flex-end' },
  spacer: { width: 48 },
  icon: { color: primary1Color || '#00bcd4', paddingBottom: 0 },
  clearFix: { clear: 'right' },
});

const sanitizeRestProps = ({
  anyTouched,
  asyncValidate,
  asyncValidating,
  autofill,
  blur,
  change,
  clearAsyncError,
  clearFields,
  clearSubmit,
  clearSubmitErrors,
  destroy,
  dirty,
  dispatch,
  displayedFilters,
  filterValues,
  handleSubmit,
  hideFilter,
  initialize,
  initialized,
  initialValues,
  invalid,
  pristine,
  pure,
  reset,
  resetSection,
  save,
  setFilter,
  setFilters,
  submit,
  submitFailed,
  submitSucceeded,
  submitting,
  touch,
  triggerSubmit,
  untouch,
  valid,
  validate,
  onFiltersChange,
  ...props
}) => props;

export class FilterForm extends Component {
  componentDidMount() {
    if (this.props.refFilter) {
      this.props.refFilter.current = this;
    }
    this.props.filters.forEach(filter => {
      if (filter.props.alwaysOn && filter.props.defaultValue) {
        throw new Error(
          'Cannot use alwaysOn and defaultValue on a filter input. Please set the filterDefaultValues props on the <List> element instead.',
        );
      }
    });
  }

  getShownFilters() {
    const { filters, displayedFilters, initialValues } = this.props;

    return filters.filter(
      filterElement =>
        filterElement.props.alwaysOn ||
        displayedFilters[filterElement.props.source] ||
        typeof initialValues[filterElement.props.source] !== 'undefined',
    );
  }

  handleHide = event => this.props.hideFilter(event.currentTarget.dataset.key);

  submit = (values, dispatch, props) => {
    if (props && props.submitButton) {
      props.setFilters(values);
      if (props.onFiltersChange) {
        props.onFiltersChange(values);
      }
    }
  };

  render() {
    const { classes = {}, className, resource, submitButton, handleSubmit, refFilter, toLeft, ...rest } = this.props;
    let showButton = false;
    return (
      <form onSubmit={handleSubmit(this.submit)} className={className} {...sanitizeRestProps(rest)}>
        <CardContent className={toLeft ? omit(classes.card, 'justifyContent') : classes.card}>
          {this.getShownFilters()
            .reverse()
            .map(filterElement => {
              showButton = true;
              return (
                <FilterFormInput
                  key={filterElement.props.source}
                  filterElement={filterElement}
                  handleHide={this.handleHide}
                  classes={classes}
                  resource={resource}
                />
              );
            })}
          {showButton && submitButton}
        </CardContent>
        <div className={classes.clearFix} />
      </form>
    );
  }
}

FilterForm.propTypes = {
  resource: PropTypes.string.isRequired,
  filters: PropTypes.arrayOf(PropTypes.node).isRequired,
  displayedFilters: PropTypes.object.isRequired,
  hideFilter: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  classes: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func,
  submitButton: PropTypes.element,
  handleSubmit: PropTypes.func,
  refFilter: PropTypes.object,
  toLeft: PropTypes.any,
  sub: PropTypes.bool,
};

export const mergeInitialValuesWithDefaultValues = ({ initialValues, filters }) => ({
  initialValues: {
    ...filters
      .filter(filterElement => filterElement.props.alwaysOn && filterElement.props.defaultValue)
      .reduce(
        (acc, filterElement) => lodashSet({ ...acc }, filterElement.props.source, filterElement.props.defaultValue),
        {},
      ),
    ...initialValues,
  },
});

const enhance = compose(
  withStyles(styles),
  withProps(mergeInitialValuesWithDefaultValues),
  connect((state, props) => ({
    form: props.sub ? `${props.resource}-filterForm` : 'filterForm',
  })),
  reduxForm({
    enableReinitialize: true,
    destroyOnUnmount: false, // do not destroy to preserve state across navigation
    onChange: (values, dispatch, props, previousValues) => { // eslint-disable-line
      if (props) {
        if (props.submitButton) {
          // submit button case
          // remove or add filter case
          // if (Object.keys(values || {}).length !== Object.keys(previousValues || {}).length) {
          //   props.setFilters(values);
          //   if (props.onFiltersChange) {
          //     props.onFiltersChange(values);
          //   }
          // }
        } else {
          // manual case.
          props.setFilters(values);
          if (props.onFiltersChange) {
            props.onFiltersChange(values);
          }
        }
      }
    },
  }),
  connect(
    (state, props) => ({
      values: getFormValues(props.form)(state),
    }),
    (dispatch, props) => ({
      change: (name, value) => dispatch(change(props.form, name, value)),
    }),
  ),
);

export default enhance(FilterForm);
