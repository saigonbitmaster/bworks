import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import omit from 'lodash/omit';
import { FlexForm, Create, translate, withDataProvider, GET_ONE, CUSTOM } from 'ra-loopback3';
import ClientMeterInfoInput from './ClientMeterInfoInput';
import RequestExecuteToolbar from './RequestExecuteToolbar';

@withDataProvider
@translate
class CreateClientMeter extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      choiceClients: [],
      client: null,
    };
  }

  componentDidMount() {
    const { dataProvider, match } = this.props;
    dataProvider(GET_ONE, 'Clients', { id: match.params.clientId }).then(res => {
      if (res && res.data) {
        this.setState({ client: res.data });
      }
    });
  }

  save = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    const omittedField = 'dmaLevel1Id';
    this.props.dataProvider(
      CUSTOM,
      'clientmeters',
      {
        method: 'POST',
        subUrl: 'setupNewMeter',
        body: { data: omit(record, omittedField) },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };

  render() {
    const { client } = this.state;
    if (!client) return null;
    const { dataProvider, dispatch, translate, ...props } = this.props;
    const { hasCreate, hasList, hasShow, hasEdit, ...rest } = props;
    let current = moment().toDate();
    return (
      <Create
        {...props}
        resource="clientmeters"
        title={`${translate('generic.pages.client')} ${client.name}`}
        save={this.save}
        hasList={true}
      >
        <FlexForm
          defaultValue={{
            clientId: client.id,
            name: `KH ${client.name}`,
            testedDate: current,
            setupDate: client && client.contractDate ? moment(client.contractDate).toDate() : current,
            qrCode: client.id,
            id: client.id,
          }}
          client={client}
          formRef={this.formRef}
          redirect="list"
          toolbar={<RequestExecuteToolbar />}
        >
          <ClientMeterInfoInput subFlex {...rest} resource="clientmeters" minimumSetupDate={client.contractDate} />
        </FlexForm>
      </Create>
    );
  }
}
CreateClientMeter.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
  dataProvider: PropTypes.func,
  dispatch: PropTypes.any,
  match: PropTypes.object,
};

CreateClientMeter.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default CreateClientMeter;
