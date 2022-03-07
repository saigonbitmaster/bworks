import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate, withDataProvider, Edit, TabbedFlexForm, MetaFields, FlexFormTab } from 'ra-loopback3';
import compose from 'recompose/compose';
import InfoKml from './InfoKml';
const EditTitle = ({ record }) => <span>{record.fileNameReal}</span>;
EditTitle.propTypes = { record: PropTypes.object };
class EditKml extends Component {
  formRef = React.createRef();
  render() {
    const { translate, redirect, dataProvider, ...rest } = this.props;
    return (
      <Edit {...rest} resource="kmls" title={<EditTitle />}>
        <TabbedFlexForm redirect={redirect} formRef={this.formRef}>
          <FlexFormTab label={translate('generic.info')}>
            <InfoKml formRef={this.formRef} />
          </FlexFormTab>
          <FlexFormTab label={translate('generic.meta')}>
            <MetaFields />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}
EditKml.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  dataProvider: PropTypes.func,
  redirect: PropTypes.any,
};

EditKml.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default compose(translate, withDataProvider)(EditKml);
