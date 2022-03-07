import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { get } from 'lodash';
import { FlexForm, Create, translate, Toolbar, SaveButton, withDataProvider, CUSTOM } from 'ra-loopback3';
import ContractInfoInput from './ContractInfoInput';

const CreateClientContractToolbar = ({ ...props }) => {
  return (
    <Toolbar {...props}>
      <SaveButton label="generic.signContract" redirect="list" submitOnEnter={true} />
    </Toolbar>
  );
};

@translate
@withDataProvider
class CreateClientContract extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    let clientRegister = get(props, 'location.state.clientRegister') || {};
    this.state = {
      saving: false,
      clientRegister: { ...clientRegister },
    };
  }

  setValue = (key, val) => {
    if (this.formRef) {
      this.formRef.current.props.change(key, val);
    }
  };

  save = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    this.props.dataProvider(
      CUSTOM,
      'clients',
      {
        method: 'POST',
        subUrl: 'contractSign',
        body: { data: record },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };

  render() {
    const { clientRegister } = this.state;
    if (!clientRegister || !clientRegister.id) return <Redirect to={`${this.props.basePath}`} />;
    const { dispatch, dataProvider, ...props } = this.props;
    const { hasList, hasCreate, hasEdit, hasShow, ...rest } = props;
    return (
      <Create {...props} resource="clients" save={this.save}>
        <FlexForm
          style={{ flexGrow: 1 }}
          spacing={2}
          formRef={this.formRef}
          redirect="list"
          defaultValue={{ ...clientRegister, status: 'CONTRACT_SIGNED', contractDate: new Date() }}
          toolbar={<CreateClientContractToolbar />}
        >
          <ContractInfoInput subFlex formRef={this.formRef} {...rest} />
        </FlexForm>
      </Create>
    );
  }
}
CreateClientContract.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
  location: PropTypes.object,
  basePath: PropTypes.string,
  dataProvider: PropTypes.func,
  dispatch: PropTypes.func,
};

CreateClientContract.defaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default CreateClientContract;
