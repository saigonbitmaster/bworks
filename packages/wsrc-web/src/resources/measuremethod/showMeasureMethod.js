import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import { Show, HtmlField, TextField, translate, FlexForm, SelectField } from 'ra-loopback3';

class ShowPartner extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Show {...rest} resource="measuremethods">
        <FlexForm toolbar={false} style={{ flexGrow: 1 }} spacing={2}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={4}>
              <TextField source="name" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="volRequire" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <SelectField
                source="container"
                choices={[{ name: 'P' }, { name: 'G' }, { name: 'P, G' }]}
                translateChoice={true}
                optionText="name"
                optionValue="name"
              />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="preservative" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="holdingTime" />
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

ShowPartner.propTypes = {
  translate: PropTypes.any,
};

ShowPartner.detaultProps = {
  hasShow: true,
};
const enhance = compose(translate);
export default enhance(ShowPartner);
