import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Edit,
  TextField,
  translate,
  ReferenceField,
  DateField,
  FlexForm,
  SelectInput,
  ImagePreviewInput,
  withDataProvider,
  Toolbar,
  SaveButton,
  FunctionField,
  UPDATE,
  Button,
  CUSTOM,
} from 'ra-loopback3';
import { Close as CloseIcon } from '@material-ui/icons';
import moment from 'moment-timezone';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import Config from '../../Config';
import { isEmpty } from 'lodash';

const InspectMeterNumberEditToolbar = ({ onClickDeclince, record, formValues, ...rest }) => (
  <Toolbar {...rest}>
    <SaveButton
      transparent={false}
      label="resources.inspectmeternumber.buttons.inspectAcepted"
      submitOnEnter={true}
      disabled={record.submitStatus !== 'WAITING' || formValues.declineMessage}
    />
    <Button
      label="resources.inspectmeternumber.buttons.inspectDeclince"
      submitOnEnter={false}
      variant="contained"
      color="secondary"
      onClick={() => onClickDeclince(record, formValues)}
      disabled={record.submitStatus !== 'WAITING' || !formValues.declineMessage}
    >
      <CloseIcon />
    </Button>
  </Toolbar>
);

InspectMeterNumberEditToolbar.propTypes = {
  formValues: PropTypes.object,
  handleSubmit: PropTypes.func,
  onClickDeclince: PropTypes.func,
  record: PropTypes.object,
};

class InspectMeterNumberEdit extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     showDecline: false,
  //   };
  // }
  saving = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    this.props.dataProvider(
      CUSTOM,
      'meternumbersubmits',
      {
        method: 'POST',
        subUrl: 'approveSubmit',
        body: { submitData: record },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };

  onDecline = (record, formValues) => {
    const { dataProvider } = this.props;
    const { id } = record;
    const { declineMessage } = formValues;
    if (declineMessage) {
      dataProvider(UPDATE, 'meternumbersubmits', {
        data: { ...record, submitStatus: 'DENIED', declineMessage },
        id,
      });
    } else {
      alert('Xin cung cấp tin báo lỗi cho Khách Hàng');
    }
  };

  render() {
    const { translate, dataProvider, ...rest } = this.props;
    return (
      <Fragment>
        <Edit
          {...rest}
          resource="meternumbersubmits"
          // filters={<InspectMeterNumberFilter />}
          // filter={{
          //   submitStatus: 'WAITING',
          // }}
          save={this.saving}
        >
          <FlexForm
            toolbar={<InspectMeterNumberEditToolbar onClickDeclince={this.onDecline} />}
            style={{ flexGrow: 1 }}
            spacing={2}
            formRef={this.formRef}
            redirect="list"
          >
            <Grid middle container spacing={2}>
              <Grid middle item xs={12} sm={6}>
                <ReferenceField
                  source="clientId"
                  reference="clients"
                  linkType={false}
                  label={'resources.inspectmeternumber.fields.code'}
                >
                  <TextField source="code" />
                </ReferenceField>
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <ReferenceField
                  source="clientId"
                  reference="clients"
                  linkType={false}
                  label={'resources.inspectmeternumber.fields.name'}
                >
                  <TextField source="name" />
                </ReferenceField>
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <ReferenceField
                  source="clientId"
                  reference="clients"
                  linkType={false}
                  label={'resources.inspectmeternumber.fields.formattedAddress'}
                >
                  <TextField source="formattedAddress" />
                </ReferenceField>
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <FunctionField
                  source="changedClientMeter"
                  // label={translate('ra.tasks.fields.status')}
                  label={'resources.inspectmeternumber.fields.changedClientMeter'}
                  render={record => {
                    const { changedClientMeter = null } = record;
                    const noChanged = translate('resources.inspectmeternumber.changedClientMeter.noChanged');
                    if (!isEmpty(changedClientMeter)) {
                      const lastChanged = changedClientMeter[changedClientMeter.length - 1];
                      if (lastChanged) {
                        const { setupDate = null, newMeterNumber = 0 } = lastChanged;
                        return `Đổi đồng hồ ngày ${moment(setupDate).format(
                          'DD/MM/YYYY',
                        )}, số nước bắt đầu là ${newMeterNumber}`;
                      } else {
                        return noChanged;
                      }
                    } else {
                      return noChanged;
                    }
                  }}
                />
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <DateField source="fromDate" label={'resources.inspectmeternumber.fields.fromDate'} />
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <DateField source="toDate" label={'resources.inspectmeternumber.fields.toDate'} />
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <TextField source="previousNumber" label={'resources.inspectmeternumber.fields.previousNumber'} />
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <TextField source="currentNumber" label={'resources.inspectmeternumber.fields.currentNumber'} />
              </Grid>
              <Grid item middle xs={12} sm={6}>
                <ImagePreviewInput
                  titleimage={translate('resources.inspectmeternumber.fields.meterImage')}
                  storage="CtmFiles"
                  source="meterImage"
                  label={'generic.meterImage'}
                  translate={translate}
                  dataProvider={dataProvider}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectInput
                  label="resources.inspectmeternumber.fields.message"
                  choices={Config.client.inspectMeterNumber.declineMessage}
                  source="declineMessage"
                  optionText="name"
                  optionValue="value"
                  allowEmpty
                />
              </Grid>
            </Grid>
          </FlexForm>
        </Edit>
      </Fragment>
    );
  }
}
InspectMeterNumberEdit.propTypes = {
  dataProvider: PropTypes.func,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  translate: PropTypes.func,
};

InspectMeterNumberEdit.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default compose(translate, withDataProvider)(InspectMeterNumberEdit);
