import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import {
  FlexItemForward,
  MapPipeInputV2,
  NumberInput,
  EditorInput,
  required,
  minValue,
  FormDataConsumer,
  TextInput,
  withDataProvider,
  HiddenInput,
} from 'ra-loopback3';
import geolib from 'geolib';

class PipeInfoInput extends Component {
  onPolylineChange = (e, polyline) => {
    if (!polyline.length) return;
    this.onFromPositionChange(polyline[0]);
    this.onToPositionChange(polyline[polyline.length - 1]);
    let distance = 0;
    let center = { lat: 0, lng: 0 };
    if (polyline && polyline.length > 0) {
      let p1 = { latitude: polyline[0].lat, longitude: polyline[0].lng };
      center.lat += p1.latitude;
      center.lng += p1.longitude;
      for (let i = 1; i < polyline.length; i++) {
        let p2 = { latitude: polyline[i].lat, longitude: polyline[i].lng };
        distance += geolib.getDistance(p1, p2);
        p1 = p2;
        center.lat += p1.latitude;
        center.lng += p1.longitude;
      }
      center.lat /= polyline.length;
      center.lng /= polyline.length;

      /* Geocode.fromLatLng(center.lat, center.lng).then(response => {
        const address = response.results[0].formatted_address || '';
        let size = address.indexOf(',', 20);
        size = size > 20 ? size : 20;
        this.props.formRef.current.props.change('name', address.substr(0, size));
      });*/
      //this.props.formRef.current.props.change('node', polyline[0]);
    }
    this.props.formRef.current.props.change('length', distance);
  };

  onFromPositionChange = position => {
    this.props.formRef.current.props.change('fromPosition', position);
  };

  onToPositionChange = position => {
    this.props.formRef.current.props.change('toPosition', position);
  };

  render() {
    const { translate, defaultCenter, defaultZoom, ...rest } = this.props;
    return (
      <FlexItemForward {...rest}>
        <HiddenInput source="fromPosition" />
        <HiddenInput source="toPosition" />
        <Grid middle container spacing={2}>
          <Grid middle item xs={12} sm={12}>
            <TextInput source="name" validate={[required()]} />
          </Grid>
          <Grid middle item xs={12}>
            <FormDataConsumer>
              {/* eslint-disable-next-line */}
              {({ formData }) => {
                return (
                  <MapPipeInputV2
                    label={translate('generic.specifyPosition')}
                    style={{ marginTop: 0 }}
                    onFromPositionChange={this.onFromPositionChange}
                    onToPositionChange={this.onToPositionChange}
                    source="polyline"
                    defaultCenter={defaultCenter}
                    defaultZoom={defaultZoom}
                    onChange={this.onPolylineChange}
                    validate={[required()]}
                  />
                );
              }}
            </FormDataConsumer>
          </Grid>

          <Grid middle item xs={12} sm={6}>
            <FormDataConsumer>
              {/* eslint-disable-next-line */}
              {({ formData }) => {
                return (
                  <NumberInput
                    source="length"
                    validate={[required(), minValue(1)]}
                    label={translate('resources.pipes.fields.length')}
                  />
                );
              }}
            </FormDataConsumer>
          </Grid>
          <Grid middle item xs={12}>
            <EditorInput fullWidth label="generic.common.description" source="description" />
          </Grid>
        </Grid>
      </FlexItemForward>
    );
  }
}
PipeInfoInput.propTypes = {
  dataProvider: PropTypes.func,
  formRef: PropTypes.func,
  translate: PropTypes.func,
  defaultCenter: PropTypes.object,
  defaultZoom: PropTypes.number,
  forward: PropTypes.object,
};

PipeInfoInput.detaultProps = {};
const mapStateToProps = state => ({
  defaultZoom: state.design.defaultZoom,
  defaultCenter: state.design.defaultCenter,
});

const enhance = compose(withDataProvider, connect(mapStateToProps));

export default enhance(PipeInfoInput);
