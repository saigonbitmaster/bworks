import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import {
  Show,
  HtmlField,
  TextField,
  NumberField,
  EmailField,
  UrlField,
  
  translate,
  FlexForm,
} from 'ra-loopback3';
class CtmCompanyShow extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Show {...rest}>
        <FlexForm toolbar={false} style={{ flexGrow: 1 }} spacing={2}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={12}>
              <TextField fullWidth source="name" />
            </Grid>
            
            <Grid middle item xs={12} sm={6}>
              <TextField fullWidth source="address" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <UrlField source="website" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberField source="taxNo" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextField source="phone" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextField source="fax" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <EmailField source="email" />
            </Grid>
           
            <Grid middle item xs={12} sm={6}>
              <TextField source="contactPerson" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextField source="invoiceSignPerson" />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <TextField source="invoiceNoticeNo" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
                  <TextField fullWidth source="accountName" />
                  </Grid>
            <Grid middle item xs={12} sm={6}>
                  <TextField source="accountNo" />
               
            </Grid>
            <Grid middle item xs={12} sm={12}>
             
                  <TextField fullWidth source="bankName" />
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
CtmCompanyShow.propTypes = {
  translate: PropTypes.any,
};
CtmCompanyShow.detaultProps = {
  hasShow: true,
};
const enhance = compose(translate);
export default enhance(CtmCompanyShow);
