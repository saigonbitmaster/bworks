import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import {
  TextInput,
  required,
  regex,
  translate,
  NumberInput,
  SelectInput,
  ReferenceInput,
  FlexItemForward,
  DateInput,
  PositionInput,
  FormDataConsumer,
  maxLength,
  TagInput,
  EditorInput,
  ImagePreviewInput,
  withDataProvider,
} from 'ra-loopback3';
import { compose } from 'recompose';
import { debounce } from 'lodash';
// import { formatClientType } from '../../../src/util/formatShow';
import config from '../../Config';
// const mapStateToProps = state => {
//   return {
//     geodistricts: state.admin.resources.geodistricts,
//     geowards: state.admin.resources.geowards,
//     geoquarters: state.admin.resources.geoquarters,
//     geoprovinces: state.admin.resources.geoprovinces,
//   };
// };

class ClientRegisterInfoInput extends Component {
  formRef = React.createRef();
  state = {
    locationCenterGeo: '',
  };

  componentDidMount = () => {};

  // UNSAFE_componentWillMount() {
  //   // console.log('will mount', this.props);
  //   let { record } = this.props;
  //   if (record && record.images && record.images.length) {
  //     // eslint-disable-next-line
  //     record.images.map((key, index) => {
  //       let item = record.images[index];
  //       this.getPathFileFromAWS(item.url);
  //     });
  //   }
  // }
  // getPathFileFromAWS = async url => {
  //   // console.log('>>>url', url);
  //   // const { storage } = this.props;
  //   let fileName = url.substring(url.lastIndexOf('/') + 1);
  //   let res = await this.props.dataProvider(URL_ONLY, 'CtmFiles', { subUrl: `download/${fileName}` });
  //   // console.log('>>>res', res);
  //   if (res.data.url) {
  //     // let tmp = this.state.urlImages;
  //     // tmp.push(res.data.url);
  //     // console.log('getPathFileFromAWS 1 ', res.data.url);
  //     this.setState({ urlImages: res.data.url });
  //     // console.log('getPathFileFromAWS 2', tmp);
  //   } else {
  //     this.setState({ urlImages: '' });
  //   }
  // };
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
      tmp = geoprovinces.data[provinceId].location;
    }
    if (districtId && geodistricts.data[districtId]) {
      tmp = geodistricts.data[districtId].location;
    }
    if (wardId && geowards.data[wardId]) {
      tmp = geowards.data[wardId].location;
    }
    if (quarterId && geoquarters.data[quarterId]) {
      tmp = geoquarters.data[quarterId].location;
    }
    this.setState({ locationCenterGeo: tmp });
  }, 200);

  render() {
    const {
      dataProvider,
      geodistricts,
      geowards,
      geoquarters,
      geoprovinces,
      formRef,
      translate,
      subFlex,
      ...props
    } = this.props;
    // console.log('main: ', props);
    const { hasList, hasCreate, hasEdit, hasShow, ...rest } = props;
    return (
      <FlexItemForward {...props}>
        <Grid middle container spacing={2}>
          <Grid middle item xs={12} sm={6}>
            <TextInput
              source="code"
              validate={[required(), regex(/^\w{1,}$/, translate('resources.clientregisters.validation.code'))]}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <TextInput source="name" validate={[required()]} />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <TextInput
              source="contractNo"
              validate={[required(), regex(/^\w{1,}$/, translate('resources.clientregisters.validation.contractNo'))]}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <TextInput source="taxNo" />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <DateInput
              source="contractDate"
              validate={[required()]}
              inputProps={{ maxDate: new Date() }}
              onBlur={e => e.preventDefault()}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <ReferenceInput reference="formulas" source="formulaId" {...rest} validate={[required()]}>
              <SelectInput optionText="name" />
            </ReferenceInput>
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
                      label={translate('resources.clientregisters.fields.districtId')}
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
                      label={translate('resources.clientregisters.fields.wardId')}
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
                      label={translate('resources.clientregisters.fields.quarterId')}
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
              fullWidth
              validate={[required()]}
              inputProps={{ defaultCenter: this.state.locationCenterGeo, defaultZoom: 15 }}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <NumberInput source="phoneNumber" />
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
      </FlexItemForward>
    );
  }
}

ClientRegisterInfoInput.propTypes = {
  translate: PropTypes.func,
  staticcontext: PropTypes.any,
  geodistricts: PropTypes.object,
  geowards: PropTypes.object,
  geoquarters: PropTypes.object,
  geoprovinces: PropTypes.object,
  location: PropTypes.object,
  formRef: PropTypes.any,
  dataProvider: PropTypes.func,
  subFlex: PropTypes.any,
};
const mapStateToProps = state => {
  return {
    record: state.form['record-form'].values,
    geodistricts: state.admin.resources.geodistricts,
    geowards: state.admin.resources.geowards,
    geoquarters: state.admin.resources.geoquarters,
    geoprovinces: state.admin.resources.geoprovinces,
  };
};
export default compose(withDataProvider, translate, connect(mapStateToProps))(ClientRegisterInfoInput);
