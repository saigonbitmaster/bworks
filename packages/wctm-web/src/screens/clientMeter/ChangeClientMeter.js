import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlexForm,
  Create,
  TextInput,
  required,
  translate,
  //  NumberInput,
  SelectInput,
  ReferenceInput,
  DateInput,
  //  minValue,
  QrCodeInput,
  CUSTOM,
  withDataProvider,
  FormDataConsumer,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import moment from 'moment-timezone';
import omit from 'lodash/omit';
import compose from 'recompose/compose';
import RequestExecuteToolbar from './RequestExecuteToolbar';

class ChangeClientMeter extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  state = {
    minDate: null,
    qrCode: null,
  };

  componentDidMount = async () => {
    const {
      match: {
        params: { clientId },
      },
      dataProvider,
    } = this.props;

    // Get currently used QR code
    const {
      data: { qrCode: existingQrCode },
    } = await dataProvider(CUSTOM, `Clients/${clientId}/meter`, { method: 'GET' });
    this.setState({ qrCode: existingQrCode });

    const { data } = await dataProvider(CUSTOM, `Clients/${clientId}`, { method: 'GET' });

    const {
      data: [meterNumber],
    } = await dataProvider(CUSTOM, 'ClientMeterNumbers', {
      filter: { where: { id: `${clientId}-${moment(data.termMeterNumber).format('YYYY-MM')}` } },
    });
    if (meterNumber) {
      this.setState({ minDate: moment(meterNumber.toDate).toDate() });
    } else {
      const {
        data: { setupDate },
      } = await dataProvider(CUSTOM, `Clients/${clientId}/meter`, {
        method: 'GET',
      });
      this.setState({ minDate: moment(setupDate).toDate() });
    }
  };

  save = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    const omittedField = 'dmaLevel1Id';
    this.props.dataProvider(
      CUSTOM,
      'clientrequests',
      {
        method: 'POST',
        subUrl: 'replaceMeterRequest',
        body: { data: omit(record, omittedField) },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };

  render() {
    const { dispatch, translate, dataProvider, ...props } = this.props;
    const {
      match: {
        params: { clientId },
      },
    } = this.props;
    const { minDate, qrCode } = this.state;

    return (
      <Create
        {...props}
        save={this.save}
        resource="clientrequests"
        title={translate('resources.clientmeters.titleChangeClientMeter')}
      >
        <FlexForm
          defaultValue={{
            clientId,
            title: translate('resources.clientmeters.titleChangeClientMeter'),
            setupDate: new Date(),
            type: 'REPLACE',
            qrCode,
          }}
          formRef={this.formRef}
          redirect="list"
          toolbar={<RequestExecuteToolbar />}
        >
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput reference="clients" source="clientId" validate={[required()]} allowEmpty>
                <SelectInput optionText="name" disabled />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="title" validate={[required()]} />
            </Grid>
            {/* <Grid middle item xs={12} sm={6}>
              <NumberInput source="oldMeterNumber" validate={[minValue(0)]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="newMeterNumber" validate={[minValue(0)]} />
            </Grid> */}
            <Grid middle item xs={12} sm={6}>
              <TextInput
                source="serial"
                validate={[required()]}
                label={translate('resources.clientmeters.fields.serial')}
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateInput source="setupDate" onBlur={e => e.preventDefault()} inputProps={{ minDate }} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput
                reference="installationteams"
                source="installationTeamId"
                allowEmpty
                validate={[required()]}
              >
                <SelectInput optionText="name" />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput
                reference="dmas"
                source="dmaLevel1Id"
                label={translate('generic.dmaLevel1')}
                allowEmpty
                filter={{ level: 1 }}
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
                    label={translate('generic.dmaLevel2')}
                    {...rest}
                  >
                    <SelectInput {...rest} />
                  </ReferenceInput>
                )}
              </FormDataConsumer>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <QrCodeInput source="qrCode" />
            </Grid>
          </Grid>
        </FlexForm>
      </Create>
    );
  }
}
ChangeClientMeter.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
  dispatch: PropTypes.any,
  match: PropTypes.object,
  dataProvider: PropTypes.func,
};
ChangeClientMeter.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default compose(translate, withDataProvider)(ChangeClientMeter);
