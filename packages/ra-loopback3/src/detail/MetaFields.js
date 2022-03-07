import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { ReferenceField } from 'react-admin';
import DateField from '../field/DateField';
import TextField from '../field/TextField';
import FlexItemForward from '../form/FlexItemForward';

export default class MetaFields extends Component {
  static propTypes = {
    subFlex: PropTypes.bool,
  };
  static defaultProps = {
    subFlex: true,
  };
  render() {
    return (
      <FlexItemForward {...this.props}>
        <Grid middle container spacing={2}>
          <Grid middle item xs={12} sm={6}>
            <ReferenceField label={'generic.common.creatorId'} source="creatorId" reference="appusers">
              <TextField source="username" />
            </ReferenceField>
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <ReferenceField label={'generic.common.updaterId'} source="updaterId" reference="appusers">
              <TextField source="username" />
            </ReferenceField>
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <DateField label={'generic.common.createdDate'} source="createdDate" addLabel />
          </Grid>
          <Grid middle item xs={12} sm={6}>
            <DateField label={'generic.common.updatedDate'} source="updatedDate" addLabel />
          </Grid>
        </Grid>
      </FlexItemForward>
    );
  }
}
