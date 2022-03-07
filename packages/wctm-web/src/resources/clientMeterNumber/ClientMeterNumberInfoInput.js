import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import {
  NumberInput,
  DateInput,
  FlexItemForward,
  EditorInput,
  GET_ONE,
  required,
  ReferenceField,
  TextField,
  DateField,
  ImagePreviewInput,
  FormDataConsumer,
  CUSTOM,
  DateTimeInput,
  minValue,
} from 'ra-loopback3';
import has from 'lodash/has';
import get from 'lodash/get';
import moment from 'moment-timezone';

class ClientMeterNumberInfoInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlMeter: '',
      inputContainsInvalidDate: false,
      selectedTime: null,
      latestEinvoice: null,
    };
  }
  componentDidMount = async () => {
    const { record, forward, dataProvider } = this.props;
    if ((record && record.clientId) || (forward && forward.record && forward.record.clientId)) {
      dataProvider(GET_ONE, 'clients', {
        id: (record && record.clientId) || (forward.record && forward.record.clientId),
      }).then(({ data }) => {
        if (data) {
          this.setState({ clientName: data.name });
        }
      });
    }
    if ((record && record.toDate) || (forward && forward.record && forward.record.toDate)) {
      dataProvider(CUSTOM, 'EInvoiceData', {
        subUrl: 'getLatestEinvoice',
        method: 'GET',
        query: { month: (record && record.toDate) || (forward.record && forward.record.toDate) },
      }).then(({ data }) => {
        const latestEinvoice = data ? get(data, '$data') : data;
        const minDate = latestEinvoice ? moment(latestEinvoice) : moment();
        console.log(latestEinvoice)
        this.setState({ minDate, latestEinvoice });
      });
    }
  };

  generateErrorText = maxTime => {
    const { minDate } = this.state;
    return `Lớn hơn hoặc bằng ${minDate.format('DD/MM/YYYY HH:mm')} và nhỏ hơn hoặc bằng ${moment(maxTime).format(
      'DD/MM/YYYY HH:mm',
    )}`;
  };

  checkValidDate = date => {
    const { minDate } = this.state;
    const secondsTrimmedDate = moment(date)
      .seconds(0)
      .milliseconds(0);
    const secondsTrimmedMinDate = moment(minDate)
      .seconds(0)
      .milliseconds(0);
    const maxTime = moment()
      .seconds(0)
      .milliseconds(0);

    const selectedTime = moment(date);
    const changedState = {};
    let inputContainsInvalidDate = false;
    if (
      secondsTrimmedDate.valueOf() < secondsTrimmedMinDate.valueOf() ||
      secondsTrimmedDate.valueOf() > maxTime.valueOf()
    ) {
      inputContainsInvalidDate = true;
      changedState.maxTime = maxTime;
    }
    changedState.inputContainsInvalidDate = inputContainsInvalidDate;
    changedState.selectedTime = selectedTime;
    this.setState(changedState);
  };

  render() {
    const { translate, dataProvider, replaceInvoice, ...rest } = this.props;
    const { minDate, maxTime, selectedTime, inputContainsInvalidDate, latestEinvoice } = this.state;

    return (
      <FlexItemForward {...rest}>
        <Grid middle="true" container spacing={2}>
          <Grid middle="true" item xs={12} sm={6}>
            <ReferenceField
              source="clientId"
              reference="clients"
              linkType={false}
              label={'resources.clients.fields.code'}
            >
              <TextField source="code" />
            </ReferenceField>
          </Grid>
          <Grid middle="true" item xs={12} sm={6}>
            <ReferenceField source="clientId" reference="clients" linkType={false}>
              <TextField source="name" />
            </ReferenceField>
          </Grid>
          <Grid middle="true" item xs={12} sm={6}>
            <DateField source="fromDate" />
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
              source="previousNumber"
              label={translate('resources.clientmeternumbers.fields.previousNumber')}
            />
          </Grid>
          <Grid middle="true" item xs={12} sm={6}>
            <FormDataConsumer>
              {({ formData, ...rest }) =>
                has(formData, 'previousNumber') ? (
                  <NumberInput
                    validate={[required(), minValue(formData.previousNumber)]}
                    {...rest}
                    source="currentNumber"
                  />
                ) : null
              }
            </FormDataConsumer>
          </Grid>
          <Grid middle="true" item xs={12} sm={6}>
            <ImagePreviewInput
              titleimage={translate('generic.meterImage')}
              storage="CtmFiles"
              source="images"
              label={'generic.meterImage'}
              translate={translate}
              dataProvider={dataProvider}
            />
          </Grid>
          <Grid middle="true" item xs={12} sm={6}>
            {replaceInvoice && (
              <DateTimeInput
                validate={[required()]}
                label={translate('notification.einvoiceexport.invoiceIssuedDate')}
                source="invoiceIssuedDate"
                helperText={inputContainsInvalidDate && maxTime ? this.generateErrorText(maxTime) : ''}
                error={inputContainsInvalidDate && maxTime}
                onChange={this.checkValidDate}
                inputProps={{
                  value: selectedTime,
                  minDate,
                }}
              />
            )}
          </Grid>
          <Grid middle item xs={12} sm={6} />
          <Grid middle item xs={12} sm={6}>
            {replaceInvoice && latestEinvoice && (
              <DateTimeInput
                disabled
                label={translate('notification.einvoiceexport.latestEinvoice')}
                inputProps={{
                  value: minDate,
                }}
              />
            )}
          </Grid>
          <Grid middle="true" item xs={12} sm={12}>
            <EditorInput fullWidth source="description" />
          </Grid>
        </Grid>
      </FlexItemForward>
    );
  }
}
ClientMeterNumberInfoInput.propTypes = {
  hasEdit: PropTypes.any,
  hasCreate: PropTypes.any,
  hasShow: PropTypes.any,
  hasList: PropTypes.any,
  dataProvider: PropTypes.func,
  record: PropTypes.object,
  translate: PropTypes.func,
  forward: PropTypes.object,
  replaceInvoice: PropTypes.bool,
};
export default ClientMeterNumberInfoInput;
