import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import moment from 'moment-timezone';
import {
  Show,
  HtmlField,
  TextField,
  translate,
  ReferenceField,
  FunctionField,
  BooleanField,
  FlexForm,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
} from 'ra-loopback3';

class AnnouncementShow extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Show {...rest}>
        <FlexForm toolbar={false} style={{ flexGrow: 1 }} spacing={2} formRef={this.formRef}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={12}>
              <TextField source="name" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <FunctionField
                source="createdDate"
                render={record => moment(record.createdDate).format('DD/MM/YYYY HH:mm:ss')}
              />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <FunctionField
                source="sendDate"
                render={record => moment(record.sendDate).format('DD/MM/YYYY HH:mm:ss')}
              />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ReferenceField source="appUserId" reference="appusers" linkType={false}>
                <TextField source="fullName" />
              </ReferenceField>
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ReferenceField source="announcementTypeId" reference="announcementtypes" linkType={false}>
                <TextField source="name" />
              </ReferenceField>
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <ReferenceField source="announcementPriorityId" reference="announcementpriorities" linkType={false}>
                <TextField source="name" />
              </ReferenceField>
            </Grid>

            <Grid middle item xs={12} sm={4}>
              <BooleanField source="sendPublic" />
            </Grid>
            <Grid middle item xs={12} sm={8}>
              <ReferenceArrayField reference="dmas" source="dmaIds">
                <SingleFieldList>
                  <ChipField source="name" />
                </SingleFieldList>
              </ReferenceArrayField>
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <TextField source="shortContent" />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <HtmlField source="fullContent" />
            </Grid>
          </Grid>
        </FlexForm>
      </Show>
    );
  }
}

AnnouncementShow.propTypes = {
  translate: PropTypes.any,
};

AnnouncementShow.detaultProps = {
  hasShow: true,
};
const enhance = compose(translate);
export default enhance(AnnouncementShow);
