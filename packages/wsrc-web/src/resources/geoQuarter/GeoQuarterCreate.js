import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Create, FlexForm, translate } from 'ra-loopback3';
import GeoQuarterInfoInput from './GeoQuarterInfoInput';

class GeoQuarterCreate extends Component {
  formRef = React.createRef();
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Create title={translate('resources.geocountries.create')} undoable="false" {...rest}>
        <FlexForm formRef={this.formRef} redirect="list">
          <GeoQuarterInfoInput subFlex translate={translate} {...rest} formRef={this.formRef} />
        </FlexForm>
      </Create>
    );
  }
}

GeoQuarterCreate.propTypes = {
  translate: PropTypes.func,
};

const enhance = compose(translate);
export default enhance(GeoQuarterCreate);
