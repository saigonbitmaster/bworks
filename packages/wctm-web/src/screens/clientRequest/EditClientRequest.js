import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  FlexForm,
  Edit,
  TextInput,
  required,
  translate,
  SelectInput,
  ReferenceInput,
  withDataProvider,
  HiddenInput,
  QrCodeInput,
  ReferenceField,
  TextField,
  FormDataConsumer,
  CUSTOM,
  DateInput,
  minValue,
  NumberInput,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import moment from 'moment-timezone';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import config from '../../Config';
import CompleteRequestToolbar from './CompleteRequestToolbar';

class EditClientRequest extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  state = {
    lastMeterNumber: NaN,
    setupDate: null,
  };

  componentDidMount = async () => {
    const { dataProvider, id } = this.props;
    let {
      data: { lastMeterNumber },
    } = await dataProvider(CUSTOM, `ClientRequests/${id}/client`, { method: 'GET' });

    // Ensure there are values worth rendering
    if (!lastMeterNumber) lastMeterNumber = 0;

    this.setState({
      lastMeterNumber,
    });
  };

  static getDerivedStateFromProps = (props, state) => {
    const { recordForm } = props;
    if (recordForm && recordForm.values.setupDate && !state.setupDate) {
      return { setupDate: recordForm.values.setupDate };
    }
    return null;
  };

  save = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    const { lastMeterNumber } = this.state;

    record.lastMeterNumber = lastMeterNumber;

    this.props.dataProvider(
      CUSTOM,
      'clientrequests',
      {
        method: 'POST',
        subUrl: 'completeRequest',
        body: { data: record },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };

  render() {
    const { lastMeterNumber, setupDate } = this.state;
    const { startUndoable, translate, dataProvider, ...props } = this.props;

    // If there is a contract date then there is no upper limit for setup date
    if (isNaN(lastMeterNumber)) {
      return null;
    } else {
      const setupDateInputProps = {};
      setupDateInputProps.minDate = moment(setupDate)
        .subtract(12, 'month') // hard code 12 months
        .toDate();

      return (
        <Edit {...props} resource="clientrequests" save={this.save}>
          <FlexForm toolbar={<CompleteRequestToolbar />} formRef={this.formRef} redirect="list">
            <HiddenInput source="status" />
            <Grid middle container spacing={2}>
              <Grid middle item xs={12} sm={6}>
                <ReferenceInput reference={'clients'} source={'clientId'} disabled validate={[required()]}>
                  <SelectInput optionText="name" />
                </ReferenceInput>
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <TextInput source={'title'} validate={[required()]} />
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <SelectInput
                  source={'type'}
                  choices={config.client.typeRequestChoices}
                  validate={[required()]}
                  disabled
                />
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

              <FormDataConsumer>
                {({ formData, ...rest }) =>
                  formData.type === 'REPLACE' ? (
                    <Grid middle item xs={12} sm={6}>
                      <ReferenceField
                        {...rest}
                        reference="clients"
                        source="clientId"
                        label={translate('resources.clients.fields.lastMeterNumber')}
                        allowEmpty
                        disabled
                        linkType={false}
                      >
                        <TextField source="lastMeterNumber" addLabel />
                      </ReferenceField>
                    </Grid>
                  ) : null
                }
              </FormDataConsumer>
              <Grid middle item xs={12} sm={6}>
                <ReferenceField
                  label={translate('resources.clients.fields.contractNo')}
                  reference="clients"
                  source="clientId"
                  allowEmpty
                  disabled
                  validate={[required()]}
                  linkType={false}
                >
                  <TextField source="contractNo" addLabel />
                </ReferenceField>
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <FormDataConsumer>
                  {({ formData, ...rest }) => (
                    <Fragment>
                      {formData.type === 'REPLACE' ? (
                        <Fragment>
                          <Grid item xs={12} sm={6}>
                            <NumberInput
                              {...rest}
                              source="oldMeterNumber"
                              validate={[minValue(lastMeterNumber), required()]}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <NumberInput {...rest} source="newMeterNumber" validate={[minValue(0), required()]} />
                          </Grid>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <Grid item xs={12} sm={6}>
                            <NumberInput
                              {...rest}
                              source="startMeterNumber"
                              validate={[minValue(0), required()]}
                              defaultValue={0}
                            />
                          </Grid>
                        </Fragment>
                      )}
                    </Fragment>
                  )}
                </FormDataConsumer>
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <DateInput
                  source="setupDate"
                  validate={[required()]}
                  onBlur={e => e.preventDefault()}
                  inputProps={setupDateInputProps}
                />
              </Grid>
              <Grid middle item xs={12} sm={6}>
                <QrCodeInput source="qrCode" />
              </Grid>
            </Grid>
          </FlexForm>
        </Edit>
      );
    }
  }
}
EditClientRequest.propTypes = {
  startUndoable: PropTypes.func,
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
  dataProvider: PropTypes.func,
  id: PropTypes.string,
  recordForm: PropTypes.object,
};
const mapStateToProps = state => {
  return {
    recordForm: state.form['record-form'],
  };
};
EditClientRequest.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const enhance = compose(connect(mapStateToProps), translate, withDataProvider);
export default enhance(EditClientRequest);
