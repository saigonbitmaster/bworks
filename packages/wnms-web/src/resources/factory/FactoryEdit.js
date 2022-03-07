import React, { Component } from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { Edit, withDataProvider, CUSTOM, TabbedFlexForm, FlexFormTab, translate, MetaFields } from 'ra-loopback3';
import FactoryInfoInput from './FactoryInfoInput';

const EditTitle = ({ record }) => <span>{record.name}</span>;
EditTitle.propTypes = { record: PropTypes.object };
class DmaEdit extends Component {
  static propTypes = {
    basePath: PropTypes.string,
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
        method: 'PUT',
        subUrl: `editFactory/${record.id}`,
        body: { data: record },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };
  render() {
    const { dataProvider, changeFieldValue, redirect, basePath: rawPath, ...rest } = this.props;
    let basePath = rawPath.replace(':model', rest.model);
    return (
      <Edit {...rest} save={this.save} resource="factories" undoable={false} title={<EditTitle />} basePath={basePath}>
        <TabbedFlexForm redirect={redirect} formRef={this.formRef}>
          <FlexFormTab label={rest.translate('generic.info')}>
            <FactoryInfoInput formRef={this.formRef} />
          </FlexFormTab>
          <FlexFormTab label={rest.translate('generic.meta')}>
            <MetaFields />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}
const enhance = compose(withDataProvider, translate);
export default enhance(DmaEdit);
