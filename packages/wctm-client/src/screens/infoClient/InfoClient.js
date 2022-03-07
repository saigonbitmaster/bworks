import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TextField, translate, Header, CUSTOM, withDataProvider, FlexForm } from 'ra-loopback3';
import { Paper, Grid } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import config from '../../Config';

class InfoClient extends Component {
  state = {
    data: {},
  };
  componentDidMount() {
    const { translate } = this.props;
    this.props
      .dataProvider(CUSTOM, 'clients/getInfoClientLogin', {
        query: { filter: JSON.stringify({}) },
      })
      .then(res => {
        if (res && res.data) {
          let data = res.data;
          data.status = data.status ? translate(config.mapTranslate.statusClients[data.status]) : '';
          data.type = data.type ? translate(config.mapTranslate.clientTypes[data.type]) : '';
          data.paymentType = data.paymentType ? translate(config.mapTranslate.paymentTypes[data.paymentType]) : '';
          data.buyerIdNo = data.buyerIdNo ? translate(config.mapTranslate.buyerIdTypes[data.buyerIdNo]) : '';
          this.setState({ data });
        }
      });
  }

  render() {
    const { translate } = this.props;
    return (
      <Paper>
        <Header title={translate('generic.infoClient.title')} />
        <FlexForm style={{ flexGrow: 1 }} spacing={2} record={this.state.data} toolbar={false}>
          <Grid middle container spacing={2}>
            <Grid middle item xs={12} sm={4}>
              <TextField source="name" label={translate('generic.infoClient.name')} />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="code" label={translate('generic.infoClient.code')} />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="phoneNumber" label={translate('generic.infoClient.phoneNumber')} />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <TextField
                source="formattedAddress"
                label={translate('generic.infoClient.formattedAddress')}
                fullWidth={true}
              />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField
                source="status"
                label={translate('generic.infoClient.status')}
                choices={config.client.statusChoices}
              />
            </Grid>

            <Grid middle item xs={12} sm={4}>
              <TextField
                source="type"
                label={translate('generic.infoClient.type')}
                choices={config.client.clientTypeChoices}
              />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="taxNo" label={translate('generic.infoClient.taxNo')} />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="familyCount" label={translate('generic.infoClient.familyCount')} />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="memberCount" label={translate('generic.infoClient.memberCount')} />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField
                source="paymentType"
                label={translate('generic.infoClient.paymentType')}
                choices={config.eInvoice.paymentTypeChoices}
              />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField
                source="buyerIdType"
                label={translate('generic.infoClient.buyerIdType')}
                choices={config.eInvoice.buyerIdTypeChoices}
              />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="buyerIdNo" label={translate('generic.infoClient.buyerIdNo')} />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="buyerFaxNumber" label={translate('generic.infoClient.buyerFaxNumber')} />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="buyerEmail" type="email" label={translate('generic.infoClient.buyerEmail')} />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="buyerBankName" label={translate('generic.infoClient.buyerBankName')} />
            </Grid>
            <Grid middle item xs={12} sm={4}>
              <TextField source="buyerBankAccount" label={translate('generic.infoClient.buyerBankAccount')} />
            </Grid>
            <Grid middle item xs={12} sm={12}>
              <TextField fullWidth source="description" label={translate('generic.infoClient.description')} />
            </Grid>
          </Grid>
        </FlexForm>
      </Paper>
    );
  }
}
InfoClient.propTypes = {
  theme: PropTypes.object,
  translate: PropTypes.func,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
};
InfoClient.detaultProps = {
  hasShow: true,
};

// eslint-disable-next-line
const mapStateToProps = state => {
  return {};
};

const enhance = compose(withDataProvider, connect(mapStateToProps, {}), withTheme, translate);

export default enhance(InfoClient);
