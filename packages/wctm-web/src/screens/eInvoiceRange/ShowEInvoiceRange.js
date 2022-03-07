import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Show, FlexForm, BooleanField, FunctionField, TextField, NumberField, HtmlField } from 'ra-loopback3';

export default class ShowEInvoiceRange extends Component {
  static propTypes = {
    title: PropTypes.string,
    translate: PropTypes.func,
  };

  render() {
    const { title, translate, ...rest } = this.props;
    return (
      <Show {...rest}>
        <FlexForm toolbar={null}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={12}>
              <TextField source="name" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextField source="provider" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextField source="supplierTaxCode" />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <TextField source="templateCode" />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <TextField source="serial" />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <BooleanField source="isActive" />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <NumberField source="priority" />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <FunctionField
                source="tag"
                render={record => (record.tag && Array.isArray(record.tag) ? record.tag.join(' ') : null)}
              />
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
