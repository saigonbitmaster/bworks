import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Create,
  FlexForm,
  TextInput,
  required,
  translate,
  SelectInput,
  ReferenceInput,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  EditorInput,
  showNotification,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import compose from 'recompose/compose';

const validateUnique = (appUserIds, _, props) => {
  let errors = false;
  if (Array.isArray(appUserIds) && [...new Set(appUserIds)].length !== appUserIds.length) {
    errors = props.translate('error.DUPLICATE_MEMBER');
  }
  return errors;
};

class CreateInstallationTeam extends Component {
  checkDuplicate = (_, appUserIds) => {
    const { showNotification, translate } = this.props;
    if (Array.isArray(appUserIds) && [...new Set(appUserIds)].length !== appUserIds.length) {
      showNotification(translate('error.DUPLICATE_MEMBER'), 'warning');
    }
  };

  render() {
    const { props } = this;
    return (
      <Create {...props} resource="installationteams">
        <FlexForm style={{ flexGrow: 1 }} spacing={2} redirect="list" submitOnEnter={false}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput source="contactPersonId" reference="appusers">
                <SelectInput optionText="fullName" />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <ReferenceArrayInput
                source="appUserIds"
                filterToQuery={searchText => ({
                  fullName: { like: searchText },
                })}
                onChange={this.checkDuplicate}
                reference="appusers"
                validate={validateUnique}
                allowEmpty
              >
                <AutocompleteArrayInput optionText="fullName" />
              </ReferenceArrayInput>
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <EditorInput fullWidth source="description" />
            </Grid>
          </Grid>
        </FlexForm>
      </Create>
    );
  }
}

CreateInstallationTeam.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
  showNotification: PropTypes.func,
};
CreateInstallationTeam.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(
  translate,
  connect(state => ({ formValues: getFormValues('record-form')(state) }), { showNotification }),
);
export default enhance(CreateInstallationTeam);
