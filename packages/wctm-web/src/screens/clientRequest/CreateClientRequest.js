import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlexForm,
  Create,
  TextInput,
  required,
  translate,
  SelectInput,
  ReferenceInput,
  withDataProvider,
  CUSTOM,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import compose from 'recompose/compose';
import config from '../../Config';

class CreateClientRequest extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      choiceClients: [],
    };
  }
  componentDidMount() {
    this.props.dataProvider(CUSTOM, 'clientrequests/getListClientRequest', { query: {} }).then(res => {
      if (res && res.data && res.data.length > 0) {
        this.setState({ choiceClients: res.data });
      }
    });
  }
  render() {
    const { props } = this;
    return (
      <Create {...props} resource="clientrequests">
        <FlexForm style={{ flexGrow: 1 }} spacing={2} formRef={this.formRef} redirect="list">
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={6}>
              <SelectInput source={'clientId'} choices={this.state.choiceClients} validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <TextInput source={'title'} validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <SelectInput source={'type'} choices={config.client.typeRequestChoices} validate={[required()]} />
            </Grid>
            <Grid middle item xs={12} sm={6}>
              <ReferenceInput
                reference="installationteams"
                source="installationTeamId"
                allowEmpty
                validate={[required()]}
              >
                <SelectInput optionText="name" />
              </ReferenceInput>
            </Grid>
          </Grid>
        </FlexForm>
      </Create>
    );
  }
}
CreateClientRequest.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
  dataProvider: PropTypes.func,
};
CreateClientRequest.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
export default compose(withDataProvider, translate)(CreateClientRequest);
