import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'recompose';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { FormDataConsumer } from 'react-admin';
import get from 'lodash/get';
import withDataProvider from '../data/withDataProvider';
import RawMapNodeSelectInput from './raw/RawMapNodeSelectInput';
import RaCustomInput from './RaCustomInput';

const styles = () => ({
  input: { width: '100%' },
});

// mapitemprops: pass render to item's map render.
class MapNodeSelectInput extends Component {
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
      icon,
      model,
      activeIcon,
      children,
      ...props
    } = this.props;
    // console.log('MapNodeSelectInput', this.props);
    return (
      <FormDataConsumer>
        {({ formData, ...rest }) => {
          const options = {
            ...rawOptions,
            InputProps: {
              inputComponent: RawMapNodeSelectInput,
            },
            inputProps: {
              mapitemprops: {
                polyline: { options: theme.pipe.edit },
                options: { maxHeight: '500px' },
              },
              icon,
              activeIcon,
              model,
              formData,
              dataProvider,
              decorate: { dataProvider, dmaId: get(formData, 'dmaId', ''), currentPipeId: get(formData, 'id') },
              defaultZoom,
              defaultCenter,
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
MapNodeSelectInput.propTypes = {
  model: PropTypes.string.isRequired,
  icon: PropTypes.any.isRequired,
  activeIcon: PropTypes.any,
  options: PropTypes.object,
  value: PropTypes.any,
  defaultZoom: PropTypes.number,
  defaultCenter: PropTypes.object,
  className: PropTypes.any,
  classes: PropTypes.object,
  theme: PropTypes.object,
  dataProvider: PropTypes.func,
  children: PropTypes.node,
};

const enhance = compose(withStyles(styles), withDataProvider, withTheme);
export default enhance(MapNodeSelectInput);
