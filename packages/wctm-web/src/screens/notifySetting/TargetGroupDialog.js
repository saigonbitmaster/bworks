import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, withStyles, FormLabel } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
// import moment from 'moment-timezone';
import {
  Button,
  SaveButton,
  withDataProvider,
  translate,
  SelectInput,
  ReferenceInput,
  FlexFormFilter,
} from 'ra-loopback3';
import compose from 'recompose/compose';
// import { set } from 'lodash';
// import { connect } from 'react-redux';
import config from '../../Config';

class TargetGroupDialog extends Component {
  constructor(props) {
    super(props);
    const { recipientFilter } = this.props;
    const {
      functionCondition: { invoiceFilter = null, meterNumberFilter = null } = {},
      geographyCondition: { districtId = '', wardId = '', quarterId = '' } = {},
    } = recipientFilter;
    this.state = { form: { invoiceFilter, meterNumberFilter, districtId, wardId, quarterId } };
  }

  onSubmit = () => {
    const { form } = this.state;
    const { invoiceFilter, meterNumberFilter, districtId, wardId, quarterId } = form;
    const submitForm = {
      functionCondition: { invoiceFilter, meterNumberFilter },
      geographyCondition: { districtId, wardId, quarterId },
    };
    this.props.handleTargetGroupSetting(submitForm);
    this.props.toggleDialog();
  };

  onChange = value => this.setState({ form: value });

  renderFunctionSetting = () => {
    const { translate } = this.props;
    const { form = {} } = this.state;
    const { invoiceFilter } = form;
    return (
      <Grid item container direction="column" xs={6}>
        <Grid item>
          <FormLabel>{translate('resources.notifysetting.targetGroup.functionGroup')}</FormLabel>
        </Grid>
        <Grid item container direction="row" justify="space-around" spacing={1}>
          <FlexFormFilter {...this.props} onSubmit={this.onSubmit} defaultValue={form}>
            <Grid item middle>
              <SelectInput
                allowEmpty
                choices={config.notifySetting.funtionGroupInvoiceTarget}
                label="resources.notifysetting.targetGroup.fields.invoice"
                source="invoiceFilter"
              />
            </Grid>
            <Grid item middle>
              <SelectInput
                allowEmpty
                disabled={!!invoiceFilter}
                choices={config.notifySetting.funtionGroupMeterNumberTarget}
                label="resources.notifysetting.targetGroup.fields.meternumber"
                source="meterNumberFilter"
              />
            </Grid>
            <Grid item style={{ fontSize: '0.75rem', color: '#0000008a' }}>
              {translate('resources.notifysetting.targetGroup.functionGroupTarget.note')}
            </Grid>
          </FlexFormFilter>
        </Grid>
      </Grid>
    );
  };

  renderGeographySetting = () => {
    const { translate } = this.props;
    const { form = {} } = this.state;
    const { districtId = '', wardId = '' } = form;
    return (
      <Grid item container direction="column" xs={6}>
        <Grid item>
          <FormLabel>{translate('resources.notifysetting.targetGroup.geographyGroup')}</FormLabel>
        </Grid>
        <Grid item container direction="row" justify="space-around" spacing={1}>
          <FlexFormFilter {...this.props} onChange={this.onChange}>
            <Grid item middle>
              <ReferenceInput label="resources.clients.fields.districtId" reference="geodistricts" source="districtId">
                <SelectInput optionText="fullName" allowEmpty />
              </ReferenceInput>
            </Grid>
            <Grid item middle>
              <ReferenceInput
                disabled={!districtId}
                filter={{ districtId }}
                label="resources.clients.fields.wardId"
                reference="geowards"
                source="wardId"
              >
                <SelectInput optionText="fullName" allowEmpty />
              </ReferenceInput>
            </Grid>
            <Grid item middle>
              <ReferenceInput
                disabled={!wardId}
                filter={{ wardId }}
                label="resources.clients.fields.quarterId"
                reference="geoquarters"
                source="quarterId"
              >
                <SelectInput optionText="fullName" allowEmpty />
              </ReferenceInput>
            </Grid>
          </FlexFormFilter>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { translate, toggleDialog, showDialog } = this.props;
    return (
      <Dialog fullWidth maxWidth="md" open={showDialog} disableEnforceFocus={true}>
        <DialogTitle>{translate('resources.notifysetting.dialog.targetGroupLabel')}</DialogTitle>
        <DialogContent>
          <Grid container direction="column" spacing={1}>
            <Grid item container xs={12}>
              {this.renderFunctionSetting()}
              {this.renderGeographySetting()}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <SaveButton onClick={this.onSubmit} />
          <Button label="resources.importgeogroups.modal.exit" onClick={toggleDialog}>
            <Cancel />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = () => ({
  input: {
    height: 40,
  },
  button: {
    height: 40,
  },
  selectRoot: {
    height: 40,
    display: 'table',
  },
  select: {
    height: 40,
    width: 150,
    paddingTop: 0,
    paddingBottom: 0,
    display: 'table-cell',
    verticalAlign: 'middle',
  },
});

TargetGroupDialog.propTypes = {
  handleTargetGroupSetting: PropTypes.func,
  recipientFilter: PropTypes.object,
  showDialog: PropTypes.bool,
  toggleDialog: PropTypes.func,
  translate: PropTypes.func,
};

TargetGroupDialog.defaultProps = {
  recipientFilter: {},
};

const enhance = compose(
  withDataProvider,
  translate,
  withStyles(styles),
  // connect(
  //   null,
  //   { submit, reset, fetchStart, fetchEnd, showNotification, refreshView, crudGetMatching },
  // ),
);

export default enhance(TargetGroupDialog);
