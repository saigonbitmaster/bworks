import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlexForm, Create, translate, withDataProvider } from 'ra-loopback3';
import compose from 'recompose/compose';
import queryString from 'query-string';
import InfoKml from './InfoKml';

const CreateTitle = ({ label }) => <span>{label}</span>;
CreateTitle.propTypes = { label: PropTypes.string.isRequired };

class CreateKml extends Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    let query = queryString.parse(props.location.search);
    this.state = {
      redirect: query.redirect || 'list',
    };
  }
  render() {
    const { translate, dataProvider, ...rest } = this.props;
    return (
      <Create {...rest} resource="kmls" title={<CreateTitle label={translate('resources.kmls.import')} />}>
        <FlexForm formRef={this.formRef} style={{ flexGrow: 1 }} spacing={2} redirect={this.state.redirect}>
          <InfoKml formRef={this.formRef} />
        </FlexForm>
      </Create>
    );
  }
}
CreateKml.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  dataProvider: PropTypes.func,
  location: PropTypes.any,
};

CreateKml.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

export default compose(translate, withDataProvider)(CreateKml);
