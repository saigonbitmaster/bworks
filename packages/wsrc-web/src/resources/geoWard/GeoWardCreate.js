import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Create, translate, FlexForm } from 'ra-loopback3';
import GeoWardInfoInput from './GeoWardInfoInput';

class GeoWardCreate extends Component {
  formRef = React.createRef();
  render() {
    const { translate, ...rest } = this.props;
    return (
      <Create resource="geowards" title="abc" undoable="false" {...rest}>
        <FlexForm formRef={this.formRef} redirect="list">
          <GeoWardInfoInput subFlex translate={translate} formRef={this.formRef} />
        </FlexForm>
      </Create>
    );
  }
}

GeoWardCreate.propTypes = {
  translate: PropTypes.func,
};

const enhance = compose(translate);
export default enhance(GeoWardCreate);
