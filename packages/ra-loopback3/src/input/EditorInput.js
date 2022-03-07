import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'recompose';
import { withStyles, withTheme } from '@material-ui/core';
// import { Responsive } from 'ra-ui-materialui/lib';
// import { default as RichTextInput } from 'ra-input-rich-text';
import withLocales from '../data/withLocales';
import RaCustomInput from './RaCustomInput';
import RawEditorInput from './raw/RawEditorInput';

const styles = () => ({
  input: { width: '100%' },
});

class EditorInput extends Component {
  renderInput = ({ onBlur, onKeyDown, onKeyUp, ...props }) => {
    return <RawEditorInput {...props} />;
  };

  render() {
    const { options: rawOptions, inputProps: rawInputProps, className, classes, ...props } = this.props;
    const options = {
      ...rawOptions,
      InputProps: { inputComponent: this.renderInput },
      InputLabelProps: {
        shrink: true,
      },
    };
    const inputProps = {
      ...rawInputProps,
    };
    return (
      <RaCustomInput
        {...props}
        inputProps={inputProps}
        options={options}
        className={classNames(className, classes.input)}
      />
    );
  }
}

EditorInput.propTypes = {
  options: PropTypes.object,
  inputProps: PropTypes.object,
  className: PropTypes.any,
  classes: PropTypes.object,
};

const enhance = compose(withLocales, withStyles(styles), withTheme);
export default enhance(EditorInput);
