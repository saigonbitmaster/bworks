import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import {
  // FlexForm,
  Edit,
  TextInput,
  required,
  translate,
  EditorInput,
  FormDataConsumer,
  NumberInput,
  SelectInput,
  ReferenceInput,
  TagInput,
  maxLength,
  PositionInput,
  CUSTOM,
  withDataProvider,
  ImagePreviewInput,
  TabbedFlexForm,
  FlexFormTab,
  MetaFields,
  withTranslate,
  Button,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import omit from 'lodash/omit';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { getFormValues, change } from 'redux-form';
import config from '../../Config';

@withDataProvider
class EditClient extends Component {
  formRef = React.createRef();
  state = {
    locationCenterGeo: '',
  };

  componentDidUpdate = () => {
    if (
      this.props.record &&
      !this.props.record.dmaLevel1Id &&
      this.props.record.dmaId &&
      this.props.dmas[this.props.record.dmaId]
    ) {
      const { change, record, dmas } = this.props;
      change('record-form', 'dmaLevel1Id', dmas[record.dmaId].parentDmaId);
    }
  };

  onAddressChange = () => {
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
    let { address, quarterId, wardId, districtId, provinceId } = this.formRef.current.props.values;
    let { geodistricts, geowards, geoquarters, geoprovinces } = this.props;
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
    this.formRef.current.props.change('formattedAddress', addressComponents.join(', '));

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
  }, 200);

  formatLocation = position => {
    return typeof position === 'object' ? `${position.lat || '_'},${position.lng || '_'}` : '';
  };

  refreshDmaInput = () => this.props.change('record-form', 'dmaId', '');

  save = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    const omittedField = 'dmaLevel1Id';
    this.props.dataProvider(
      CUSTOM,
      'clients',
      {
        method: 'PUT',
        subUrl: `editClient/${record.id}`,
        body: { data: omit(record, omittedField) },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };

  render() {
    const { dispatch, dataProvider, ...props } = this.props;
    // console.log(this.props);
    return (
      <Edit {...props} resource="clients" save={this.save}>
        <TabbedFlexForm style={{ flexGrow: 1 }} spacing={2} formRef={this.formRef}>
          <FlexFormTab key={1} label={props.translate('generic.info')}>
            <Grid middle container spacing={2}>
              <Grid middle item xs={12} sm={6}>
                <TextInput source="code" validate={[required()]} />
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <TextInput source="name" validate={[required()]} />
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <TextInput source="contractNo" validate={[required()]} />
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <TextInput source="taxNo" />
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <SelectInput source="status" choices={config.client.statusChoices} validate={[required()]} />
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <TextInput source="address" onChange={this.onAddressChange} />
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
                  {({ formData, staticcontext, ...rest }) => {
                    let filter = undefined;
                    if (formData.provinceId) {
                      filter = { provinceId: formData.provinceId };
                      return (
                        <ReferenceInput
                          key={formData.provinceId}
                          reference="geodistricts"
                          source="districtId"
                          {...rest}
                          filter={filter}
                          allowEmpty
                          validate={[required()]}
                          onChange={this.onChangeDistrict}
                        >
                          <SelectInput optionText="name" />
                        </ReferenceInput>
                      );
                    } else {
                      return (
                        <SelectInput
                          source="districtId"
                          label={props.translate('resources.clientregisters.fields.districtId')}
                          validate={[required()]}
                          disabled
                        />
                      );
                    }
                  }}
                </FormDataConsumer>
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <FormDataConsumer>
                  {({ formData, staticcontext, ...rest }) => {
                    let filter = undefined;
                    if (formData.districtId) {
                      filter = { districtId: formData.districtId };
                      return (
                        <ReferenceInput
                          key={formData.provinceId}
                          reference="geowards"
                          source="wardId"
                          {...rest}
                          filter={filter}
                          allowEmpty
                          validate={[required()]}
                          onChange={this.onChangeWard}
                        >
                          <SelectInput optionText="name" />
                        </ReferenceInput>
                      );
                    } else {
                      return (
                        <SelectInput
                          source="wardId"
                          label={props.translate('resources.clientregisters.fields.wardId')}
                          validate={[required()]}
                          disabled
                        />
                      );
                    }
                  }}
                </FormDataConsumer>
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <FormDataConsumer>
                  {({ formData, staticcontext, ...rest }) => {
                    let filter = undefined;
                    if (formData.wardId) {
                      filter = { wardId: formData.wardId };
                      return (
                        <ReferenceInput
                          key={formData.provinceId}
                          reference="geoquarters"
                          source="quarterId"
                          {...rest}
                          filter={filter}
                          allowEmpty
                          onChange={this.onChangeQuater}
                        >
                          <SelectInput optionText="name" />
                        </ReferenceInput>
                      );
                    } else {
                      return (
                        <SelectInput
                          source="quarterId"
                          label={props.translate('resources.clientregisters.fields.quarterId')}
                          validate={[required()]}
                          disabled
                        />
                      );
                    }
                  }}
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
                />
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <TextInput source="phoneNumber" />
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <ReferenceInput reference="waterproviders" source="providerId" allowEmpty validate={[required()]}>
                  <SelectInput optionText="name" />
                </ReferenceInput>
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <SelectInput source="type" choices={config.client.clientTypeChoices} validate={[required()]} />
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <NumberInput source="familyCount" validate={[required()]} />
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <NumberInput source="memberCount" validate={[required()]} />
              </Grid>
              {/* <Grid middle item xs={12} sm={6}>
                <NumberInput source="quotaWaterPerPerson" validate={[required()]} />
              </Grid> */}
              <Grid middle item xs={12} sm={6}>
                <ReferenceInput
                  reference="dmas"
                  source="dmaLevel1Id"
                  label={props.translate('generic.dmaLevel1')}
                  allowEmpty
                  filter={{ level: 1 }}
                  onChange={this.refreshDmaInput}
                >
                  <SelectInput />
                </ReferenceInput>
                <FormDataConsumer>
                  {({ formData, ...rest }) => (
                    <ReferenceInput
                      reference="dmas"
                      source="dmaId"
                      allowEmpty
                      filter={{ parentDmaId: formData.dmaLevel1Id }}
                      disabled={!formData.dmaLevel1Id}
                      label={props.translate('generic.dmaLevel2')}
                      {...rest}
                    >
                      <SelectInput {...rest} />
                    </ReferenceInput>
                  )}
                </FormDataConsumer>
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <SelectInput source="buyerIdType" choices={config.eInvoice.buyerIdTypeChoices} />
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
              <Grid middle item xs={12} sm={6}>
                <TagInput source="tag" />
              </Grid>
              <Grid middle item xs={12} sm={12}>
                <EditorInput fullWidth source="description" />
              </Grid>
            </Grid>
          </FlexFormTab>
          <FlexFormTab key={2} label={props.translate('generic.meta')}>
            <MetaFields />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}
EditClient.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
  geodistricts: PropTypes.object,
  geowards: PropTypes.object,
  geoquarters: PropTypes.object,
  geoprovinces: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.any,
  dataProvider: PropTypes.func,
};
const mapStateToProps = state => {
  return {
    geodistricts: state.admin.resources.geodistricts,
    geowards: state.admin.resources.geowards,
    geoquarters: state.admin.resources.geoquarters,
    geoprovinces: state.admin.resources.geoprovinces,
    dmas: state.admin.resources.dmas.data,
    record: getFormValues('record-form')(state),
  };
};
EditClient.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
export default compose(withTranslate, connect(mapStateToProps, { change }))(EditClient);
