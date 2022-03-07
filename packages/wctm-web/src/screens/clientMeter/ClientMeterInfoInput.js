import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextInput,
  required,
  SelectInput,
  ReferenceInput,
  DateInput,
  FlexItemForward,
  QrCodeInput,
  translate,
  FormDataConsumer,
} from 'ra-loopback3';
// import moment from 'moment-timezone';
import { Grid } from '@material-ui/core';

@translate
export default class ClientMeterInfoInput extends Component {
  static propTypes = {
    subFlex: PropTypes.bool,
    translate: PropTypes.func,
    client: PropTypes.object,
    minimumSetupDate: PropTypes.string,
  };

  render() {
    const { subFlex, client, translate, minimumSetupDate, ...props } = this.props;
    let optionQr = {};
    let setupDateInputProps = {};
    let displayDmaInputs = true;

    if (client) {
      optionQr.init = client.id;
    }
    // if (minimumSetupDate) {
    //   setupDateInputProps.minDate = moment(minimumSetupDate).toDate();
    //   displayDmaInputs = true;
    // }

    return (
      <FlexItemForward subFlex {...props}>
        <Grid middle container spacing={2}>
          <Grid middle item xs={12} sm={6}>
            <TextInput source="name" validate={[required()]} />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <TextInput source="serial" validate={[required()]} />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <DateInput
              source="setupDate"
              validate={[required()]}
              inputProps={setupDateInputProps}
              onBlur={e => e.preventDefault()}
            />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <ReferenceInput reference="installationteams" source="installationTeamId" validate={[required()]}>
              <SelectInput optionText="name" />
            </ReferenceInput>
          </Grid>
          {displayDmaInputs ? (
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
          ) : null}
          <Grid middle item xs={12} sm={6}>
            <QrCodeInput source="qrCode" {...optionQr} />
          </Grid>
        </Grid>
      </FlexItemForward>
    );
  }
}
