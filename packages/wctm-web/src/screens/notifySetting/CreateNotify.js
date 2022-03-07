import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  FlexForm,
  Create,
  TextInput,
  required,
  translate,
  SelectInput,
  withDataProvider,
  FormDataConsumer,
  CREATE,
  HiddenInput,
  // ReferenceArrayInput,
  // SelectArrayInput,
} from 'ra-loopback3';
import { Grid, Button } from '@material-ui/core';
import ScheduleIcon from '@material-ui/icons/Schedule';
import TargetIcon from '@material-ui/icons/Person';
import compose from 'recompose/compose';
import config from '../../Config';
import RecurrenceDialog from './RecurrenceDialog';
import TargetGroupDialog from './TargetGroupDialog';
import { set, isEmpty } from 'lodash';
import { toString } from 'cronstrue';

const DEFAULT_RECORD = { project: 'CTM', status: 'WAITING' };

class CreateNotify extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      repeat: {},
      recipient: {},
      showRecurrenceDialog: false,
      showTargetGroupDialog: false,
    };
  }

  toggleRecurrenceDialog = () => this.setState(state => ({ showRecurrenceDialog: !state.showRecurrenceDialog }));

  toggleTargetGroupDialog = () => this.setState(state => ({ showTargetGroupDialog: !state.showTargetGroupDialog }));

  handleRecurrenceSetting = ({ cron, expire }) => {
    const description = this.translateCronToVietnamese(cron || null);
    this.setState({ repeat: { ...expire, cron, description, hasChange: true } });
  };

  handleTargetGroupSetting = form => {
    this.setState({ recipient: { ...form, hasChange: true } });
  };

  translateCronToVietnamese = cron => (cron ? toString(cron) : '');

  saving = record => {
    const { dataProvider } = this.props;
    const {
      repeat: { cron, endDate, limit, hasChange, description },
      recipient: { hasChange: targetHasChange, ...recipientFilter },
    } = this.state;
    if (hasChange) {
      const repeat = { cron };
      if (description) repeat.description = description;
      if (endDate) repeat.endDate = endDate;
      if (limit) repeat.limit = limit;
      set(record, 'repeat', repeat);
    }
    if (targetHasChange) {
      set(record, 'payload.recipientFilter', recipientFilter);
    }
    // console.log('record: ', record);
    dataProvider(CREATE, 'jobsystems', {
      data: record,
    });
  };

  validateNotifyCreate = (values = {}) => {
    const { translate } = this.props;
    const { repeat, recipient } = this.state;
    const errors = {};
    if (values.payload && values.payload.target === 'client' && isEmpty(recipient)) {
      errors.payload = { ...errors.payload, target: [translate('resources.notifysetting.validate.recipient')] };
    }
    if (values.type !== 'RUN_NOW' && isEmpty(repeat)) {
      errors.type = [translate('resources.notifysetting.validate.repeat')];
    }
    return errors;
  };

  render() {
    const { props, state } = this;
    const {
      showRecurrenceDialog,
      showTargetGroupDialog,
      repeat: { description },
    } = state;
    return (
      <Create {...props} resource="jobsystems" save={this.saving}>
        <FlexForm
          style={{ flexGrow: 1 }}
          spacing={2}
          formRef={this.formRef}
          redirect="list"
          defaultValue={DEFAULT_RECORD}
          validate={this.validateNotifyCreate}
        >
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextInput label="resources.notifysetting.fields.name" source="payload.name" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <SelectInput
                label="resources.notifysetting.fields.category"
                source="category"
                validate={[required()]}
                choices={config.notifySetting.category}
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <Grid item container direction="row" alignItems="center">
                <Grid item xs={9}>
                  <SelectInput
                    label="resources.notifysetting.fields.target"
                    source="payload.target"
                    choices={config.notifySetting.target}
                    validate={[required()]}
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormDataConsumer>
                    {({ formData }) => (
                      <Button
                        disabled={!formData.payload || formData.payload.target !== 'client'}
                        variant="contained"
                        color="secondary"
                        onClick={this.toggleTargetGroupDialog}
                      >
                        <TargetIcon />
                      </Button>
                    )}
                  </FormDataConsumer>
                </Grid>
              </Grid>
            </Grid>
            <Grid middle item container xs={12} sm={6}>
              <Grid item container direction="column">
                <Grid item container direction="row" alignItems="center">
                  <Grid item xs={9}>
                    <SelectInput
                      label="resources.notifysetting.fields.type"
                      source="type"
                      choices={config.notifySetting.typeChoices}
                      validate={[required()]}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormDataConsumer>
                      {({ formData }) => (
                        <Button
                          disabled={formData.type === 'RUN_NOW'}
                          variant="contained"
                          color="secondary"
                          onClick={this.toggleRecurrenceDialog}
                        >
                          <ScheduleIcon />
                        </Button>
                      )}
                    </FormDataConsumer>
                  </Grid>
                </Grid>
                <FormDataConsumer>
                  {({ formData }) =>
                    formData.type !== 'RUN_NOW' && (
                      <Grid item style={{ fontSize: '0.75rem', color: '#0000008a' }}>
                        {description || this.translateCronToVietnamese(formData.repeat ? formData.repeat.cron : null)}
                      </Grid>
                    )
                  }
                </FormDataConsumer>
                <Fragment>
                  <FormDataConsumer>
                    {({ formData }) => (
                      <RecurrenceDialog
                        repeat={formData.repeat}
                        handleRecurrenceSetting={this.handleRecurrenceSetting}
                        showDialog={showRecurrenceDialog}
                        toggleDialog={this.toggleRecurrenceDialog}
                      />
                    )}
                  </FormDataConsumer>
                  <FormDataConsumer>
                    {({ formData }) => (
                      <TargetGroupDialog
                        // repeat={formData.repeat}
                        handleTargetGroupSetting={this.handleTargetGroupSetting}
                        showDialog={showTargetGroupDialog}
                        toggleDialog={this.toggleTargetGroupDialog}
                      />
                    )}
                  </FormDataConsumer>
                </Fragment>
              </Grid>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="payload.message" label="resources.notifysetting.fields.text" validate={[required()]} />
            </Grid>
            {/* <Grid middle item xs={12} sm={6}>
              <ReferenceArrayInput
                reference="roles"
                source="payload.role"
                validate={[required()]}
                label="resources.notifysetting.fields.role"
              >
                <SelectArrayInput optionText="title" optionValue="name" />
              </ReferenceArrayInput>
            </Grid> */}
            {/* <Grid middle item xs={12} sm={6}>
              <SelectInput
                label="resources.notifysetting.fields.tag"
                source="tag"
                validate={[required()]}
                choices={config.notifySetting.tag}
              />
            </Grid> */}
            <Grid middle item xs={12} sm={6}>
              <SelectInput
                label="resources.notifysetting.fields.status"
                source="status"
                validate={[required()]}
                defaultValue
                choices={config.notifySetting.status}
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="payload.description" label="resources.notifysetting.fields.description" />
            </Grid>
          </Grid>
        </FlexForm>
      </Create>
    );
  }
}
CreateNotify.propTypes = {
  dataProvider: PropTypes.func,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  staticcontext: PropTypes.any,
  translate: PropTypes.func,
};
CreateNotify.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
export default compose(translate, withDataProvider)(CreateNotify);
