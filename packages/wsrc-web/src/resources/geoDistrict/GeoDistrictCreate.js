import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Create, FlexForm, translate } from 'ra-loopback3';
import GeoDistrictInfoInput from './GeoDistrictInfoInput';

class GeoDistrictCreate extends Component {
  formRef = React.createRef();
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Create undoable="false" {...rest} resource="geodistricts">
        <FlexForm redirect="list" formRef={this.formRef}>
          <GeoDistrictInfoInput subFlex translate={translate} {...rest} formRef={this.formRef} />
        </FlexForm>
      </Create>
    );
  }
}

GeoDistrictCreate.propTypes = {
  translate: PropTypes.func,
};

const enhance = compose(translate);
export default enhance(GeoDistrictCreate);
