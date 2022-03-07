import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlexForm, TextInput, required, number, translate, EditorInput, NumberInput, Edit } from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';

class EditQuotaWater extends Component {
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Edit {...rest} resource="quotawaters">
        <FlexForm style={{ flexGrow: 1 }} spacing={2} redirect="list">
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="name" validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="value" validate={[required(), number()]} />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <EditorInput fullWidth source="description" />
            </Grid>
          </Grid>
        </FlexForm>
      </Edit>
    );
  }
}

EditQuotaWater.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
};
EditQuotaWater.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(translate);
export default enhance(EditQuotaWater);
