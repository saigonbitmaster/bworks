import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid, withTheme } from '@material-ui/core';
import { connect } from 'react-redux';
import {
  FlexItemForward,
  HiddenInput,
  DmaSelectInput,
  ReferenceInput,
  SelectInput,
  TagInput,
  EditorInput,
  required,
  withDataProvider,
  GET_ONE,
  DateInput,
  TextInput,
} from 'ra-loopback3';

import config from '../../Config';
import MetaFlowLoggerInput from './MetaFlowLoggerInput';
import MetaElectricLoggerInput from './MetaElectricLoggerInput';
import MetaQualityLoggerInput from './MetaQualityLoggerInput';
import MetaMeterInput from './MetaMeterInput';
import MetaFilterInput from './MetaFilterInput';
import MetaPressureReducingInput from './MetaPressureReducingInput';
import MetaPumpInput from './MetaPumpInput';
import MetaTankInput from './MetaTankInput';
import MetaValveInput from './MetaValveInput';
import MetaOtherInput from './MetaOtherInput';

const DependInput = props => {
  switch (props.type) {
    case 'FlowLogger':
      return <MetaFlowLoggerInput subFlex {...props} />;
    case 'ElectricLogger':
      return <MetaElectricLoggerInput subFlex {...props} />;
    case 'QualityLogger':
      return <MetaQualityLoggerInput subFlex {...props} />;
    case 'Meter':
      return <MetaMeterInput subFlex {...props} />;
    case 'Filter':
      return <MetaFilterInput subFlex {...props} />;
    case 'PressureReducing':
      return <MetaPressureReducingInput subFlex {...props} />;
    case 'Pump':
      return <MetaPumpInput subFlex {...props} />;
    case 'Tank':
      return <MetaTankInput subFlex {...props} />;
    case 'Valve':
      return <MetaValveInput subFlex {...props} />;
    case 'Other':
      return <MetaOtherInput subFlex {...props} />;
    default:
      return null;
  }
};
const optionRenderer = (record, val, translate) =>
  `${record.name} (${record.currentValue + val} ${translate('generic.units.quantity')})`;

DependInput.propTypes = { type: PropTypes.string, theme: PropTypes.object };
class MaterialUseInfoInput extends Component {
  state = { dmaId: '' };
  UNSAFE_componentWillMount() {
    if (this.props.flgEdit) {
      let exportId = this.props.forward.record.exportId;
      if (exportId) {
        this.props.dataProvider(GET_ONE, 'materialexports', { id: exportId }).then(res => {
          if (res && res.data && res.data.currentValue) {
            this.props.formRef.current.props.change('currentValue', res.data.currentValue);
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

  onFromNodeChange = (a, nodeId) => {
    const change = this.props.formRef.current.props.change;
    if (nodeId) {
      this.props.dataProvider(GET_ONE, 'nodes', { id: nodeId }).then(({ data }) => {
        if (data && data.position && !this.unmount) {
          change('node', data.position);
          // this.updateName(data.position, change);
        }
      });
    } else {
      change('node', null);
    }
  };
  // next version
  // onFromNodeChange = (e, position) => {
  //   const change = this.props.formRef.current.props.change;
  //   console.log('onFromNodeChange', name, position);
  //   change('fromPosition', position);
  // };

  // updateName = debounce((position, change) => {
  //   if (position) {
  //     Geocode.fromLatLng(position.lat, position.lng).then(response => {
  //       const address = response.results[0].formatted_address || '';
  //       let size = address.indexOf(',', 20);
  //       size = size > 20 ? size : 20;
  //       let name = `Logger ${address.substr(0, size)}`;
  //       change('name', name);
  //     });
  //   }
  // }, 100);

  componentWillUnmount() {
    this.unmount = true;
  }
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
        }
      });
    }
  };
  render() {
    const {
      resource,
      translate,
      defaultCenter,
      defaultZoom,
      dataProvider,
      type,
      theme,
      options,
      flgEdit,
      ...rest
    } = this.props;
    // console.log('material use info input', this.props);
    let tmp = null;
    if (flgEdit) {
      tmp = <SelectInput optionText={record => optionRenderer(record, 0, translate)} disabled />;
    } else {
      tmp = <SelectInput optionText={record => optionRenderer(record, 0, translate)} />;
    }
    return (
      <FlexItemForward {...rest}>
        <HiddenInput source="type" />
        <HiddenInput source="node" />
        <Grid middle container spacing={2}>
          <Grid middle item xs={12} sm={6}>
            <ReferenceInput
              reference="materialexports"
              source="exportId"
              validate={[required()]}
              label={translate('resources.materialuses.fields.exportId')}
              filter={{ type, currentValue: { gt: 0 } }}
              onChange={this.onChangeMat}
              resource={resource}
            >
              {tmp}
            </ReferenceInput>
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <TextInput source="name" />
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
          <DependInput
            subFlex
            options={options}
            type={type}
            translate={translate}
            defaultCenter={defaultCenter}
            defaultZoom={defaultZoom}
            theme={theme}
            onFromNodeChange={this.onFromNodeChange}
          />
          <Grid middle item xs={12} sm={6}>
            <SelectInput
              source="health"
              choices={config.healthChoices}
              translateChoice={true}
              defaultValue="OK"
              validate={[required()]}
              resource={resource}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <DateInput source="useStartDate" validate={[required()]} resource={resource} />
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
MaterialUseInfoInput.propTypes = {
  options: PropTypes.any,
  formRef: PropTypes.func,
  type: PropTypes.string,
  translate: PropTypes.func,
  defaultCenter: PropTypes.object,
  defaultZoom: PropTypes.number,
  dataProvider: PropTypes.func,
  theme: PropTypes.object,
  flgEdit: PropTypes.string,
  forward: PropTypes.object,
  resource: PropTypes.string,
};

const mapStateToProps = state => ({
  defaultZoom: state.design.defaultZoom,
  defaultCenter: state.design.defaultCenter,
});

const enhance = compose(connect(mapStateToProps), withDataProvider, withTheme);

export default enhance(MaterialUseInfoInput);
