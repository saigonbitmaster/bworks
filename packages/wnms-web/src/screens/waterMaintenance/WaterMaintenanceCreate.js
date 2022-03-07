import React, { Component } from 'react';
import {
  FlexForm,
  required,
  minValue,
  Create,
  EditorInput,
  DateInput,
  NumberInput,
  DmaSelectInput,
  translate,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
class WaterMaintenanceCreate extends Component {
  render() {
    const { props } = this;
    return (
      <Create {...props}>
        <FlexForm style={{ flexGrow: 1 }} spacing={2} redirect="list">
          <Grid middle container spacing={2}>
            <Grid middle item xs={12}>
              <DmaSelectInput
                source={'dmaId'}
                label={this.props.translate('generic.dma').toUpperCase()}
                validate={[required()]}
              />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateInput source="date" validate={[required()]} defaultValue={new Date()} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput fullWidth source="value" validate={[required(), minValue(0)]} />
            </Grid>
            <Grid middle item xs={12}>
              <EditorInput fullWidth source="description" />
            </Grid>
          </Grid>
        </FlexForm>
      </Create>
    );
  }
}

WaterMaintenanceCreate.propTypes = {
  translate: PropTypes.func,
};

const enhance = compose(translate);

export default enhance(WaterMaintenanceCreate);
