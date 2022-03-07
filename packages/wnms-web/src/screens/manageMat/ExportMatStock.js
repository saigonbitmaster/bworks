import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlexForm,
  Create,
  TextInput,
  DateInput,
  required,
  SelectInput,
  ReferenceInput,
  translate,
  MaterialSelectInput,
  FormDataConsumer,
  NumberInput,
  minValue,
  maxValue,
  CUSTOM,
  GET_ONE,
  HiddenInput,
  withDataProvider,
  ListButton,
  CardActions,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { push as pushAction } from 'react-router-redux';
import common from '../../util/common';
class RawPostActions extends Component {
  render() {
    const { staticContext, hasList, push, ...rest } = this.props;
    return (
      <CardActions>
        <ListButton {...rest} basePath={'/manageMaterial'} />
      </CardActions>
    );
  }
}
RawPostActions.propTypes = {
  push: PropTypes.func,
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  staticContext: PropTypes.any,
};
const PostActions = connect(null, {
  push: pushAction,
})(RawPostActions);

class ExportMatStock extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }
  updateFieldRemainValueStock = stockId => {
    this.props.dataProvider(CUSTOM, 'materialexports/getValueRemainStock', { query: { stockId } }).then(res => {
      if (this.formRef) {
        this.formRef.current.props.change('remainValueStock', res.data.value);
      }
    });
  };

  setFormValue = (key, value) => {
    if (this.formRef) {
      this.formRef.current.props.change(key, value);
    }
  };

  onMaterialChange = () => {
    // this.setFormValue('detailTypeId', '');
    // this.setFormValue('stockId', '');
    this.formRef.current.props.reset();
  };

  onTypeChange = () => {
    this.setFormValue('stockId', '');
    this.setFormValue('remainValueStock', '');
    this.setFormValue('exportValue', '');
  };

  onStockChange = (e, stockId) => {
    this.setFormValue('exportValue', '');
    this.updateFieldRemainValueStock(stockId);
    if (stockId) {
      this.props.dataProvider(GET_ONE, 'materialstocks', { id: stockId }).then(res => {
        if (res && res.data && res.data.name) {
          this.setFormValue('name', res.data.name);
        }
      });
    } else {
      this.setFormValue('name', '');
    }
  };
  save = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    // console.log(record);
    this.props.dataProvider(
      CUSTOM,
      'materialexports',
      {
        method: 'POST',
        subUrl: 'createExportingStock',
        body: { data: record },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };

  render() {
    const { translate, dataProvider, staticContext, hasList, push, ...rest } = this.props;
    return (
      <Create
        {...rest}
        title={'generic.manageMat.exportStock'}
        resource="materialexports"
        actions={<PostActions {...rest} />}
        basePath="/manageMaterial"
        save={this.save}
      >
        <FlexForm formRef={this.formRef} style={{ flexGrow: 1 }} spacing={2} defaultValue={{ exportDate: new Date() }}>
          <HiddenInput source="name" />
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <MaterialSelectInput
                allowEmpty
                source={'type'}
                onChange={this.onMaterialChange}
                validate={[required()]}
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <FormDataConsumer>
                {({ formData, staticcontext, ...rest }) => {
                  let filter = undefined;
                  if (formData.type) {
                    filter = { type: formData.type };
                    return (
                      <ReferenceInput
                        key={formData.type}
                        reference="materialdetailtypes"
                        source="detailTypeId"
                        {...rest}
                        filter={filter}
                        allowEmpty
                        label={translate('resources.materialexports.selectMat')}
                        validate={[required()]}
                        onChange={this.onTypeChange}
                      >
                        <SelectInput optionText="name" />
                      </ReferenceInput>
                    );
                  } else {
                    return (
                      <TextInput
                        source="detailTypeId"
                        label={translate('resources.materialstocks.selectMat')}
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
                  let filter = { type: formData.type || '', detailTypeId: formData.detailTypeId || '' };
                  return (
                    <ReferenceInput
                      key={formData.type + formData.detailTypeId}
                      reference="materialstocks"
                      source="stockId"
                      {...rest}
                      filter={filter}
                      allowEmpty
                      label={translate('resources.materialexports.fields.name')}
                      validate={[required()]}
                      onChange={this.onStockChange}
                    >
                      <SelectInput optionText="name" />
                    </ReferenceInput>
                  );
                }}
              </FormDataConsumer>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <FormDataConsumer>
                {({ formData }) => {
                  let label = `${translate('resources.materialstocks.fields.remainValueStock')}`;
                  if (formData.type) {
                    let unit = translate(common.getUnitByMatType(formData.type));
                    label = `${label} (${unit})`;
                  }
                  return <TextInput source="remainValueStock" label={label} disabled={true} style={{ width: 250 }} />;
                }}
              </FormDataConsumer>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <FormDataConsumer>
                {({ formData }) => {
                  let label = `${translate('resources.materialexports.fields.exportValue')}`;
                  if (formData.type) {
                    let unit = translate(common.getUnitByMatType(formData.type));
                    label = `${label} (${unit})`;
                  }
                  return (
                    <NumberInput
                      key={formData.remainValueStock}
                      source="exportValue"
                      label={label}
                      validate={[
                        required(),
                        minValue(1),
                        maxValue(
                          Number(formData.remainValueStock || 0),
                          formData.remainValueStock > 0
                            ? translate('resources.materialexports.error.lessRemainValStk')
                            : translate('resources.materialexports.error.remainValStkNotExist'),
                        ),
                      ]}
                      style={{ width: 250 }}
                    />
                  );
                }}
              </FormDataConsumer>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateInput source="exportDate" validate={[required()]} />
            </Grid>
          </Grid>
        </FlexForm>
      </Create>
    );
  }
}
ExportMatStock.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
  dataProvider: PropTypes.func,
  basePath: PropTypes.string,
  staticContext: PropTypes.any,
  push: PropTypes.func,
};

ExportMatStock.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default compose(translate, withDataProvider)(ExportMatStock);
