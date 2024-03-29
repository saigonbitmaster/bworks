import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, change, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { getDefaultValues, translate } from 'react-admin';
import Toolbar from 'ra-ui-materialui/lib/form/Toolbar';
import FlexFormItem from './FlexFormItem';

const styles = theme => ({
  form: {
    [theme.breakpoints.up('sm')]: {
      padding: '0 1em 1em 1em',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '0 1em 5em 1em',
    },
  },
});

const sanitizeRestProps = ({
  anyTouched,
  array,
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
  form,
  handleSubmit,
  initialize,
  initialized,
  initialValues,
  pristine,
  pure,
  redirect,
  reset,
  resetSection,
  save,
  submit,
  submitFailed,
  submitSucceeded,
  submitting,
  touch,
  translate,
  triggerSubmit,
  untouch,
  valid,
  validate,
  ...props
}) => props;

export const DEFAULT_FORM = 'record-form';
class FlexFormDisableReInit extends Component {
  handleSubmitWithRedirect = (redirect = this.props.redirect) =>
    this.props.handleSubmit(values => this.props.save(values, redirect));

  componentDidMount() {
    if (this.props.formRef) {
      this.props.formRef.current = this;
    }
    if (this.props.onChange) {
      this.props.onChange(this.props.values);
    }
  }

  // onChange
  render() {
    const {
      basePath,
      children,
      classes = {},
      className,
      invalid,
      pristine,
      record,
      resource,
      submitOnEnter,
      toolbar,
      version,
      formName,
      formRef,
      forward,
      handleSubmit,
      onSubmit,
      ...rest
    } = this.props;
    return (
      <form
        onSubmit={handleSubmit(values => onSubmit(values))}
        className={classnames('flex-form', className)}
        {...sanitizeRestProps(rest)}
      >
        <div className={classes.form} key={version}>
          <FlexFormItem elements={children} forward={{ basePath, record, resource, ...forward }} />
        </div>
        {toolbar &&
          React.cloneElement(toolbar, {
            handleSubmitWithRedirect: this.handleSubmitWithRedirect,
            invalid,
            pristine,
            submitOnEnter,
          })}
      </form>
    );
  }
}

FlexFormDisableReInit.propTypes = {
  basePath: PropTypes.string,
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  handleSubmit: PropTypes.func, // passed by redux-form
  invalid: PropTypes.bool,
  pristine: PropTypes.bool,
  record: PropTypes.object,
  resource: PropTypes.string,
  redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
  submitOnEnter: PropTypes.bool,
  toolbar: PropTypes.element,
  validate: PropTypes.func,
  version: PropTypes.number,
  formName: PropTypes.string,
  formRef: PropTypes.any,
  change: PropTypes.func,
  forward: PropTypes.object,
  setFilters: PropTypes.func,
  onSubmit: PropTypes.any,
  onChange: PropTypes.func,
  values: PropTypes.object,
};

FlexFormDisableReInit.defaultProps = {
  submitOnEnter: true,
  toolbar: <Toolbar />,
  formName: DEFAULT_FORM,
};

const mapDispatchToProps = (dispatch, props) => ({
  change: (name, value) => dispatch(change(props.formName || DEFAULT_FORM, name, value)),
});

const enhance = compose(
  connect((state, props) => {
    return {
      initialValues: getDefaultValues(state, props),
      form: props.formName || DEFAULT_FORM,
      destroyOnUnmount: props.destroyOnUnmount || false,
    };
  }, mapDispatchToProps),
  translate, // Must be before reduxForm so that it can be used in validation
  reduxForm({
    enableReinitialize: false,
  }),
  connect((state, props) => ({
    values: getFormValues(props.formName || DEFAULT_FORM)(state),
  })),
  withStyles(styles),
);

export default enhance(FlexFormDisableReInit);
