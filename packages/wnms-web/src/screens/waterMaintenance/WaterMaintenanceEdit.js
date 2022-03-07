import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import {
  TabbedFlexForm,
  FlexFormTab,
  Edit,
  required,
  minValue,
  EditorInput,
  DateInput,
  DmaSelectInput,
  NumberInput,
  MetaFields,
  translate,
} from 'ra-loopback3';

class WaterMaintenanceEdit extends Component {
  render() {
    const { ...props } = this.props;
    return (
      <Edit {...props} hasList hasCreate hasEdit>
        <TabbedFlexForm>
          <FlexFormTab label={props.translate('generic.info')}>
            <Grid middle container spacing={2}>
              <Grid middle item xs={12}>
                <DmaSelectInput
                  source={'dmaId'}
                  label={props.translate('generic.dma').toUpperCase()}
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
          </FlexFormTab>
          <FlexFormTab label={props.translate('generic.meta')}>
            <MetaFields />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}

export default compose(translate)(WaterMaintenanceEdit);
