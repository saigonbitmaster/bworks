import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { TabbedFlexForm, FlexFormTab, MetaFields, Edit, translate, withDataProvider, CUSTOM } from 'ra-loopback3';
import ClientRegisterInfoInput from './ClientRegisterInfoInput';

@withDataProvider
class EditClientRegister extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  // asyncValidateWithinRadius = values =>
  //   new Promise((resolve, reject) =>
  //     this.props
  //       .dataProvider(CUSTOM, 'Clients', {
  //         method: 'GET',
  //         subUrl: 'validateWithinRadius',
  //         query: {
  //           position: JSON.stringify(values.position),
  //           formattedAddress: values.formattedAddress,
  //           wardId: values.wardId,
  //           quarterId: values.quarterId,
  //         },
  //       })
  //       .then(() => resolve())
  //       .catch(err => reject(this.props.translate(err.message))),
  //   );

  render() {
    const { translate, dispatch, dataProvider, ...props } = this.props;
    return (
      <Edit {...props} resource="clientregisters">
        <TabbedFlexForm
          formRef={this.formRef}
          redirect={'list'}
          // asyncValidate={this.asyncValidateWithinRadius}
          // asyncBlurFields={['position']}
        >
          <FlexFormTab label={translate('generic.info')}>
            <ClientRegisterInfoInput subFlex formRef={this.formRef} />
          </FlexFormTab>
          <FlexFormTab label={translate('generic.meta')}>
            <MetaFields />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}
EditClientRegister.propTypes = {
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
  location: PropTypes.object,
  dispatch: PropTypes.any,
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
};

EditClientRegister.defaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
export default compose(translate)(EditClientRegister);
