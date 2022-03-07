import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'recompose';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { FormDataConsumer } from 'react-admin';
import withDataProvider from '../data/withDataProvider';
import RawMapWaterSourceGroupInput from './raw/RawMapWaterSourceGroupInput';
import RaCustomInput from './RaCustomInput';
import get from 'lodash/get';
const styles = () => ({
  input: { width: '100%' },
});

// mapitemprops: pass render to item's map render.
class MapWaterSourceGroupInput extends Component {
  render() {
    const {
      options: rawOptions,
      value,
      className,
      classes,
      dataProvider,
      theme,
      enableCropPolygons,
      enableDeletePolygons,
      formRef,
      onlyShow,
      ...props
    } = this.props;
    return (
      <FormDataConsumer>
        {({ formData, ...rest }) => {
          const options = {
            ...rawOptions,
            InputProps: {
              inputComponent: RawMapWaterSourceGroupInput,
            },
            inputProps: {
              mapitemprops: {
                polygon: { options: theme.dma.edit },
                options: { maxHeight: '500px' },
              },
              decorate: {
                dataProvider,
                parentDmaId: get(formData, 'parentDmaId'),
                excludeId: get(formData, 'id'),
                inCludeChild: true,
                mapitemprops: {
                  polygon: { options: theme.sourceGroup },
                  options: { maxHeight: '500px' },
                },
              },
              formRef,
              enableCropPolygons,
              enableDeletePolygons,
              onlyShow,
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
MapWaterSourceGroupInput.propTypes = {
  options: PropTypes.object,
  value: PropTypes.any,
  className: PropTypes.any,
  classes: PropTypes.object,
  theme: PropTypes.object,
  dataProvider: PropTypes.func,
  enableCropPolygons: PropTypes.bool,
  enableDeletePolygons: PropTypes.bool,
  formRef: PropTypes.object,
  onlyShow: PropTypes.bool,
};

const enhance = compose(withStyles(styles), withDataProvider, withTheme);
export default enhance(MapWaterSourceGroupInput);
