import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'recompose';
import { isEqual, get } from 'lodash';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { FormDataConsumer } from 'react-admin';
import withDataProvider from '../data/withDataProvider';
import RawMapDmaInput from './raw/RawMapDmaInput';
import RaCustomInput from './RaCustomInput';

const styles = () => ({
  input: { width: '100%' },
});

// mapitemprops: pass render to item's map render.
class MapDmaInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultCenter: props.center,
      center: props.center || undefined,
      children: PropTypes.node,
    };
  }

  updateCenter = center => {
    this.setState({ center });
  };

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.center && !isEqual(nextProps.center, state.defaultCenter)) {
      return {
        ...state,
        defaultCenter: nextProps.center,
        center: nextProps.center,
      };
    }
    return state;
  }

  render() {
    const {
      options: rawOptions,
      value,
      className,
      classes,
      dataProvider,
      theme,
      defaultCenter,
      defaultZoom,
      enableSearchGadm,
      enableSearchDma,
      formRef,
      enableCropPolygons,
      enableDeletePolygons,
      enableDrawManyPolygons,
      children,
      ...props
    } = this.props;
    // console.log('MapDmaInput render: ', this.props);
    return (
      <FormDataConsumer>
        {({ formData, ...rest }) => {
          const options = {
            ...rawOptions,
            InputProps: {
              inputComponent: RawMapDmaInput,
            },
            inputProps: {
              mapitemprops: {
                polygon: { options: theme.dma.edit },
                options: { maxHeight: '500px' },
              },
              decorate: {
                dataProvider,
                parentDmaId: get(formData, 'parentDmaId', ''),
                excludeId: get(formData, 'id', ''),
                inCludeChild: true,
              },
              children,
              center: this.state.center,
              defaultCenter,
              defaultZoom,
              enableSearchGadm,
              enableSearchDma,
              formRef,
              enableCropPolygons,
              enableDeletePolygons,
              enableDrawManyPolygons,
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
MapDmaInput.propTypes = {
  defaultCenter: PropTypes.object,
  defaultZoom: PropTypes.number,
  center: PropTypes.object,
  options: PropTypes.object,
  value: PropTypes.any,
  className: PropTypes.any,
  classes: PropTypes.object,
  theme: PropTypes.object,
  dataProvider: PropTypes.func,
  enableSearchGadm: PropTypes.bool,
  enableSearchDma: PropTypes.bool,
  formRef: PropTypes.object,
  enableCropPolygons: PropTypes.bool,
  enableDeletePolygons: PropTypes.bool,
  enableDrawManyPolygons: PropTypes.bool,
  children: PropTypes.node,
};

const enhance = compose(withStyles(styles), withDataProvider, withTheme);
export default enhance(MapDmaInput);
