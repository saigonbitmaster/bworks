import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Edit, TabbedFlexForm, FlexFormTab, MetaFields, translate } from 'ra-loopback3';
import ConfigurationInfoInput from './ConfigurationInfoInput';
class ConfigurationEdit extends Component {
  static propTypes = {
    basePath: PropTypes.string,
    model: PropTypes.string,
    changeFieldValue: PropTypes.any,
    redirect: PropTypes.string,
    translate: PropTypes.any,
  };

  constructor(props) {
    super(props);
  }
  formRef = React.createRef();
  render() {
    const { redirect, ...rest } = this.props;
    return (
      <Edit title={this.props.translate('resources.ctmconfigs.editTitle')} {...rest}>
        <TabbedFlexForm redirect={'list'}>
          <FlexFormTab key={1} formRef={this.formRef} label={this.props.translate('generic.info')}>
            <ConfigurationInfoInput formRef={this.formRef} />
          </FlexFormTab>
          <FlexFormTab key={2} label={this.props.translate('generic.meta')}>
            <MetaFields />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}

let enhance = compose(translate);
export default enhance(ConfigurationEdit);
