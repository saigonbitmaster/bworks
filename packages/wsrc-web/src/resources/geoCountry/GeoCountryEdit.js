import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Edit, TabbedFlexForm, FlexFormTab, MetaFields, translate } from 'ra-loopback3';
import GeoCountryInfoInput from './GeoCountryInfoInput';

class GeoCountryEdit extends Component {
  formRef = React.createRef();
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Edit resource="countries" title={translate('resources.geocountries.edit')} undoable={false} {...rest} hasList>
        <TabbedFlexForm formRef={this.formRef} redirect={'list'}>
          <FlexFormTab key={1} label={translate('generic.info')}>
            <GeoCountryInfoInput subFlex translate={translate} {...rest} formRef={this.formRef} />
          </FlexFormTab>
          <FlexFormTab key={2} label={translate('generic.meta')}>
            <MetaFields />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}

GeoCountryEdit.propTypes = {
  translate: PropTypes.func,
};

const enhance = compose(translate);
export default enhance(GeoCountryEdit);
