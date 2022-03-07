import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Edit, TabbedFlexForm, FlexFormTab, MetaFields, translate } from 'ra-loopback3';
import GeoDistrictInfoInput from './GeoDistrictInfoInput';

// const Title = ({ record }) => <span>{record.name}</span>;
class GeoDistrictEdit extends Component {
  formRef = React.createRef();
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Edit undoable={false} {...rest}>
        <TabbedFlexForm formRef={this.formRef} redirect={'list'}>
          <FlexFormTab key={1} label={translate('generic.info')}>
            <GeoDistrictInfoInput subFlex formRef={this.formRef} translate={translate} {...rest} />
          </FlexFormTab>
          <FlexFormTab key={2} label={translate('generic.meta')}>
            <MetaFields />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}

GeoDistrictEdit.propTypes = {
  translate: PropTypes.func,
};

const enhance = compose(translate);
export default enhance(GeoDistrictEdit);
