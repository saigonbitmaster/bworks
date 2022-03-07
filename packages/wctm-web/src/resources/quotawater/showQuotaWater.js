import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import { Show, HtmlField, TextField, translate, FlexForm } from 'ra-loopback3';

class QuotaWaterShow extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Show {...rest} resource="quotawaters">
        <FlexForm toolbar={false} style={{ flexGrow: 1 }} spacing={2} formRef={this.formRef}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextField source="name" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextField source="value" />
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

QuotaWaterShow.propTypes = {
  translate: PropTypes.any,
};

QuotaWaterShow.detaultProps = {
  hasShow: true,
};
const enhance = compose(translate);
export default enhance(QuotaWaterShow);
