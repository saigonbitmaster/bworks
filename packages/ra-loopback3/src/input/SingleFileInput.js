import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'recompose';
import { withStyles, withTheme } from '@material-ui/core/styles';
import withLocales from '../data/withLocales';
import RaCustomInput from './RaCustomInput';
import RawFileInput from './raw/RawFileInput';
const styles = () => ({
  input: { width: '100%' },
});

class SingleFileInput extends Component {
  renderInput = ({ onBlur, onKeyDown, onKeyUp, dataProvider, ...props }) => {
    return <RawFileInput dataProvider={dataProvider} {...props} />;
  };

  render() {
    const {
      options: rawOptions,
      inputProps: rawInputProps,
      className,
      dataProvider,
      classes,
      filterFiles,
      translate,
      storage,
      accept,
      ...props
    } = this.props;
    const options = {
      ...rawOptions,
      InputProps: { inputComponent: this.renderInput },
      InputLabelProps: {
        shrink: true,
      },
    };
    const inputProps = {
      ...rawInputProps,
      dataProvider,
      filterFiles,
      translate,
      storage,
      accept,
    };
    return <RaCustomInput {...props} inputProps={inputProps} options={options} className={classNames(className)} />;
  }
}

SingleFileInput.propTypes = {
  options: PropTypes.object,
  inputProps: PropTypes.object,
  className: PropTypes.any,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
  filterFiles: PropTypes.any,
  translate: PropTypes.any,
  storage: PropTypes.string,
  accept: PropTypes.string,
};

const FixSingleFileInput = compose(withLocales, withStyles(styles), withTheme)(SingleFileInput);
export default FixSingleFileInput;
