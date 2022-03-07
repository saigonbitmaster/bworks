import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFormValues } from 'redux-form';
import FlexFormDisableReInit from './FlexFormDisableReInit';

class FlexFormFilter extends Component {
  static propTypes = {
    formName: PropTypes.string,
    submitOnEnter: PropTypes.bool,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    toolbar: PropTypes.any,
    ref: PropTypes.func,
    submitButton: PropTypes.any,
    setFilters: PropTypes.any,
    onFiltersChange: PropTypes.any,
    defaultProps: PropTypes.any,
  };
  static defaultProps = {
    submitOnEnter: false,
    toolbar: null,
    formName: 'filter-form',
  };

  componentDidMount() {
    if (this.props.ref) {
      this.props.ref(this);
    }
  }

  onChange = values => {
    const { submitButton, setFilters, onFiltersChange, onChange } = this.props;
    if (!submitButton && setFilters) {
      setFilters(values);
      if (onFiltersChange) {
        onFiltersChange(values);
      }
    }
    if (onChange) {
      onChange(values);
    }
  };

  onSubmit = values => {
    const { submitButton, setFilters, onFiltersChange, onSubmit } = this.props;
    if (submitButton && setFilters) {
      setFilters(values);
      if (onFiltersChange) {
        onFiltersChange(values);
      }
    }
    if (onSubmit) {
      onSubmit(values);
    }
  };

  getValues() {
    return getFormValues(this.props.formName);
  }

  render() {
    const { onChange, setFilters, defaultProps, onFiltersChange, submitButton, ...rest } = this.props;
    return <FlexFormDisableReInit save={this.onSubmit} onChange={this.onChange} onSubmit={this.onSubmit} {...rest} />;
  }
}

export default FlexFormFilter;
