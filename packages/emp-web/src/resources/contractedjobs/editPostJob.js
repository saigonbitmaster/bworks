import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Edit, FlexForm, TextInput, required, translate, SelectInput, EditorInput, DateTimeInput, NumberInput, BooleanInput } from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import config from '../../Config';


let contractStatus = [
  { id: 'new', name: 'Create new contract' },
  { id: 'pending', name: 'Pending' },
  { id: 'failed', name: 'Failed' },
  { id: 'succeed', name: 'Success' },
  { id: 'canceled', name: 'Cancel' },
  { id: 'submitting', name: 'Submitting' },
];
let contractTypes = [
  { id: 'escrow', name: 'Escrow' },
];

class EditPartner extends Component {
  render() {
    const { props } = this;
    return (
      <Edit {...props} PostJob>
       <FlexForm style={{ flexGrow: 1 }} spacing={2} redirect="list" submitOnEnter={false}>
       <Grid middle container spacing={2}>
       <Grid middle item xs={12} sm={12}>
              <TextInput source="name" validate={[required()]} label="Job name" disabled/>
            </Grid>
         
           
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="bidValue" label="Placed bid value" disabled />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <NumberInput source="estimatedCost" label="Budget (Ada)" disabled/>
            </Grid>
         

         
         
            <Grid middle item xs={12} sm={6}>
              <DateTimeInput source="createdDate" label="Created date" disabled/>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <DateTimeInput source="expectedDate"  label="Expired date" disabled/>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="employer"  label="Employer name" disabled/>
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source="bidder"  label="Bidder name" disabled/>
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <TextInput source="bidderWallet"  label="Bidder wallet address" fullWidth disabled/>
            </Grid>
           
            <Grid middle item xs={12} sm={12}>
              <TextInput source="employerWallet"  label="Employer wallet address" fullWidth disabled/>
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <BooleanInput source="selected" label="Select this bid" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <BooleanInput source="employerAgreed" label="Send contract request" />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <BooleanInput source="jobSeekerAgreed" label="Job seeker agreed" />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <SelectInput
                source="contractStatus"
                choices={contractStatus}
                translateChoice={true}
                optionText="name"
                optionValue="id"
              />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <EditorInput source="description" fullWidth />
            </Grid>
          </Grid>

        </FlexForm>
      </Edit>
    );
  }
}

EditPartner.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  staticcontext: PropTypes.any,
};
EditPartner.detaultProps = {
  hasList: true,
  hasShow: true,
};

const enhance = compose(translate);
export default enhance(EditPartner);
