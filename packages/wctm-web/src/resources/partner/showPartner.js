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
  Datagrid,
  ArrayField,
  translate,
  FlexForm,
  SelectField,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
} from 'ra-loopback3';
import config from '../../Config';

class ShowPartner extends Component {
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
              <TextField fullWidth source="address" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <SelectField
                source="providerType"
                choices={config.partnerType}
                translateChoice={true}
                optionText="name"
                optionValue="id"
              />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="taxNo" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="phone" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="fax" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <EmailField source="email" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <UrlField source="website" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="contactPerson" />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <ArrayField fullWidth source="bankAccountList">
                <Datagrid>
                  <TextField fullWidth source="bankName" />
                  <TextField fullWidth source="bankBranch" />
                  <TextField fullWidth source="accountName" />
                  <NumberField source="accountNo" />
                </Datagrid>
              </ArrayField>
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <ReferenceArrayField fullWidth reference="dmas" source="dmaIds">
                <SingleFieldList fullWidth style={{ flexWrap: 'none' }}>
                  <ChipField source="name" />
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

ShowPartner.propTypes = {
  translate: PropTypes.any,
};

ShowPartner.detaultProps = {
  hasShow: true,
};
const enhance = compose(translate);
export default enhance(ShowPartner);
