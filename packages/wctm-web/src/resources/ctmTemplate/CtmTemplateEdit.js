import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withDataProvider, Edit, TabbedFlexForm, MetaFields, FlexFormTab, translate } from 'ra-loopback3';
import { compose } from 'recompose';
import CtmTemplateInfoInput from './CtmTemplateInfoInput';
class CtmTemplateEdit extends Component {
  render() {
    const { dataProvider, translate, dispatch, ...rest } = this.props;
    return (
      <Edit {...rest}>
        <TabbedFlexForm>
          <FlexFormTab label={translate('generic.info')}>
            <CtmTemplateInfoInput subFlex translate={translate} dataProvider={dataProvider} {...rest} />
          </FlexFormTab>
          <FlexFormTab label={translate('generic.meta')}>
            <MetaFields />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}

CtmTemplateEdit.propTypes = {
  dataProvider: PropTypes.func,
  translate: PropTypes.func,
  dispatch: PropTypes.func,
};

const enhance = compose(withDataProvider, translate);
export default enhance(CtmTemplateEdit);
