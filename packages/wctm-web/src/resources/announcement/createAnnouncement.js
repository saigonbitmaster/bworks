import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlexForm,
  Create,
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
  FormDataConsumer,
  Storage,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';

const DefaultValue = { createdDate: new Date(), sendDate: new Date(), appUserId: Storage.getUser().userId };

//dataProvider(GET_ONE, 'posts', { id: 123 });

class CreateAnnouncement extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { props } = this;
    return (
      <Create {...props} resource="announcements">
        <FlexForm style={{ flexGrow: 1 }} spacing={2} redirect="list" defaultValue={DefaultValue}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateTimeInput disabled={true} source="createdDate" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateTimeInput source="sendDate" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput disabled={true} source="appUserId" reference="appusers" validate={[required()]}>
                <SelectInput optionText="fullName" />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput source="announcementTypeId" reference="announcementtypes" validate={[required()]}>
                <SelectInput optionText="name" />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput
                source="announcementPriorityId"
                reference="announcementpriorities"
                validate={[required()]}
              >
                <SelectInput optionText="name" />
              </ReferenceInput>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <BooleanInput source="sendPublic" defaultValue={true} />
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
              <LongTextInput source="shortContent" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <EditorInput fullWidth source="fullContent" />
            </Grid>
          </Grid>
        </FlexForm>
      </Create>
    );
  }
}
CreateAnnouncement.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
};
CreateAnnouncement.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(translate);
export default enhance(CreateAnnouncement);
