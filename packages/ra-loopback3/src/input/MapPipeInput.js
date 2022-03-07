import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'recompose';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { FormDataConsumer } from 'react-admin';
import withDataProvider from '../data/withDataProvider';
import RawMapPipeInput from './raw/RawMapPipeInput';
import RaCustomInput from './RaCustomInput';

const styles = () => ({
  input: { width: '100%' },
});

// mapitemprops: pass render to item's map render.
class MapPipeInput extends Component {
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
      onFromNodeChange,
      onToNodeChange,
      hideNode,
      children,
      ...props
    } = this.props;
    return (
      <FormDataConsumer>
        {({ formData, ...rest }) => {
          const options = {
            ...rawOptions,
            InputProps: {
              inputComponent: RawMapPipeInput,
            },
            inputProps: {
              mapitemprops: {
                polyline: { options: theme.pipe.edit },
                options: { maxHeight: '500px' },
              },
              formData,
              onFromNodeChange,
              onToNodeChange,
              dataProvider,
              decorate: { dataProvider, dmaId: formData.dmaId, currentPipeId: formData.id },
              defaultZoom,
              defaultCenter,
              hideNode,
              children,
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
MapPipeInput.propTypes = {
  onFromNodeChange: PropTypes.func.isRequired,
  onToNodeChange: PropTypes.func.isRequired,
  options: PropTypes.object,
  value: PropTypes.any,
  defaultZoom: PropTypes.number,
  defaultCenter: PropTypes.object,
  className: PropTypes.any,
  classes: PropTypes.object,
  theme: PropTypes.object,
  dataProvider: PropTypes.func,
  hideNode: PropTypes.bool,
  children: PropTypes.node,
};

const enhance = compose(withStyles(styles), withDataProvider, withTheme);
export default enhance(MapPipeInput);
