import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { FlexForm, Create, SaveButton, Toolbar, withDataProvider, CUSTOM, translate } from 'ra-loopback3';
import ClientRegisterInfoInput from './ClientRegisterInfoInput';
const ClientRegisterToolbar = props => (
  <Toolbar {...props}>
    <SaveButton label="generic.register" redirect="list" submitOnEnter={true} />
  </Toolbar>
);

@withDataProvider
class CreateClientRegister extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  render() {
    const { dataProvider, ...rest } = this.props;
    return (
      <Create {...rest} resource="clientregisters">
        <FlexForm
          defaultValue={{ familyCount: 1 }}
          formRef={this.formRef}
          redirect="list"
          toolbar={<ClientRegisterToolbar />}
        >
          <ClientRegisterInfoInput subFlex formRef={this.formRef} />
        </FlexForm>
      </Create>
    );
  }
}
CreateClientRegister.propTypes = {
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
  location: PropTypes.object,
  dispatch: PropTypes.any,
  dataProvider: PropTypes.func,
  translate: PropTypes.func,
};
CreateClientRegister.defaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
export default compose(translate)(CreateClientRegister);
