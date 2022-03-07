import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Edit,
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

class EditWaterSourceGroup extends Component {
  formRef = React.createRef();
  onChangeProvince = () => {};
  onChangeDistrict = () => {};
  onChangeWard = () => {};
  onChangeQuater = () => {};

  render() {
    const { props } = this;
    return (
      <Edit {...props} resource="watersourcegroups">
        <FlexForm formRef={this.formRef} style={{ flexGrow: 1 }} spacing={2} redirect="list" submitOnEnter={false}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" isRequired validate={[required()]} />
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
      </Edit>
    );
  }
}

EditWaterSourceGroup.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  staticcontext: PropTypes.any,
};
EditWaterSourceGroup.detaultProps = {
  hasList: true,
  hasShow: true,
};

const enhance = compose(translate);
export default enhance(EditWaterSourceGroup);

/*

<Grid middle item xs={12} sm={6}>
    <ReferenceInput source="provinceId" reference="geoprovinces" >
        <SelectInput source="name" />
    </ReferenceInput>
</Grid>
<Grid middle item xs={12} sm={6}>
    <ReferenceInput source="districtId" reference="geodistricts" >
    <SelectInput source="name" />
    </ReferenceInput>
    </Grid>
    <Grid middle item xs={12} sm={6}>
    <ReferenceInput source="wardId" reference="geowards" >
    <SelectInput source="name" />
    </ReferenceInput>
    </Grid>
    <Grid middle item xs={12} sm={6}>
    <ReferenceInput source="quaterId" reference="geoquarters" >
    <SelectInput source="name" />
    </ReferenceInput>
    </Grid>
*/
