import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withDataProvider, Edit, TabbedFlexForm, FlexFormTab, MetaFields, translate } from 'ra-loopback3';
import PipeInfoInput from './PipeInfoInput';

const PipeEditTitle = ({ record }) => <span>{record.name}</span>;
PipeEditTitle.propTypes = { record: PropTypes.object };
class PipeEdit extends Component {
  formRef = React.createRef;
  render() {
    const { dataProvider, translate, dispatch, redirect, basePath, ...rest } = this.props;
    return (
      <Edit
        {...rest}
        resource="pipes"
        undoable={false}
        basePath={basePath}
        title={<PipeEditTitle translate={translate} />}
      >
        <TabbedFlexForm formRef={this.formRef} redirect={redirect}>
          <FlexFormTab label={translate('generic.info')}>
            <PipeInfoInput subFlex formRef={this.formRef} {...rest} translate={translate} />
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
