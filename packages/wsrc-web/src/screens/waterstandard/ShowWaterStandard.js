import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import {
  Show,
  HtmlField,
  TextField,
  Datagrid,
  ArrayField,
  ReferenceField,
  translate,
  FlexForm,
  SelectField,
  DateField,
  BooleanField,
} from 'ra-loopback3';
import config from '../../Config';

class ShowWaterStandard extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Show {...rest} resource="waterstandards">
        <FlexForm toolbar={false} style={{ flexGrow: 1 }} spacing={2}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={4}>
              <TextField source="name" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <SelectField
                source="applyFor"
                choices={config.waterParameterStage}
                translateChoice={true}
                optionText="name"
                optionValue="id"
              />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <DateField source="issuedDate" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="issuedOrg" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <BooleanField source="isInValid" />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <ArrayField fullWidth source="paramItemList">
                <Datagrid>
                  <ReferenceField source="waterParameterId" reference="waterparameters" linkType={false}>
                    <TextField source="name" />
                  </ReferenceField>
                  <ReferenceField source="waterParameterId" reference="waterparameters" linkType={false}>
                    <TextField source="symbol" />
                  </ReferenceField>
                  <TextField fullWidth source="value" />
                  <ReferenceField source="waterParameterId" reference="waterparameters" linkType={false}>
                    <TextField source="measureUnit" />
                  </ReferenceField>
                </Datagrid>
              </ArrayField>
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

ShowWaterStandard.propTypes = {
  translate: PropTypes.any,
};

ShowWaterStandard.detaultProps = {
  hasShow: true,
};
const enhance = compose(translate);
export default enhance(ShowWaterStandard);
