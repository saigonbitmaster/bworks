import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import {
  Show,
  HtmlField,
  TextField,
  translate,
  FlexForm,
  ReferenceField,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
} from 'ra-loopback3';

class ShowInstallationTeam extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Show {...rest}>
        <FlexForm toolbar={false} style={{ flexGrow: 1 }} spacing={2}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextField fullWidth source="name" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceField source="contactPersonId" reference="appusers">
                <TextField source="fullName" />
              </ReferenceField>
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <ReferenceArrayField fullWidth reference="appusers" source="appUserIds">
                <SingleFieldList>
                  <ChipField source="fullName" />
                </SingleFieldList>
              </ReferenceArrayField>
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <HtmlField source="description" />
            </Grid>
          </Grid>
        </FlexForm>
      </Show>
    );
  }
}

ShowInstallationTeam.propTypes = {
  translate: PropTypes.any,
};

ShowInstallationTeam.detaultProps = {
  hasShow: true,
};
const enhance = compose(translate);
export default enhance(ShowInstallationTeam);
