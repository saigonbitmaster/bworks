import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlexForm,
  TextInput,
  required,
  translate,
  SelectInput,
  EditorInput,
  ReferenceInput,
  DateTimeInput,
  BooleanInput,
  ReferenceArrayInput,
  LongTextInput,
  SelectArrayInput,
  Edit,
  FormDataConsumer,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';

const DefaultValue = {};

class EditAnnouncement extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Edit {...rest} resource="announcements">
        <FlexForm style={{ flexGrow: 1 }} spacing={2} redirect="list" defaultValue={DefaultValue}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateTimeInput disabled={true} source="createdDate" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateTimeInput source="sendDate" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput disabled={true} source="appUserId" reference="appusers">
                <SelectInput optionText="fullName" />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput source="announcementTypeId" reference="announcementtypes">
                <SelectInput optionText="name" />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput source="announcementPriorityId" reference="announcementpriorities">
                <SelectInput optionText="name" />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <BooleanInput source="sendPublic" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <FormDataConsumer>
                {({ formData, ...rest }) =>
                  !formData.sendPublic && (
                    <ReferenceArrayInput
                      {...rest}
                      fullWidth
                      label="Vùng nhận thông báo"
                      source="dmaIds"
                      reference="dmas"
                    >
                      <SelectArrayInput optionText="name" />
                    </ReferenceArrayInput>
                  )
                }
              </FormDataConsumer>
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <LongTextInput source="shortContent" />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <EditorInput fullWidth source="fullContent" />
            </Grid>
          </Grid>
        </FlexForm>
      </Edit>
    );
  }
}

EditAnnouncement.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
};
EditAnnouncement.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(translate);
export default enhance(EditAnnouncement);
