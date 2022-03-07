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
  PositionInput,
  BooleanInput,
  TextInput,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import config from '../../Config';
import get from 'lodash/get';

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
      .dataProvider(CUSTOM, 'srcconfigs', {
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
    let currentVal = idchoices.find(item => item.id == val);
    switch (val) {
      case 'MapDefaultZoom': {
        formRef.current.props.change('value', (currentVal && currentVal.min) || 0);
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
    if (id) result = this.props.translate(`resources.srcconfigs.fields.ids.${id}`);
    else
      result =
        this.props &&
        this.props.idchoices &&
        this.props.idchoices.map(i => {
          let name = this.props.translate(`resources.srcconfigs.fields.ids.${i.id}`);
          return { id: i.id, name: name };
        });
    return result;
  };

  translateSide = side => {
    let result = [];
    if (side) result = this.props.translate(`resources.srcconfigs.fields.sides.${side}`);
    else
      result = ConfigurationInfoInput.sidechoices.map(i => {
        let side = this.props.translate(`resources.srcconfigs.fields.sides.${i.id}`);
        return { id: i.id, name: side };
      });
    return result;
  };
  renderValue(formData, rest) {
    let type = this.getTypeById(get(formData, 'id', ''));
    const { formRef } = this.props;
    let currentId =
      (formRef.current && formRef.current.props && formRef.current.props.values && formRef.current.props.values.id) ||
      get(formData, 'id', '');
    const value = this.state.validatechoices && this.state.validatechoices.find(item => item.id === currentId);
    switch (type) {
      case 'GeoPoint': {
        return (
          <Grid middle="true" container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <PositionInput
                {...rest}
                source="subValue"
                inputProps={{ defaultCenter: config.mapDefaultCenter, defaultZoom: config.mapDefaultZoom }}
                label={this.props.translate('resources.srcconfigs.fields.values.position')}
              />
            </Grid>
          </Grid>
        );
      }
      case 'Sms': {
        return (
          <Grid middle="true" container spacing={2}>
            <Grid sm={6} xs={12} middle="true" item>
              <TextInput
                {...rest}
                source="value.phoneList"
                format={v => (v ? v.join() : null)}
                parse={v => v.split(',')}
                label={this.props.translate('resources.srcconfigs.fields.values.phoneList')}
              />
            </Grid>
            <Grid sm={6} xs={12} middle="true" item>
              <BooleanInput
                style={{ marginTop: '30px' }}
                source="value.isNotifySms"
                {...rest}
                label={this.props.translate('resources.srcconfigs.fields.values.isNotifySms')}
              />
            </Grid>
          </Grid>
        );
      }
      case 'Email': {
        return (
          <Grid middle="true" container spacing={2}>
            <Grid sm={6} xs={12} middle="true" item>
              <TextInput
                source="value.emailList"
                {...rest}
                label={this.props.translate('resources.srcconfigs.fields.values.emailList')}
                format={v => (v ? v.join() : null)}
                parse={v => v.split(',')}
              />
            </Grid>
            <Grid sm={6} xs={12} middle="true" item>
              <BooleanInput
                {...rest}
                style={{ marginTop: '30px' }}
                source="value.isNotifyEmail"
                label={this.props.translate('resources.srcconfigs.fields.values.isNotifyEmail')}
              />
            </Grid>
          </Grid>
        );
      }
      case 'Number': {
        if (!formData.value || typeof formData.value === 'number') {
          return (
            <Grid sm={6} xs={12} middle="true" item>
              <NumberInput
                key={type}
                source="value"
                label={this.props.translate('resources.srcconfigs.fields.values.number')}
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
                  label={this.props.translate('resources.srcconfigs.statisticMatLifeSpan.existTime')}
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
                  label={this.props.translate('resources.srcconfigs.statisticMatLifeSpan.lessTime')}
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
          {/* <Grid middle item sm={6} xs={12}>
            <SelectInput
              source="side"
              choices={this.translateSide()}
              label={this.props.translate('resources.srcconfigs.fields.side')}
              optionText={'name'}
              defaultValue={ConfigurationInfoInput.sidechoices[0].id}
            />
          </Grid> */}
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
