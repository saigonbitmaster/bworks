import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import { Show, HtmlField, TextField, translate, FlexForm, SelectField } from 'ra-loopback3';
import config from '../../Config';

class ShowWaterParameter extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Show {...rest} resource="waterparameters">
        <FlexForm toolbar={false} style={{ flexGrow: 1 }} spacing={2}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={4}>
              <TextField source="name" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="symbol" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="measureUnit" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="normalMethod" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <SelectField
                source="waterStage"
                choices={config.waterParameterStage}
                translateChoice={true}
                optionText="name"
                optionValue="id"
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

ShowWaterParameter.propTypes = {
  translate: PropTypes.any,
};

ShowWaterParameter.detaultProps = {
  hasShow: true,
};
const enhance = compose(translate);
export default enhance(ShowWaterParameter);
