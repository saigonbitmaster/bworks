import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Cancel, Add } from '@material-ui/icons';
import {
  Button,
  SimpleForm,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
  SaveButton,
  required,
  withDataProvider,
  fetchStart,
  fetchEnd,
  refreshView,
  showNotification,
  CUSTOM,
  translate,
  crudGetMatching,
} from 'ra-loopback3';
import compose from 'recompose/compose';
import { submit, reset } from 'redux-form';
import { connect } from 'react-redux';

class GeoGroupCreateButton extends Component {
  state = {
    showDialog: false,
  };

  handleClick = () => this.setState({ showDialog: !this.state.showDialog });

  handleSaveClick = () => {
    const { submit } = this.props;
    submit('geo-group-quick-create');
  };

  handleSubmit = (values, dispatch) => {
    const { fetchStart, fetchEnd, showNotification, dataProvider, refreshView, reset, crudGetMatching } = this.props;
    fetchStart();
    dataProvider(CUSTOM, 'GeoGroups', {
      subUrl: 'createGeoGroup',
      fullUrl: true,
      method: 'GET',
      query: { geoGroupName: values.name, geoQuarterIds: values.geoQuarterIds },
    })
      .then(() => {
        showNotification('resources.importgeogroups.messages.addGeoGroupSuccess');
        dispatch(reset('geo-group-quick-create'));
        crudGetMatching('geoquarters', 'geogroups@geoQuarterIds', {}, {}, { assignedToGeoGroup: 'no' });
      })
      .catch(() => showNotification('resources.importgeogroups.errors.addGeoGroupFailure', 'error'))
      .finally(() => fetchEnd() && refreshView());
  };

  render() {
    const { translate } = this.props;
    const formName = 'geo-group-quick-create';
    return (
      <Fragment>
        <Button
          label={translate('ra.action.create')}
          onClick={this.handleClick}
          permission={{ name: 'ImportGeoGroup', action: 'create' }}
        >
          <Add />
        </Button>
        <Dialog fullWidth open={this.state.showDialog} disableEnforceFocus={true}>
          <DialogTitle>Thêm dữ liệu trạm cấp nước và phường xã</DialogTitle>
          <DialogContent>
            <SimpleForm form={formName} resource="geogroups" toolbar={null} onSubmit={this.handleSubmit}>
              <TextInput label="resources.importgeogroups.fields.waterstation" source="name" validate={required()} />
           
              <ReferenceArrayInput
                label="resources.importgeogroups.fields.quartersInCharged"
                source="geoQuarterIds"
                reference="geoquarters"
                allowEmpty
                filter={{ assignedToGeoGroup: false }}
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

GeoGroupCreateButton.propTypes = {
  dataProvider: PropTypes.func,
  submit: PropTypes.func,
  change: PropTypes.func,
  fetchStart: PropTypes.func,
  fetchEnd: PropTypes.func,
  showNotification: PropTypes.func,
  refreshView: PropTypes.func,
  translate: PropTypes.func,
  reset: PropTypes.func,
  crudGetMatching: PropTypes.func,
};

const enhance = compose(
  withDataProvider,
  translate,
  connect(null, { submit, reset, fetchStart, fetchEnd, showNotification, refreshView, crudGetMatching }),
);

export default enhance(GeoGroupCreateButton);
