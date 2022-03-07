import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withDataProvider, CUSTOM, translate, Create, FlexForm } from 'ra-loopback3';
import { compose } from 'recompose';
import CtmTemplateInfoInput from './CtmTemplateInfoInput';

class CtmTemplateCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    const { dataProvider } = this.props;
    const { data } = await dataProvider(CUSTOM, 'ctmtemplates', { subUrl: 'getId' });
    if (data && data.length > 0) {
      const enumId = data.map(id => ({ id, name: id }));
      this.setState({ enumId });
    }
  }
  render() {
    const { dataProvider, dispatch, translate, ...rest } = this.props;
    return this.state ? (
      <Create {...rest}>
        <FlexForm redirect="list">
          <CtmTemplateInfoInput subFlex translate={translate} enumId={this.state.enumId} {...rest} />
        </FlexForm>
      </Create>
    ) : (
      ''
    );
  }
}

CtmTemplateCreate.propTypes = {
  dataProvider: PropTypes.func,
  translate: PropTypes.func,
  dispatch: PropTypes.func,
};

const enhance = compose(withDataProvider, translate);
export default enhance(CtmTemplateCreate);
