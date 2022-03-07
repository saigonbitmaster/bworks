import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Create, FlexForm, translate } from 'ra-loopback3';
import GeoCountryInfoInput from './GeoCountryInfoInput';

class GeoCountryCreate extends Component {
  formRef = React.createRef();
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Create title={translate('resources.geocountries.create')} undoable="false" {...rest}>
        <FlexForm formRef={this.formRef} redirect="list">
          <GeoCountryInfoInput subFlex translate={translate} {...rest} formRef={this.formRef} />
        </FlexForm>
      </Create>
    );
  }
}

GeoCountryCreate.propTypes = {
  translate: PropTypes.func,
};

const enhance = compose(translate);
export default enhance(GeoCountryCreate);
