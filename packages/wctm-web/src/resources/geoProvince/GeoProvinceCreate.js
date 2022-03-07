import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Create, FlexForm, translate } from 'ra-loopback3';
import GeoProvinceInfoInput from './GeoProvinceInfoInput';

class GeoProvinceCreate extends Component {
  formRef = React.createRef();
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Create title={translate('resources.geocountries.create')} undoable="false" {...rest}>
        <FlexForm formRef={this.formRef} redirect="list">
          <GeoProvinceInfoInput subFlex translate={translate} {...rest} formRef={this.formRef} />
        </FlexForm>
      </Create>
    );
  }
}

GeoProvinceCreate.propTypes = {
  translate: PropTypes.func,
  formRef: PropTypes.any,
};

const enhance = compose(translate);
export default enhance(GeoProvinceCreate);
