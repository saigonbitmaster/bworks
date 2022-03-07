import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'recompose';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { FormDataConsumer } from 'react-admin';
import withDataProvider from '../data/withDataProvider';
import RawMapNodeInput from './raw/RawMapNodeInput';
import RaCustomInput from './RaCustomInput';
import get from 'lodash/get';

const styles = () => ({
  input: { width: '100%' },
});

// mapitemprops: pass render to item's map render.
class MapNodeInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: props.zoom || undefined,
      center: props.center || undefined,
    };
  }

  updateCenter = center => {
    this.setState({ center });
  };

  render() {
    const {
      options: rawOptions,
      value,
      defaultZoom,
      defaultCenter,
      className,
      classes,
      dataProvider,
      icon,
      theme,
      children,
      ...props
    } = this.props;
    // console.log('map node input', this.props);
    return (
      <FormDataConsumer>
        {({ formData, ...rest }) => {
          const options = {
            ...rawOptions,
            InputProps: {
              inputComponent: RawMapNodeInput,
            },
            inputProps: {
              mapitemprops: {
                marker: { options: theme.node.edit },
                options: { maxHeight: '500px' },
                icon,
              },
              decorate: { dataProvider },
              center: this.state.center || get(formData, 'position'),
              defaultZoom,
              defaultCenter,
              formData,
              dataProvider,
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
MapNodeInput.propTypes = {
  defaultCenter: PropTypes.object,
  defaultZoom: PropTypes.number,
  zoom: PropTypes.number,
  center: PropTypes.object,
  icon: PropTypes.any,
  options: PropTypes.object,
  value: PropTypes.any,
  className: PropTypes.any,
  classes: PropTypes.object,
  theme: PropTypes.object,
  dataProvider: PropTypes.func,
  children: PropTypes.node,
};

const enhance = compose(withStyles(styles), withDataProvider, withTheme);
export default enhance(MapNodeInput);
