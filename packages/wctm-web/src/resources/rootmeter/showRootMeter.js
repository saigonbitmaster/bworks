import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import { Show, HtmlField, TextField, translate, FlexForm, ReferenceField } from 'ra-loopback3';

class ShowRootMeter extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Show {...rest}>
        <FlexForm toolbar={false} style={{ flexGrow: 1 }} spacing={2}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextField fullWidth source="name" />
            </Grid>
            <Grid middle item xs={12} sm={6} />
            <Grid middle item xs={12} sm={6}>
              <TextField source="size" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextField source="seri" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceField source="waterProviderId" reference="waterproviders">
                <TextField source="name" />
              </ReferenceField>
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

ShowRootMeter.propTypes = {
  translate: PropTypes.any,
};

ShowRootMeter.detaultProps = {
  hasShow: true,
};
const enhance = compose(translate);
export default enhance(ShowRootMeter);
