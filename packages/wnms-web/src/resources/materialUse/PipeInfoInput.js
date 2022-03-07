import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import {
  FlexItemForward,
  HiddenInput,
  DmaSelectInput,
  ReferenceInput,
  SelectInput,
  MapPipeInput,
  NumberInput,
  TagInput,
  EditorInput,
  required,
  minValue,
  maxValue,
  FormDataConsumer,
  GET_ONE,
  DateInput,
  withDataProvider,
} from 'ra-loopback3';
import geolib from 'geolib';
import { KmlView } from 'web-common';

const healths = [
  { id: 'OK', name: 'resources.materialuses.healths.ok' },
  { id: 'WARN', name: 'resources.materialuses.healths.warn' },
  { id: 'BAD', name: 'resources.materialuses.healths.bad' },
];
const optionRenderer = (record, val, translate) =>
  `${record.name} (${record.currentValue + val} ${translate('generic.units.meter')})`;

class PipeInfoInput extends Component {
  state = { dmaId: '' };
  UNSAFE_componentWillMount() {
    if (this.props.flgEdit) {
      let exportId = this.props.forward.record.exportId;
      let length = this.props.forward.record.length;
      if (exportId) {
        this.props.dataProvider(GET_ONE, 'materialexports', { id: exportId }).then(res => {
          if (res && res.data && res.data.currentValue) {
            this.props.formRef.current.props.change('currentValue', res.data.currentValue + length);
          }
        });
      }
    }
  }
  onDmaChange = (e, id, oldId, fullData) => {
    this.setState({
      dmaId: id || '',
      center: fullData && fullData.center ? fullData.center : undefined,
    });
  };

  onPolylineChange = (e, polyline) => {
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

  onFromNodeChange = nodeId => {
    this.props.formRef.current.props.change('fromNodeId', nodeId);
  };

  onToNodeChange = nodeId => {
    this.props.formRef.current.props.change('toNodeId', nodeId);
  };
  onChangeMat = (e, stockId) => {
    if (stockId) {
      this.props.dataProvider(GET_ONE, 'materialexports', { id: stockId }).then(res => {
        if (res && res.data && res.data.detailTypeId) {
          this.props.formRef.current.props.change('detailTypeId', res.data.detailTypeId);
        }
        if (res && res.data && res.data.name) {
          this.props.formRef.current.props.change('name', res.data.name);
        }
        if (res && res.data && res.data.currentValue) {
          this.props.formRef.current.props.change('currentValue', res.data.currentValue);
        }
        if (res && res.data && res.data.stockId) {
          this.props.formRef.current.props.change('stockId', res.data.stockId);
          this.updateDiameter(res.data.stockId);
        }
      });
    }
  };

  updateDiameter = stockId => {
    this.props
      .dataProvider(GET_ONE, 'materialstocks', { id: stockId })
      .then(res => {
        // res.data is material stock
        if (res.data && res.data.detailTypeId) {
          return this.props.dataProvider(GET_ONE, 'materialdetailtypes', { id: res.data.detailTypeId });
        }
        return null;
      })
      .then(res => {
        // res.data is materialdetailtype
        if (res.data && res.data.meta.diameter) {
          this.props.formRef.current.props.change('meta.diameter', res.data.meta.diameter);
        }
      });
  };

  render() {
    // console.log(this.props);
    const { translate, defaultCenter, defaultZoom, flgEdit, ...rest } = this.props;
    let tmp = null;
    if (flgEdit) {
      tmp = (
        <SelectInput
          optionText={record => optionRenderer(record, this.props.forward.record.length, translate)}
          disabled
        />
      );
    } else {
      tmp = <SelectInput optionText={record => optionRenderer(record, 0, translate)} />;
    }
    return (
      <FlexItemForward {...rest}>
        <HiddenInput source="type" />
        <HiddenInput source="typeDetailId" />
        <HiddenInput source="currentValue" />
        <HiddenInput source="stockId" />
        <Grid middle container spacing={2}>
          <Grid middle item xs={12} sm={6}>
            <ReferenceInput
              reference="materialexports"
              source="exportId"
              validate={[required()]}
              filter={{ type: 'Pipe', currentValue: { gt: 0 } }}
              onChange={this.onChangeMat}
            >
              {tmp}
            </ReferenceInput>
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <DmaSelectInput
              source="dmaId"
              label={translate('resources.dmas.name', {
                smart_count: 1,
              })}
              validate={[required()]}
              onChange={this.onDmaChange}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <ReferenceInput reference="nodes" source="fromNodeId" validate={[required()]}>
              <SelectInput disabled optionText="name" />
            </ReferenceInput>
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <ReferenceInput reference="nodes" source="toNodeId" validate={[required()]}>
              <SelectInput disabled optionText="name" />
            </ReferenceInput>
          </Grid>
          <Grid middle item xs={12}>
            <FormDataConsumer>
              {({ formData }) => {
                return (
                  <MapPipeInput
                    label={translate('generic.specifyPosition')}
                    style={{ marginTop: 0 }}
                    onFromNodeChange={this.onFromNodeChange}
                    onToNodeChange={this.onToNodeChange}
                    source="polyline"
                    defaultCenter={defaultCenter}
                    defaultZoom={defaultZoom}
                    onChange={this.onPolylineChange}
                    validate={[
                      required(),
                      maxValue(
                        Number(formData.currentValue || 0),
                        formData.currentValue > 0
                          ? translate('resources.materialuses.error.lessLengthPipe', {
                              val: formData.currentValue,
                            })
                          : translate('resources.materialuses.error.inputLengthPipe'),
                      ),
                    ]}
                  >
                    <KmlView common="all" />
                  </MapPipeInput>
                );
              }}
            </FormDataConsumer>
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <FormDataConsumer>
              {({ formData }) => {
                return (
                  <NumberInput
                    source="length"
                    validate={[
                      required(),
                      minValue(1),
                      maxValue(
                        Number(formData.currentValue || 0),
                        formData.currentValue > 0
                          ? translate('resources.materialuses.error.lessLengthPipe', {
                              val: formData.currentValue,
                            })
                          : translate('resources.materialuses.error.inputLengthPipe'),
                      ),
                    ]}
                    label={translate('resources.materialuses.fields.length')}
                  />
                );
              }}
            </FormDataConsumer>
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <NumberInput
              source="meta.diameter"
              disabled
              validate={[required(), minValue(1), maxValue(1000)]}
              defaultValue={10}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <SelectInput
              source="health"
              choices={healths}
              translateChoice={true}
              defaultValue="OK"
              validate={[required()]}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <DateInput source="useStartDate" validate={[required()]} />
          </Grid>
          <Grid middle item xs={12}>
            <TagInput label="generic.common.tags" source="tags" />
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
  flgEdit: PropTypes.string,
  forward: PropTypes.object,
};

PipeInfoInput.detaultProps = {};
const mapStateToProps = state => ({
  defaultZoom: state.design.defaultZoom,
  defaultCenter: state.design.defaultCenter,
});

const enhance = compose(withDataProvider, connect(mapStateToProps));

export default enhance(PipeInfoInput);
