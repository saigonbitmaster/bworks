import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withDataProvider, Edit, CUSTOM, TabbedFlexForm, FlexFormTab, MetaFields, translate } from 'ra-loopback3';
import PipeInfoInput from './PipeInfoInput';

const PipeEditTitle = ({ record }) => <span>{record.name}</span>;
PipeEditTitle.propTypes = { record: PropTypes.object };
class PipeEdit extends Component {
  formRef = React.createRef;
  save = (record, redirect, defaultOnSuccess, defaultOnFailure) => {
    // console.log(record);
    this.props.dataProvider(
      CUSTOM,
      'materialuses',
      {
        method: 'PUT',
        subUrl: `editMatInMap/${record.id}`,
        body: { data: record },
      },
      defaultOnSuccess,
      defaultOnFailure,
    );
  };
  render() {
    const { dataProvider, translate, dispatch, redirect, basePath: rawPath, ...rest } = this.props;
    let basePath = rawPath.replace(':model', rest.model);
    return (
      <Edit
        {...rest}
        resource="materialuses"
        undoable={false}
        basePath={basePath}
        title={<PipeEditTitle translate={translate} />}
        save={this.save}
      >
        <TabbedFlexForm formRef={this.formRef} redirect={redirect} defaultValue={{ type: 'Pipe' }}>
          <FlexFormTab label={translate('generic.info')}>
            <PipeInfoInput subFlex formRef={this.formRef} {...rest} translate={translate} flgEdit={'true'} />
          </FlexFormTab>
          <FlexFormTab label={translate('generic.meta')}>
            <MetaFields />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}
PipeEdit.propTypes = {
  basePath: PropTypes.string,
  redirect: PropTypes.string,
  dispatch: PropTypes.any,
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
};

const enhance = compose(withDataProvider, translate);
export default enhance(PipeEdit);
