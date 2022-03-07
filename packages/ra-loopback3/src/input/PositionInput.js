import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'recompose';
import { withTheme } from '@material-ui/core/styles';
import withLocales from '../data/withLocales';
import RaCustomInput from './RaCustomInput';
import RawPositionInput from './raw/RawPositionInput';

class PositionInput extends Component {
  renderInput = ({ onBlur, onKeyDown, onKeyUp, ...props }) => {
    return <RawPositionInput {...props} />;
  };

  render() {
    const { options: rawOptions, inputProps: rawInputProps, className, classes, ...props } = this.props;
    const options = {
      ...rawOptions,
      InputProps: { inputComponent: this.renderInput, completeUI: true },
      InputLabelProps: {
        shrink: true,
      },
    };
    const inputProps = {
      ...rawInputProps,
    };
    return <RaCustomInput {...props} inputProps={inputProps} options={options} className={classNames(className)} />;
  }
}

PositionInput.propTypes = {
  options: PropTypes.object,
  inputProps: PropTypes.object,
  className: PropTypes.any,
  classes: PropTypes.object,
};

const enhance = compose(withLocales, withTheme);
export default enhance(PositionInput);
