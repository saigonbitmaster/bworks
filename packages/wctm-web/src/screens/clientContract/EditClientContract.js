import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlexForm, Edit, translate, CUSTOM, withDataProvider } from 'ra-loopback3';
import ContractInfoInput from './ContractInfoInput';

@translate
@withDataProvider
class EditClientContract extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }
  save = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    this.props.dataProvider(
      CUSTOM,
      'clients',
      {
        method: 'PUT',
        subUrl: `editClient/${record.id}`,
        body: { data: record },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };

  render() {
    const { dispatch, translate, dataProvider, ...props } = this.props;
    const { hasList, hasCreate, hasEdit, hasShow, ...rest } = props;
    // console.log(props);
    return (
      <Edit {...props} resource="clients" save={this.save}>
        <FlexForm style={{ flexGrow: 1 }} spacing={2} formRef={this.formRef} redirect="list">
          <ContractInfoInput subFlex formRef={this.formRef} {...rest} />
        </FlexForm>
      </Edit>
    );
  }
}
EditClientContract.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  staticcontext: PropTypes.any,
  geodistricts: PropTypes.object,
  geowards: PropTypes.object,
  geoquarters: PropTypes.object,
  geoprovinces: PropTypes.object,
  location: PropTypes.object,
  clientregisters: PropTypes.object,
  dataProvider: PropTypes.func,
};
EditClientContract.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
export default EditClientContract;
