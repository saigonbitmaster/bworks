import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Create,
  FlexForm,
  NumberInput,
  TextInput,
  required,
  translate,
  SelectInput,
  ReferenceInput,
  EditorInput,
  FormDataConsumer,
  MapWaterSourceGroupInput,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import config from '../../Config';

class CreateWaterSourceGroup extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }
  render() {
    const { props } = this;
    return (
      <Create {...props} resource="watersourcegroups">
        <FlexForm formRef={this.formRef} style={{ flexGrow: 1 }} spacing={2} redirect="list" submitOnEnter={false}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <SelectInput
                source="type"
                choices={config.typeOfWaterSourceGroup}
                translateChoice={true}
                optionText="name"
                optionValue="id"
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="estimatedReserves" />
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
                    onChange={this.onChangeQuater}
                  >
                    <SelectInput optionText="name" />
                  </ReferenceInput>
                )}
              </FormDataConsumer>
            </Grid>
            <Grid middle item xs={12}>
              <MapWaterSourceGroupInput
                fullWidth
                source="boundary"
                validate={[required()]}
                enableCropPolygons={true}
                enableDeletePolygons={true}
                formRef={this.formRef}
              />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <EditorInput source="description" fullWidth />
            </Grid>
          </Grid>
        </FlexForm>
      </Create>
    );
  }
}

CreateWaterSourceGroup.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
};
CreateWaterSourceGroup.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(translate);
export default enhance(CreateWaterSourceGroup);
