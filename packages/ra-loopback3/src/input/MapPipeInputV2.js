import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'recompose';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { FormDataConsumer } from 'react-admin';
import withDataProvider from '../data/withDataProvider';
import RawMapPipeInputV2 from './raw/RawMapPipeInputV2';
import RaCustomInput from './RaCustomInput';

const styles = () => ({
  input: { width: '100%' },
});

// mapitemprops: pass render to item's map render.
class MapPipeInputV2 extends Component {
  render() {
    const {
      options: rawOptions,
      value,
      className,
      classes,
      dataProvider,
      defaultZoom,
      defaultCenter,
      theme,
      onFromPositionChange,
      onToPositionChange,
      ...props
    } = this.props;
    return (
      <FormDataConsumer>
        {({ formData, ...rest }) => {
          const options = {
            ...rawOptions,
            InputProps: {
              inputComponent: RawMapPipeInputV2,
            },
            inputProps: {
              mapitemprops: {
                polyline: { options: theme.pipe.edit },
                options: { maxHeight: '500px' },
              },
              formData,
              onFromPositionChange,
              onToPositionChange,
              dataProvider,
              decorate: { dataProvider },
              defaultZoom,
              defaultCenter,
            },
            InputLabelProps: {
              shrink: true,
            },
          };
          return (
            <RaCustomInput
              {...props}
              {...rest}
              options={options}
              className={classNames(className, classes.input)}
              value={value || []}
            />
          );
        }}
      </FormDataConsumer>
    );
  }
}
MapPipeInputV2.propTypes = {
  onFromPositionChange: PropTypes.func,
  onToPositionChange: PropTypes.func,
  options: PropTypes.object,
  value: PropTypes.any,
  defaultZoom: PropTypes.number,
  defaultCenter: PropTypes.object,
  className: PropTypes.any,
  classes: PropTypes.object,
  theme: PropTypes.object,
  dataProvider: PropTypes.func,
};

const enhance = compose(withStyles(styles), withDataProvider, withTheme);
export default enhance(MapPipeInputV2);
