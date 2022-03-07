import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  NumberInput,
  DateInput,
  EditorInput,
  withDataProvider,
  CUSTOM,
  required,
  Create,
  minValue,
  FlexForm,
  ReferenceField,
  DateField,
  TextField,
  translate,
  ImagePreviewInput,
  FormDataConsumer,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import get from 'lodash/get';
import moment from 'moment-timezone';

class ClientMeterNumberCreate extends Component {
  constructor(props) {
    super(props);
    const { clientId, month: monthYear } = props.match.params;
    this.state = {
      clientId,
      monthYear,
      data: null,
    };
  }
  async componentDidMount() {
    const { dataProvider, basePath } = this.props;
    const { clientId, monthYear } = this.state;
    let data = await this.getDefaultData(clientId, monthYear, dataProvider, basePath);
    if (!data) this.props.push(`${basePath}`);
    this.setState({ data });
  }
  getDefaultData = async (clientId, monthYear, dataProvider) => {
    const { data } = await dataProvider(CUSTOM, 'clientmeternumbers', {
      subUrl: `getDefaultNewMonth/${clientId}/${monthYear}`,
      method: 'get',
    });
    if (!data) {
      return false;
    }
    return data;
  };
  save = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    this.props.dataProvider(
      CUSTOM,
      'clientmeternumbers',
      {
        method: 'POST',
        subUrl: 'writeNewMonth',
        body: { data: record },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };
  render() {
    const { dataProvider, dispatch, hasCreate, hasEdit, hasList, hasShow, push, title, ...rest } = this.props;
    const { data } = this.state;
    let customTitle = title;
    if (get(data, 'isChangeMeter') === true) {
      customTitle = `${title} (${this.props.translate('resources.clientmeternumbers.changeMeter')})`;
    }
    return (
      data && (
        <Create {...rest} resource="clientmeternumbers" save={this.save} hasList title={customTitle}>
          <FlexForm defaultValue={data} record={data}>
            <Grid middle="true" container spacing={2}>
              <Grid middle="true" item xs={12} sm={6}>
                <ReferenceField
                  record={data}
                  source="clientId"
                  reference="clients"
                  linkType={false}
                  label={this.props.translate('resources.clientmeternumbers.fields.code')}
                >
                  <TextField source="code" />
                </ReferenceField>
              </Grid>
              <Grid middle="true" item xs={12} sm={6}>
                <ReferenceField
                  record={data}
                  source="clientId"
                  reference="clients"
                  linkType={false}
                  label={this.props.translate('resources.clientmeternumbers.fields.name')}
                >
                  <TextField source="name" />
                </ReferenceField>
              </Grid>
              <Grid middle="true" item xs={12} sm={6}>
                <DateField record={data} validate={[required()]} source="fromDate" />
              </Grid>
              <Grid middle="true" item xs={12} sm={6}>
                <FormDataConsumer>
                  {({ formData, ...rest }) =>
                    formData.fromDate && (
                      <DateInput
                        validate={[required()]}
                        source="toDate"
                        {...rest}
                        inputProps={{
                          minDate: moment(formData.fromDate)
                            .add(1, 'month')
                            .startOf('month')
                            .toDate(),
                          maxDate: moment(formData.fromDate)
                            .add(1, 'month')
                            .endOf('month')
                            .toDate(),
                        }}
                      />
                    )
                  }
                </FormDataConsumer>
              </Grid>
              <Grid middle="true" item xs={12} sm={6}>
                <TextField
                  record={data}
                  source="previousNumber"
                  label={
                    get(data, 'isChangeMeter') === true
                      ? this.props.translate('resources.clientmeternumbers.fields.newMeterNumberWhenChange')
                      : this.props.translate('resources.clientmeternumbers.fields.previousNumber')
                  }
                />
              </Grid>
              <Grid middle="true" item xs={12} sm={6}>
                <NumberInput validate={[required(), minValue(data.previousNumber || 0)]} source="currentNumber" />
              </Grid>
              <Grid middle="true" item xs={12} sm={6}>
                <ImagePreviewInput
                  titleimage={translate('generic.meterImage')}
                  storage="CtmFiles"
                  source="images"
                  translate={translate}
                  label={'generic.meterImage'}
                  dataProvider={dataProvider}
                />
              </Grid>
              <Grid middle="true" item xs={12} sm={12}>
                <EditorInput fullWidth source="description" />
              </Grid>
            </Grid>
          </FlexForm>
        </Create>
      )
    );
  }
}

ClientMeterNumberCreate.propTypes = {
  dataProvider: PropTypes.func,
  push: PropTypes.func,
  match: PropTypes.object,
  basePath: PropTypes.any,
  translate: PropTypes.func,
};

const enhance = compose(withDataProvider, connect(null, { push }), translate);
export default enhance(ClientMeterNumberCreate);
