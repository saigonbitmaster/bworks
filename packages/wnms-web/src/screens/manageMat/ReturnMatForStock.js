import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlexForm,
  required,
  translate,
  Edit,
  NumberInput,
  minValue,
  FormDataConsumer,
  maxValue,
  NumberWithUnitBaseMatTypeField,
  CUSTOM,
  withDataProvider,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import common from '../../util/common';
class ReturnMatForStock extends Component {
  save = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    // console.log(record);
    this.props.dataProvider(
      CUSTOM,
      'materialexports',
      {
        method: 'PUT',
        subUrl: `returnMatForStock/${record.id}`,
        body: { data: record },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };
  render() {
    const { translate, dataProvider, ...rest } = this.props;
    return (
      <Edit
        {...rest}
        resource="materialexports"
        title={translate('resources.materialexports.returnMatForStock')}
        save={this.save}
      >
        <FlexForm formRef={this.formRef} style={{ flexGrow: 1 }} spacing={2} redirect="list">
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <NumberWithUnitBaseMatTypeField
                source="currentValue"
                label={translate('resources.materialexports.fields.currentValue')}
                translate={translate}
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <FormDataConsumer>
                {({ formData }) => {
                  let label = `${translate('resources.materialstocks.returnValue')}`;
                  if (formData.type) {
                    let unit = translate(common.getUnitByMatType(formData.type));
                    label = `${label} (${unit})`;
                  }
                  return (
                    <NumberInput
                      source="returnValue"
                      label={label}
                      validate={[
                        required(),
                        minValue(0),
                        maxValue(
                          Number(formData.currentValue || 0),
                          formData.currentValue > 0
                            ? translate('resources.materialexports.error.lessAvailableVal')
                            : translate('resources.materialexports.error.availableValNotExist'),
                        ),
                      ]}
                      style={{ width: 250 }}
                    />
                  );
                }}
              </FormDataConsumer>
            </Grid>
          </Grid>
        </FlexForm>
      </Edit>
    );
  }
}
ReturnMatForStock.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
  dataProvider: PropTypes.func,
};

ReturnMatForStock.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
  hasDelete: false,
};

export default compose(translate, withDataProvider)(ReturnMatForStock);
