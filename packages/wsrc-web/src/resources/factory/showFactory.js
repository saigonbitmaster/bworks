import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import { Show, HtmlField, TextField, NumberField, translate, FlexForm } from 'ra-loopback3';
// import config from '../../Config';

class ShowFactory extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Show {...rest} resource="factories">
        <FlexForm toolbar={false} style={{ flexGrow: 1 }} spacing={2}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={4}>
              <TextField source="name" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="dimensions" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <NumberField source="capacityDay" />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <HtmlField source="description" fullWidth />
            </Grid>
          </Grid>
        </FlexForm>
      </Show>
    );
  }
}

ShowFactory.propTypes = {
  translate: PropTypes.any,
};

ShowFactory.detaultProps = {
  hasShow: true,
};
const enhance = compose(translate);
export default enhance(ShowFactory);
