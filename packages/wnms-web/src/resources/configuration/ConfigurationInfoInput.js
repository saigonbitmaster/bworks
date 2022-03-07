import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { debounce, get } from 'lodash';
import {
  NumberInput,
  SelectInput,
  DisabledInput,
  TextInput,
  required,
  number,
  minValue,
  translate,
  maxValue,
  CUSTOM,
  withDataProvider,
  HiddenInput,
  FlexFormIterator,
  Button,
  FunctionField,
} from 'ra-loopback3';
import { change, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';

import ArrayInput from './CustomArrayInput';

class ConfigurationInfoInput extends Component {
  static sidechoices = [
    { id: 'all', name: 'all' },
    { id: 'frontend', name: 'frontend' },
    { id: 'backend', name: 'backend' },
  ];
  static propTypes = {
    id: PropTypes.string,
    idchoices: PropTypes.any,
    formData: PropTypes.object,
    change: PropTypes.func,
    refreshView: PropTypes.func,
    formRef: PropTypes.any,
    translate: PropTypes.any,
    dataProvider: PropTypes.func,
  };

  state = {
    validatechoices: [],
  };

  componentDidMount() {
    this.getAttributeChoices(this.props && this.props.id);
  }

  getAttributeChoices = async id => {
    this.props
      .dataProvider(CUSTOM, 'NmsConfigs', {
        subUrl: 'getAttributeChoices',
        query: { id: id },
      })
      .then(async res => {
        let data = Object.assign(this.state.validatechoices, res.data);
        if (res.data.length > 0) this.setState({ validatechoices: data });
      });
  };

  onChangeId = debounce((e, val) => {
    const { idchoices, formRef } = this.props;
    let currentVal = idchoices.find(item => item.id === val);

    switch (val) {
      case 'MapDefaultCenter':
        formRef.current.props.change('value', { lat: 0, lng: 0 });
        break;
      case 'MapDefaultZoom': {
        formRef.current.props.change('value', (currentVal && currentVal.min) || 0);
        break;
      }
      case 'PressureLimit': {
        formRef.current.props.change('value', 0);
        break;
      }
      case 'QualityFluo': {
        formRef.current.props.change('value', 0);
        break;
      }
      case 'QualityPh': {
        formRef.current.props.change('value', 0);
        break;
      }
      case 'Pressure': {
        formRef.current.props.change('value.high.condition', '>');
        formRef.current.props.change('value.low.condition', '<');
        formRef.current.props.change('value.loss.condition', '>');
        formRef.current.props.change('value.high.value', 0);
        formRef.current.props.change('value.low.value', 0);
        formRef.current.props.change('value.loss.value', 0);
        break;
      }
      case 'Flow': {
        formRef.current.props.change('value.high.value', 0);
        formRef.current.props.change('value.high.condition', '>');
        break;
      }
      case 'StatisticMatStk': {
        formRef.current.props.change('value.high.value', 0);
        formRef.current.props.change('value.high.condition', '>');
        break;
      }
      case 'StatisticMatDMA': {
        formRef.current.props.change('value.high.value', 0);
        formRef.current.props.change('value.high.condition', '>');
        break;
      }
      case 'StatisticMatLifeSpan': {
        formRef.current.props.change('value.existTime.condition', '>');
        formRef.current.props.change('value.lessTime.condition', '>');
        formRef.current.props.change('value.existTime.value', 0);
        formRef.current.props.change('value.lessTime.value', 0);

        break;
      }
      case 'RateWaterLeak': {
        formRef.current.props.change('value.warning.condition', '>=');
        formRef.current.props.change('value.high.condition', '>=');
        formRef.current.props.change('value.warning.value', 0);
        formRef.current.props.change('value.high.value', 0);

        break;
      }
      default:
        formRef.current.props.change('value', undefined);
        break;
    }
  }, 0);

  getTypeById(id) {
    let result = '';
    this.state.validatechoices &&
      this.state.validatechoices.some(item => {
        if (item.id === id) {
          result = item.type;
          return true;
        }
        return false;
      });
    return result;
  }

  translateId = data => {
    let id = typeof data === 'object' ? data.id : data;
    let result = [];
    if (id) result = this.props.translate(`resources.nmsconfigs.fields.ids.${id}`);
    else
      result =
        this.props &&
        this.props.idchoices &&
        this.props.idchoices.map(i => {
          let name = this.props.translate(`resources.nmsconfigs.fields.ids.${i.id}`);
          return { id: i.id, name: name };
        });
    return result;
  };

  translateSide = side => {
    let result = [];
    if (side) result = this.props.translate(`resources.nmsconfigs.fields.sides.${side}`);
    else
      result = ConfigurationInfoInput.sidechoices.map(i => {
        let side = this.props.translate(`resources.nmsconfigs.fields.sides.${i.id}`);
        return { id: i.id, name: side };
      });
    return result;
  };

  toggleLowerLimitSymbol = () => member => {
    const { change, formData } = this.props;

    // Get the limit symbol and toggle them
    const selectedLowerLimitSymbol = get(formData, `${member}.lowerLimitSymbol`, '>=');
    let newLowerLimitSymbol = '';
    if (selectedLowerLimitSymbol === '>') {
      newLowerLimitSymbol = '>=';
    } else {
      newLowerLimitSymbol = '>';
    }
    change(`${member}.lowerLimitSymbol`, newLowerLimitSymbol);
  };

  toggleUpperLimitSymbol = () => member => {
    const { change, formData } = this.props;

    // Get the limit symbol and toggle them
    const selectedUpperLimitSymbol = get(formData, `${member}.upperLimitSymbol`, '<=');
    let newUpperLimitSymbol = '';
    if (selectedUpperLimitSymbol === '<') {
      newUpperLimitSymbol = '<=';
    } else {
      newUpperLimitSymbol = '<';
    }
    change(`${member}.upperLimitSymbol`, newUpperLimitSymbol);
  };

  renderValue(formData, rest) {
    // console.log(type, formData);
    let type = this.getTypeById(get(formData, 'id', ''));
   

    const { formRef } = this.props;
    let currentId =
      (formRef.current && formRef.current.props && formRef.current.props.values && formRef.current.props.values.id) ||
      get(formData, 'id', '') ||
      '';
    const value = this.state.validatechoices && this.state.validatechoices.find(item => item.id === currentId);
    //switch (type)
    switch (formData.id) {
      case 'MapDefaultCenter': {
        return (
          <Grid middle="true" container spacing={2}>
            <Grid sm={6} xs={12} middle="true" item>
              <NumberInput
                source="value.lng"
                label={this.props.translate('resources.nmsconfigs.fields.values.lng')}
                {...rest}
              />
            </Grid>
            <Grid sm={6} xs={12} middle="true" item>
              <NumberInput
                source="value.lat"
                label={this.props.translate('resources.nmsconfigs.fields.values.lat')}
                {...rest}
              />
            </Grid>
          </Grid>
        );
      }
      case 'Number':
      case 'LimitOnPercent':
      case 'LimitOnPercentMax': {
        if (!formData.value || typeof formData.value === 'number') {
          return (
            <Grid sm={6} xs={12} middle="true" item>
              <NumberInput
                key={type}
                source="value"
                label={this.props.translate('resources.nmsconfigs.fields.values.number')}
                validate={[
                  required(),
                  number(),
                  minValue((value && value.min) || 0),
                  maxValue(value && value.max) || null,
                ]}
                {...rest}
              />
            </Grid>
          );
        }
        return null;
      }
      case 'Flow': {
        if (!formData.value || typeof formData.value === 'object') {
          return (
            <Grid sm={6} xs={12} middle="true" item>
              <HiddenInput source="value.high.condition" />
              <NumberInput
                key={type}
                source="value.high.value"
                label={this.props.translate('resources.nmsconfigs.flow.high')}
                validate={[
                  required(),
                  number(),
                  minValue((value && value.min) || 0),
                  maxValue(value && value.max) || null,
                ]}
                {...rest}
              />
            </Grid>
          );
        }
        return null;
      }
      case 'Pressure': {
        if (!formData.value || typeof formData.value === 'object') {
          return (
            <Grid middle="true" container>
              <HiddenInput source="value.loss.condition" />
              <HiddenInput source="value.high.condition" />
              <HiddenInput source="value.low.condition" />
              <Grid sm={6} xs={12} middle="true" item>
                <NumberInput
                  key={type}
                  source="value.high.value"
                  label={this.props.translate('resources.nmsconfigs.pressure.high')}
                  validate={[
                    required(),
                    number(),
                    minValue((value && value.min) || 0),
                    maxValue(value && value.max) || null,
                  ]}
                  {...rest}
                />
              </Grid>
              <Grid sm={6} xs={12} middle="true" item>
                <NumberInput
                  key={type}
                  source="value.low.value"
                  label={this.props.translate('resources.nmsconfigs.pressure.low')}
                  validate={[
                    required(),
                    number(),
                    minValue((value && value.min) || 0),
                    maxValue(value && value.max) || null,
                  ]}
                  {...rest}
                />
              </Grid>
              <Grid sm={6} xs={12} middle="true" item>
                <NumberInput
                  key={type}
                  source="value.loss.value"
                  label={this.props.translate('resources.nmsconfigs.pressure.loss')}
                  validate={[
                    required(),
                    number(),
                    minValue((value && value.min) || 0),
                    maxValue(value && value.max) || null,
                  ]}
                  {...rest}
                />
              </Grid>
            </Grid>
          );
        }
        return null;
      }
      case 'StatisticMatStk': {
        if (!formData.value || typeof formData.value === 'object') {
          return (
            <Grid sm={6} xs={12} middle="true" item>
              <HiddenInput source="value.high.condition" />
              <NumberInput
                key={type}
                source="value.high.value"
                label={this.props.translate('resources.nmsconfigs.statisticMatStk.high')}
                validate={[
                  required(),
                  number(),
                  minValue((value && value.min) || 0),
                  maxValue(value && value.max) || null,
                ]}
                {...rest}
              />
            </Grid>
          );
        }
        return null;
      }
      case 'StatisticMatDMA': {
        if (!formData.value || typeof formData.value === 'object') {
          return (
            <Grid sm={6} xs={12} middle="true" item>
              <HiddenInput source="value.high.condition" />
              <NumberInput
                key={type}
                source="value.high.value"
                label={this.props.translate('resources.nmsconfigs.statisticMatDMA.high')}
                validate={[
                  required(),
                  number(),
                  minValue((value && value.min) || 0),
                  maxValue(value && value.max) || null,
                ]}
                {...rest}
              />
            </Grid>
          );
        }
        return null;
      }
      case 'StatisticMatLifeSpan': {
        if (!formData.value || typeof formData.value === 'object') {
          return (
            <Grid middle="true" container>
              <HiddenInput source="value.existTime.condition" />
              <HiddenInput source="value.lessTime.condition" />
              <Grid sm={6} xs={12} middle="true" item>
                <NumberInput
                  key={type}
                  source="value.existTime.value"
                  label={this.props.translate('resources.nmsconfigs.statisticMatLifeSpan.existTime')}
                  validate={[
                    required(),
                    number(),
                    minValue((value && value.min) || 0),
                    maxValue(value && value.max) || null,
                  ]}
                  {...rest}
                />
              </Grid>
              <Grid sm={6} xs={12} middle="true" item>
                <NumberInput
                  key={type}
                  source="value.lessTime.value"
                  label={this.props.translate('resources.nmsconfigs.statisticMatLifeSpan.lessTime')}
                  validate={[
                    required(),
                    number(),
                    minValue((value && value.min) || 0),
                    maxValue(value && value.max) || null,
                  ]}
                  {...rest}
                />
              </Grid>
            </Grid>
          );
        }
        return null;
      }
      case 'RateWaterLeak': {
        if (!formData.value || typeof formData.value === 'object') {
          return (
            <Grid middle="true" container>
              <HiddenInput source="value.warning.condition" />
              <HiddenInput source="value.high.condition" />
              <Grid sm={6} xs={12} middle="true" item>
                <NumberInput
                  key={type}
                  source="value.high.value"
                  label={this.props.translate('resources.nmsconfigs.rateWaterLeak.high')}
                  validate={[
                    required(),
                    number(),
                    minValue((value && value.min) || 0),
                    maxValue(value && value.max) || null,
                  ]}
                  {...rest}
                />
              </Grid>
              <Grid sm={6} xs={12} middle="true" item>
                <NumberInput
                  key={type}
                  source="value.warning.value"
                  label={this.props.translate('resources.nmsconfigs.rateWaterLeak.warning')}
                  validate={[
                    required(),
                    number(),
                    minValue((value && value.min) || 0),
                    maxValue(value && value.max) || null,
                  ]}
                  {...rest}
                />
              </Grid>
            </Grid>
          );
        }
        return null;
      }
      case 'DomesticWaterStandard': {
        return (
          <Grid middle item xs={12} sm={6}>
            <ArrayInput fullWidth source="value" label={''} record={formData}>
              <FlexFormIterator>
                <TextInput fullWidth label={'Tiêu chuẩn'} source="name" validate={[required()]} />
                <TextInput style={{ display: 'none' }} source="lowerLimitSymbol" defaultValue={'>='} />
                <TextInput style={{ display: 'none' }} source="upperLimitSymbol" defaultValue={'<='} />
                <Grid middle container spacing={1} alignItems={'baseline'} style={{ width: '100%' }}>
                  <Grid middle xs={12} sm={1} item>
                    <Button middle style={{ width: '30px', minWidth: '0px' }} onClick={this.toggleLowerLimitSymbol}>
                      <FunctionField
                        middle
                        render={record => (
                          <span middle style={{ fontSize: '25px' }}>
                            {record.lowerLimitSymbol === '>' ? <html>&gt;</html> : <html>&ge;</html>}
                          </span>
                        )}
                      />
                    </Button>
                  </Grid>
                  <Grid middle xs={12} sm={10} item>
                    <NumberInput label={'Giới hạn dưới'} source="lowerLimit" validate={[number()]} />
                  </Grid>
                </Grid>
                <Grid middle container spacing={1} alignItems={'baseline'} style={{ width: '100%' }}>
                  <Grid middle xs={12} sm={1} item>
                    <Button middle style={{ width: '30px', minWidth: '0px' }} onClick={this.toggleUpperLimitSymbol}>
                      <FunctionField
                        middle
                        render={record => (
                          <span middle style={{ fontSize: '25px' }}>
                            {record.upperLimitSymbol === '<' ? <html>&lt;</html> : <html>&le;</html>}
                          </span>
                        )}
                      />
                    </Button>
                  </Grid>
                  <Grid middle xs={12} sm={10} item>
                    <NumberInput label={'Giới hạn trên'} source="upperLimit" validate={[required(), number()]} />
                  </Grid>
                </Grid>
              </FlexFormIterator>
            </ArrayInput>
          </Grid>
        );
      }
      default: {
        return '';
      }
    }
  }

  render() {
    const { idchoices, formData, ...rest } = this.props;
    return (
      <Grid middle container spacing={2}>
        <Grid middle item sm={6} xs={12}>
          {idchoices && idchoices.length ? (
            <SelectInput
              source="id"
              key={idchoices.length}
              choices={idchoices}
              validate={[required()]}
              optionText={this.translateId}
              onChange={this.onChangeId}
            />
          ) : (
            <DisabledInput source="id" format={this.translateId} />
          )}
        </Grid>
        {/* <Grid middle item sm={6} xs={12}>
            <SelectInput
              source="side"
              choices={this.translateSide()}
              label={this.props.translate('resources.nmsconfigs.fields.side')}
              optionText={'name'}
              defaultValue={ConfigurationInfoInput.sidechoices[0].id}
            />
          </Grid> */}
        <Grid middle item sm={12}>
          {this.renderValue(formData, rest)}
        </Grid>
      </Grid>
    );
  }
}

const enhance = compose(
  withDataProvider,
  translate,
  connect(
    state => ({
      formData: getFormValues('record-form')(state),
    }),
    dispatch => ({
      change: (name, value) => {
        dispatch(change('record-form', name, value));
      },
    }),
  ),
);

export default enhance(ConfigurationInfoInput);
