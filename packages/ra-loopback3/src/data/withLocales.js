import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommonProviderContext from './CommonProviderContext';

const withLocales = BaseComponent => {
  class DataProviderComponent extends Component {
    static propTypes = {
      dispatch: PropTypes.func,
    };
    render() {
      return (
        <CommonProviderContext.Consumer>
          {({ locales }) => <BaseComponent {...this.props} locales={locales} />}
        </CommonProviderContext.Consumer>
      );
    }
  }
  return DataProviderComponent;
};
export default withLocales;
