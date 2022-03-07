import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withDataProvider, Edit, TabbedFlexForm, FlexFormTab, translate } from 'ra-loopback3';
import { compose } from 'recompose';
import SourceTemplateInfoInput from './sourceTemplateInfoInput';
class SourceTemplateEdit extends Component {
  render() {
    const { dataProvider, translate, dispatch, ...rest } = this.props;
    return (
      <Edit {...rest}>
        <TabbedFlexForm>
          <FlexFormTab label={translate('generic.info')}>
            <SourceTemplateInfoInput subFlex translate={translate} dataProvider={dataProvider} {...rest} />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}

SourceTemplateEdit.propTypes = {
  dataProvider: PropTypes.func,
  translate: PropTypes.func,
  dispatch: PropTypes.func,
};

const enhance = compose(withDataProvider, translate);
export default enhance(SourceTemplateEdit);
