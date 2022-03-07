import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Edit, TabbedFlexForm, FlexFormTab, MetaFields, translate } from 'ra-loopback3';
import GeoProvinceInfoInput from './GeoProvinceInfoInput';

class GeoProvinceEdit extends Component {
  formRef = React.createRef();
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Edit title={translate('resources.geocountries.edit')} undoable={false} {...rest}>
        <TabbedFlexForm formRef={this.formRef} redirect={'list'}>
          <FlexFormTab key={1} label={translate('generic.info')}>
            <GeoProvinceInfoInput subFlex translate={translate} {...rest} formRef={this.formRef} />
          </FlexFormTab>
          <FlexFormTab key={2} label={translate('generic.meta')}>
            <MetaFields />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}

GeoProvinceEdit.propTypes = {
  translate: PropTypes.func,
};

const enhance = compose(translate);
export default enhance(GeoProvinceEdit);
