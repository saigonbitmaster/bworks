import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Create, FlexForm, CUSTOM, withDataProvider } from 'ra-loopback3';
import { compose } from 'recompose';
import FactoryInfoInput from './FactoryInfoInput';

class FactoryCreate extends Component {
  static propTypes = {
    basePath: PropTypes.string,
    model: PropTypes.string,
    changeFieldValue: PropTypes.any,
    redirect: PropTypes.string,
    dataProvider: PropTypes.func,
  };
  formRef = React.createRef();
  save = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    // console.log(record);
    this.props.dataProvider(
      CUSTOM,
      'factories',
      {
        method: 'POST',
        subUrl: 'createFactory',
        body: { data: record },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };

  render() {
    const { dataProvider, redirect, basePath: rawPath, ...rest } = this.props;
    let basePath = rawPath.replace(':model', rest.model);
    return (
      <Create {...rest} resource="factories" undoable={false} basePath={basePath} save={this.save}>
        <FlexForm
          redirect={redirect}
          validate={this.validateForm}
          formRef={this.formRef}
          defaultValue={{ useStartDate: new Date() }}
        >
          <FactoryInfoInput formRef={this.formRef} />
        </FlexForm>
      </Create>
    );
  }
}
const enhance = compose(withDataProvider);
export default enhance(FactoryCreate);
