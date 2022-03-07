import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { debounce } from 'lodash';
import {
  NumberInput,
  SelectInput,
  FormDataConsumer,
  DisabledInput,
  required,
  number,
  minValue,
  translate,
  maxValue,
  FlexItemForward,
  CUSTOM,
  withDataProvider,
  HiddenInput,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';

class ConfigurationInfoInput extends Component {
  static sidechoices = [
    { id: 'all', name: 'all' },
    { id: 'frontend', name: 'frontend' },
    { id: 'backend', name: 'backend' },
  ];
  static propTypes = {
    id: PropTypes.string,
    idchoices: PropTypes.any,
    formRef: PropTypes.any,
    translate: PropTypes.any,
    dataProvider: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = { validatechoices: [] };
  }
  componentDidMount() {
    this.getAttributeChoices(this.props && this.props.id);
  }

  getAttributeChoices = async id => {
    this.props
      .dataProvider(CUSTOM, 'ctmconfigs', {
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
    if (id) result = this.props.translate(`resources.ctmconfigs.fields.ids.${id}`);
    else
      result =
        this.props &&
        this.props.idchoices &&
        this.props.idchoices.map(i => {
          let name = this.props.translate(`resources.ctmconfigs.fields.ids.${i.id}`);
          return { id: i.id, name: name };
        });
    return result;
  };

  translateSide = side => {
    let result = [];
    if (side) result = this.props.translate(`resources.ctmconfigs.fields.sides.${side}`);
    else
      result = ConfigurationInfoInput.sidechoices.map(i => {
        let side = this.props.translate(`resources.ctmconfigs.fields.sides.${i.id}`);
        return { id: i.id, name: side };
      });
    return result;
  };
  renderValue(formData, rest) {
    let type = this.getTypeById(formData.id);
    const { formRef } = this.props;
    let currentId =
      (formRef.current && formRef.current.props && formRef.current.props.values && formRef.current.props.values.id) ||
      formData.id ||
      '';
    const value = this.state.validatechoices && this.state.validatechoices.find(item => item.id === currentId);
    switch (type) {
      case 'GeoPoint': {
        return (
          <Grid middle="true" container spacing={2}>
            <Grid sm={6} xs={12} middle="true" item>
              <NumberInput
                source="value.lng"
                label={this.props.translate('resources.ctmconfigs.fields.values.lng')}
                {...rest}
              />
            </Grid>
            <Grid sm={6} xs={12} middle="true" item>
              <NumberInput
                source="value.lat"
                label={this.props.translate('resources.ctmconfigs.fields.values.lat')}
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
                label={this.props.translate('resources.ctmconfigs.fields.values.number')}
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
                label={this.props.translate('resources.ctmconfigs.flow.high')}
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
                  label={this.props.translate('resources.ctmconfigs.pressure.high')}
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
                  label={this.props.translate('resources.ctmconfigs.pressure.low')}
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
                  label={this.props.translate('resources.ctmconfigs.pressure.loss')}
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
                label={this.props.translate('resources.ctmconfigs.statisticMatStk.high')}
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
                label={this.props.translate('resources.ctmconfigs.statisticMatDMA.high')}
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
                  label={this.props.translate('resources.ctmconfigs.statisticMatLifeSpan.existTime')}
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
                  label={this.props.translate('resources.ctmconfigs.statisticMatLifeSpan.lessTime')}
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
      default: {
        return '';
      }
    }
  }
  render() {
    const { idchoices, ...rest } = this.props;
    return (
      <FlexItemForward {...rest}>
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
          <Grid middle item sm={6} xs={12}>
            <SelectInput
              source="side"
              choices={this.translateSide()}
              label={this.props.translate('resources.ctmconfigs.fields.side')}
              optionText={'name'}
              defaultValue={ConfigurationInfoInput.sidechoices[0].id}
            />
          </Grid>
          <Grid middle item sm={12}>
            <FormDataConsumer>
              {({ formData, ...rest }) => {
                return this.renderValue(formData, rest);
              }}
            </FormDataConsumer>
          </Grid>
        </Grid>
      </FlexItemForward>
    );
  }
}
let enhance = compose(withDataProvider, translate);
export default enhance(ConfigurationInfoInput);
