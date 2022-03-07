import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlexForm,
  TextInput,
  NumberInput,
  DateInput,
  minValue,
  required,
  SelectInput,
  ReferenceInput,
  translate,
  MaterialSelectInput,
  FormDataConsumer,
  Edit,
  CUSTOM,
  withDataProvider,
  CustomReferenceField,
  NumberWithUnitBaseMatTypeField,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import get from 'lodash/get';
import common from '../../util/common';
const EditTitle = ({ record: { name } }) => <span>{name}</span>;
EditTitle.propTypes = {
  record: PropTypes.object,
};
class EditMatStock extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      exportValue: 0,
    };
  }
  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  save = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    record.exportValue = this.state.exportValue;
    // console.log(record);
    this.props.dataProvider(
      CUSTOM,
      'materialstocks',
      {
        method: 'PUT',
        subUrl: `editMatStock/${record.id}`,
        body: { data: record },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };
  getSumExportStock = () => {
    if (this.props.id) {
      return this.props
        .dataProvider(CUSTOM, 'materialexports', {
          subUrl: 'getSumExportStock',
          query: { stockId: this.props.id },
        })
        .then(res => {
          let exportValue = get(res, 'data.value') || 0;
          let type = get(res, 'data.type') || '';
          this.setState({ exportValue });
          return { exportValue, type, isMounted: this._isMounted };
        });
    }
  };
  render() {
    const { translate, dataProvider, ...rest } = this.props;

    return (
      <Edit {...rest} resource="materialstocks" redirect="/manageMaterial" title={<EditTitle />} save={this.save}>
        <FlexForm style={{ flexGrow: 1 }} spacing={2}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={12}>
              <MaterialSelectInput source={'type'} validate={[required()]} disabled />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <FormDataConsumer>
                {({ formData, staticcontext, ...rest }) => {
                  let filter = undefined;
                  if (formData.type) {
                    filter = { type: formData.type };
                  }
                  return (
                    <ReferenceInput
                      key={formData.type}
                      reference="materialdetailtypes"
                      source="detailTypeId"
                      {...rest}
                      filter={filter}
                      allowEmpty
                      label={translate('resources.materialstocks.selectMat')}
                      validate={[required()]}
                      disabled
                    >
                      <SelectInput optionText="name" />
                    </ReferenceInput>
                  );
                }}
              </FormDataConsumer>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <CustomReferenceField
                label={this.props.translate('resources.materialexports.fields.exportValue')}
                source="id"
                reference="materialexports"
                customData={this.getSumExportStock}
                dataProvider={dataProvider}
                linkType={false}
              >
                <NumberWithUnitBaseMatTypeField source="exportValue" translate={translate} />
              </CustomReferenceField>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <FormDataConsumer>
                {({ formData }) => {
                  let label = `${translate('resources.materialstocks.fields.initValue')}`;
                  if (formData.type) {
                    let unit = translate(common.getUnitByMatType(formData.type));
                    label = `${label} (${unit})`;
                  }
                  return (
                    <NumberInput
                      label={label}
                      source="initValue"
                      validate={[required(), minValue(0)]}
                      style={{ width: 250 }}
                    />
                  );
                }}
              </FormDataConsumer>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="egeTime" validate={[required(), minValue(0)]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="usedTime" validate={[required(), minValue(0)]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateInput source="dom" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateInput source="importDate" validate={[required()]} />
            </Grid>
          </Grid>
        </FlexForm>
      </Edit>
    );
  }
}
EditMatStock.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
  dataProvider: PropTypes.func,
  id: PropTypes.any,
};

EditMatStock.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default compose(translate, withDataProvider)(EditMatStock);
