import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
// import { Button } from '@material-ui/core';
// import { Delete as DeleteIcon } from '@material-ui/icons';
import { Edit, TabbedFlexForm, FlexFormTab, MetaFields, translate } from 'ra-loopback3';
import GeoQuarterInfoInput from './GeoQuarterInfoInput';

class GeoQuarterEdit extends Component {
  formRef = React.createRef();
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Edit title={translate('resources.geocountries.edit')} undoable={false} {...rest}>
        <TabbedFlexForm formRef={this.formRef} redirect={'list'}>
          <FlexFormTab key={1} label={translate('generic.info')}>
            <GeoQuarterInfoInput subFlex translate={translate} {...rest} formRef={this.formRef} />
          </FlexFormTab>
          <FlexFormTab key={2} label={translate('generic.meta')}>
            <MetaFields />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}

GeoQuarterEdit.propTypes = {
  translate: PropTypes.func,
};

const enhance = compose(translate);
export default enhance(GeoQuarterEdit);
