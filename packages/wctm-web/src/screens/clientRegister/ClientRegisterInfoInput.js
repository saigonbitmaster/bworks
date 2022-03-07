import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import {
  TextInput,
  required,
  translate,
  EditorInput,
  FormDataConsumer,
  NumberInput,
  SelectInput,
  ReferenceInput,
  PositionInput,
  TagInput,
  maxLength,
  minValue,
  FlexItemForward,
  BooleanInput,
  ImagePreviewInput,
  withDataProvider,
} from 'ra-loopback3';
import { debounce } from 'lodash';
import config from '../../Config';

class ClientRegisterInfoInput extends Component {
  state = {
    locationCenterGeo: '',
  };
  onChangeAddress = () => {
    this.formatAddress();
  };
  onChangeQuater = () => {
    this.formatAddress();
  };
  onChangeWard = () => {
    this.formatAddress();
  };
  onChangeDistrict = () => {
    this.formatAddress();
  };
  onChangeProvince = () => {
    this.formatAddress();
  };
  formatAddress = debounce(() => {
    let { geodistricts, geowards, geoquarters, geoprovinces, formRef } = this.props;
    let { address, quarterId, wardId, districtId, provinceId } = formRef.current.props.values;
    let addressComponents = [];
    if (address) {
      addressComponents.push(address);
    }
    if (quarterId && geoquarters.data[quarterId]) {
      addressComponents.push(`${geoquarters.data[quarterId].prefix} ${geoquarters.data[quarterId].name}`);
    }
    if (wardId && geowards.data[wardId]) {
      addressComponents.push(`${geowards.data[wardId].prefix} ${geowards.data[wardId].name}`);
    }
    if (districtId && geodistricts.data[districtId]) {
      addressComponents.push(`${geodistricts.data[districtId].prefix} ${geodistricts.data[districtId].name}`);
    }
    if (provinceId && geoprovinces.data[provinceId]) {
      addressComponents.push(`${geoprovinces.data[provinceId].prefix} ${geoprovinces.data[provinceId].name}`);
    }
    formRef.current.props.change('formattedAddress', addressComponents.join(', '));

    // get center point geo
    let tmp = '';
    if (provinceId && geoprovinces.data[provinceId]) {
      tmp = geoprovinces.data[provinceId].position;
    }
    if (districtId && geodistricts.data[districtId]) {
      tmp = geodistricts.data[districtId].position;
    }
    if (wardId && geowards.data[wardId]) {
      tmp = geowards.data[wardId].position;
    }
    if (quarterId && geoquarters.data[quarterId]) {
      tmp = geoquarters.data[quarterId].position;
    }
    this.setState({ locationCenterGeo: tmp });
  }, 300);
  onChangeStatusSurvey = (e, val) => {
    if (!val) {
      // false
      this.props.formRef.current.props.change('resultSurvey', false);
    }
  };
  onChangeResultSurvey = (e, val) => {
    if (val) {
      // true
      this.props.formRef.current.props.change('statusSurvey', true);
    }
  };
  render() {
    const {
      geodistricts,
      geowards,
      geoquarters,
      geoprovinces,
      dataProvider,
      formRef,
      translate,
      dispatch,
      ...props
    } = this.props;
    return (
      <FlexItemForward {...props}>
        <Grid middle container spacing={2}>
          <Grid middle item xs={12} sm={6}>
            <TextInput source="name" validate={[required()]} />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <SelectInput
              source="status"
              choices={config.client.actionChoices}
              validate={[required()]}
              disabled
              defaultValue={'NEW'}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <TextInput source="address" onChange={this.onChangeAddress} />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <ReferenceInput
              reference="geoprovinces"
              source="provinceId"
              allowEmpty
              validate={[required()]}
              onChange={this.onChangeProvince}
            >
              <SelectInput optionText="name" />
            </ReferenceInput>
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <FormDataConsumer>
              {({ formData, staticcontext, ...rest }) => (
                <ReferenceInput
                  key={formData.provinceId}
                  reference="geodistricts"
                  source="districtId"
                  {...rest}
                  // filterToQuery={text => ({ $text: { search: text } })}
                  filter={{ provinceId: formData.provinceId }}
                  allowEmpty
                  validate={[required()]}
                  onChange={this.onChangeDistrict}
                  disabled={!formData.provinceId}
                >
                  <SelectInput optionText="name" />
                </ReferenceInput>
              )}
            </FormDataConsumer>
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <FormDataConsumer>
              {({ formData, staticcontext, ...rest }) => (
                <ReferenceInput
                  key={formData.provinceId}
                  reference="geowards"
                  source="wardId"
                  {...rest}
                  filter={{ districtId: formData.districtId }}
                  // filterToQuery={text => ({ $text: { search: text } })}
                  allowEmpty
                  validate={[required()]}
                  onChange={this.onChangeWard}
                  disabled={!formData.provinceId}
                >
                  <SelectInput optionText="name" />
                </ReferenceInput>
              )}
            </FormDataConsumer>
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <FormDataConsumer>
              {({ formData, staticcontext, ...rest }) => (
                <ReferenceInput
                  key={formData.provinceId}
                  disabled={!formData.wardId}
                  reference="geoquarters"
                  source="quarterId"
                  {...rest}
                  filter={{ wardId: formData.wardId }}
                  // filterToQuery={text => ({ $text: { search: text } })}
                  allowEmpty
                  validate={[required()]}
                  onChange={this.onChangeQuater}
                >
                  <SelectInput optionText="name" />
                </ReferenceInput>
              )}
            </FormDataConsumer>
          </Grid>
          <Grid item middle xs={12} sm={12}>
            <TextInput source="formattedAddress" fullWidth={true} disabled />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <PositionInput
              source="position"
              validate={[required()]}
              inputProps={{ defaultCenter: this.state.locationCenterGeo, defaultZoom: 15 }}
              style={{ paddingTop: 16 }}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <NumberInput source="phoneNumber" />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <SelectInput source="type" choices={config.client.clientTypeChoices} validate={[required()]} />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <NumberInput source="familyCount" validate={[required(), minValue(1)]} />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <NumberInput source="memberCount" validate={[required(), minValue(1)]} />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <SelectInput
              source="buyerIdType"
              validate={[required()]}
              choices={config.eInvoice.buyerIdTypeChoices}
              translateChoice={true}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <ImagePreviewInput
              titleimage={translate('resources.clients.fields.images')}
              storage="CtmFiles"
              source="images"
              translate={translate}
              dataProvider={dataProvider}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <TextInput source="buyerIdNo" validate={[maxLength(20)]} />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <TextInput source="buyerFaxNumber" validate={[maxLength(20)]} />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <TextInput source="buyerEmail" validate={[maxLength(50)]} type="email" />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <TextInput source="buyerBankName" validate={[maxLength(100)]} />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <TextInput source="buyerBankAccount" validate={[maxLength(20)]} />
          </Grid>
          <Grid middle item xs={12} sm={6} style={{ display: 'inline-flex' }}>
            <BooleanInput source="statusSurvey" onChange={this.onChangeStatusSurvey} />
            <BooleanInput source="resultSurvey" onChange={this.onChangeResultSurvey} />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <TagInput source="tag" />
          </Grid>
          <Grid middle item xs={12} sm={12}>
            <EditorInput fullWidth source="description" />
          </Grid>
        </Grid>
      </FlexItemForward>
    );
  }
}

ClientRegisterInfoInput.propTypes = {
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
  staticcontext: PropTypes.any,
  geodistricts: PropTypes.object,
  geowards: PropTypes.object,
  geoquarters: PropTypes.object,
  geoprovinces: PropTypes.object,
  location: PropTypes.object,
  formRef: PropTypes.any,
  dispatch: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    geodistricts: state.admin.resources.geodistricts,
    geowards: state.admin.resources.geowards,
    geoquarters: state.admin.resources.geoquarters,
    geoprovinces: state.admin.resources.geoprovinces,
  };
};
export default compose(withDataProvider, translate, connect(mapStateToProps))(ClientRegisterInfoInput);
