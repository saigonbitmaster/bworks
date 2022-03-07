import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Create, FlexForm, CUSTOM, translate, withDataProvider } from 'ra-loopback3';
import { compose } from 'recompose';
import ConfigurationInfoInput from './ConfigurationInfoInput';

class ConfigurationCreate extends Component {
  static propTypes = {
    basePath: PropTypes.string,
    model: PropTypes.string,
    changeFieldValue: PropTypes.any,
    redirect: PropTypes.string,
    translate: PropTypes.any,
    dataProvider: PropTypes.func,
  };
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      idchoices: [],
    };
  }

  componentDidMount() {
    this.getUnusedChoices();
  }

  getUnusedChoices = () => {
    this.props
      .dataProvider(CUSTOM, 'ctmconfigs', {
        subUrl: 'getUnusedChoices',
      })
      .then(async res => {
        if (res.data.length > 0) this.setState({ idchoices: res.data });
      });
  };

  render() {
    const { redirect, ...rest } = this.props;
    const { idchoices } = this.state;
    return (
      <Create title={this.props.translate('resources.ctmconfigs.createTitle')} {...rest}>
        <FlexForm redirect={'list'} formRef={this.formRef}>
          <ConfigurationInfoInput idchoices={idchoices} formRef={this.formRef} />
        </FlexForm>
      </Create>
    );
  }
}
let enhance = compose(withDataProvider, translate);
export default enhance(ConfigurationCreate);
