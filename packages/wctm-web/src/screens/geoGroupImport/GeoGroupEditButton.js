import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  SimpleForm,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
  withDataProvider,
  required,
  SaveButton,
  fetchStart,
  fetchEnd,
  showNotification,
  CUSTOM,
  refreshView,
  translate,
} from 'ra-loopback3';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Cancel, Edit } from '@material-ui/icons';
import { connect } from 'react-redux';
import { change, initialize, submit } from 'redux-form';
import compose from 'recompose/compose';

class GeoGroupEditButton extends Component {
  state = {
    showDialog: false,
  };

  handleClick = () => {
    const { record, dataProvider, initialize } = this.props;

    // Set up initial values
    dataProvider(CUSTOM, 'GeoGroups', { subUrl: `${record.id}/geoQuarters`, fullUrl: true, method: 'GET' }).then(
      ({ data }) => {
        initialize(`geo-group-quick-edit.${record.id}`, {
          name: record.name,
          geoQuarterId: data.map(datum => datum.id),
        });
      },
    );
    this.setState({ showDialog: !this.state.showDialog });
  };

  handleSaveClick = formName => {
    const { submit } = this.props;

    // Trigger a submit event to Redux-Form
    // Needed because modal action buttons are outside the form
    submit(formName);
  };

  handleSubmit = values => {
    const { change, fetchStart, fetchEnd, showNotification, dataProvider, record, refreshView } = this.props;
    fetchStart();
    dataProvider(CUSTOM, 'GeoGroups', {
      method: 'POST',
      subUrl: 'updateGeoGroupAndGeoQuarters',
      fullUrl: true,
      body: { newGeoGroupName: values.name, newSelectedGeoQuarters: values.geoQuarterId, geoGroupId: record.id },
    })
      .then(({ data: { newGeoGroupName, newGeoQuarterIds } }) => {
        change(`geo-group-quick-edit.${record.id}`, 'name', newGeoGroupName);
        change(`geo-group-quick-edit.${record.id}`, 'geoQuarterId', newGeoQuarterIds);
        this.setState({ showDialog: false });
      })
      .catch(error => showNotification(error.message, 'error'))
      .finally(() => fetchEnd() && refreshView());
  };

  render() {
    const { record, translate } = this.props;
    const formName = `geo-group-quick-edit.${record.id}`;
    return (
      <Fragment>
        <Button
          isLoad
          label={translate('ra.action.edit')}
          onClick={this.handleClick}
          permission={{ name: 'ImportGeoGroup', action: 'edit' }}
        >
          <Edit />
        </Button>
        <Dialog fullWidth open={this.state.showDialog} disableEnforceFocus={true}>
          <DialogTitle>Chỉnh sửa dữ liệu trạm cấp nước và phường xã</DialogTitle>
          <DialogContent>
            <SimpleForm form={formName} resource="geogroups" toolbar={null} onSubmit={this.handleSubmit}>
              <TextInput label="resources.importgeogroups.fields.waterstation" source="name" validate={required()} />
              <ReferenceArrayInput
                label="resources.importgeogroups.fields.quartersInCharged"
                reference="geoquarters"
                source="geoQuarterId"
                allowEmpty
                filter={{
                  assignedToGeoGroup: false,
                }}
              >
                <SelectArrayInput optionText="name" />
              </ReferenceArrayInput>
            </SimpleForm>
          </DialogContent>
          <DialogActions>
            <SaveButton onClick={() => this.handleSaveClick(formName)} />
            <Button label="resources.importgeogroups.modal.exit" onClick={this.handleClick}>
              <Cancel />
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

GeoGroupEditButton.propTypes = {
  record: PropTypes.object,
  dataProvider: PropTypes.func,
  initialize: PropTypes.func,
  submit: PropTypes.func,
  change: PropTypes.func,
  fetchStart: PropTypes.func,
  fetchEnd: PropTypes.func,
  showNotification: PropTypes.func,
  refreshView: PropTypes.func,
  translate: PropTypes.func,
};

const enhance = compose(
  withDataProvider,
  translate,
  connect(null, { initialize, submit, change, fetchEnd, fetchStart, showNotification, refreshView }),
);

export default enhance(GeoGroupEditButton);
