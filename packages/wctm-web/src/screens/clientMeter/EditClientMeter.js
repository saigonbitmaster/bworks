import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TabbedFlexForm,
  FlexFormTab,
  // FlexForm,
  Edit,
  translate,
  withDataProvider,
  GET_ONE,
  CUSTOM,
  MetaFields,
} from 'ra-loopback3';
import compose from 'recompose/compose';
import ClientMeterInfoInput from './ClientMeterInfoInput';

class EditClientMeter extends Component {
  state = {
    client: null,
  };
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }
  componentDidMount() {
    this.props.dataProvider(GET_ONE, 'clients', { id: this.props.match.params.clientId }).then(res => {
      if (res && res.data) {
        this.setState({ client: res.data });
      }
    });
  }
  save = (record, _, defaultOnSuccess, defaultOnError) => {
    this.props.dataProvider(
      CUSTOM,
      'clientmeters',
      {
        method: 'PUT',
        subUrl: `editClientMeter/${record.id}`,
        body: { data: record },
      },
      defaultOnSuccess,
      defaultOnError,
    );
  };
  render() {
    const { client } = this.state;
    if (!client) return null;
    const { dataProvider, translate, dispatch, ...props } = this.props;
    const { hasCreate, hasList, hasShow, hasEdit, ...rest } = props;
    return (
      <Edit
        {...props}
        id={client.meterId}
        undoable={false}
        resource="clientmeters"
        title={this.props.translate('resources.clientmeters.titleEditClientMeter')}
        save={this.save}
      >
        <TabbedFlexForm style={{ flexGrow: 1 }} spacing={2} formRef={this.formRef} redirect="list">
          <FlexFormTab key={1} label={translate('generic.info')}>
            <ClientMeterInfoInput subFlex {...rest} resource="clientmeters" />
          </FlexFormTab>
          <FlexFormTab key={2} label={translate('generic.meta')}>
            <MetaFields />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}
EditClientMeter.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
  dispatch: PropTypes.any,
  dataProvider: PropTypes.any,
  match: PropTypes.object,
};
EditClientMeter.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
export default compose(translate, withDataProvider)(EditClientMeter);
