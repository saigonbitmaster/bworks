import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import { Show, HtmlField, TextField, translate, FlexForm, SelectField } from 'ra-loopback3';
import config from '../../Config';

class ShowInterfaceStandard extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Show {...rest}>
        <FlexForm toolbar={false} style={{ flexGrow: 1 }} spacing={2}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={4}>
              <TextField source="name" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <SelectField
                source="interfaceStandardType"
                choices={config.interfaceStandardType}
                translateChoice={true}
                optionText="name"
                optionValue="name"
              />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="dataRate" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="frequency" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="range" />
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

ShowInterfaceStandard.propTypes = {
  translate: PropTypes.any,
};

ShowInterfaceStandard.detaultProps = {
  hasShow: true,
};
const enhance = compose(translate);
export default enhance(ShowInterfaceStandard);
