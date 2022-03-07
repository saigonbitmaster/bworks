import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Create, FlexForm, /*CUSTOM,*/ translate, withDataProvider } from 'ra-loopback3';
import { compose } from 'recompose';
import TaskboardInfoInput from './TaskboardInfoInput';

class TaskboardCreate extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { redirect, dispatch, dataProvider, ...rest } = this.props;
    return (
      <Create title={this.props.translate('resources.tasks.create')} {...rest}>
        <FlexForm redirect={'list'}>
          <TaskboardInfoInput dispatch={dispatch} dataProvider={dataProvider} />
        </FlexForm>
      </Create>
    );
  }
}
let enhance = compose(withDataProvider, translate);
TaskboardCreate.propTypes = {
  dataProvider: PropTypes.func,
  translate: PropTypes.any,
  redirect: PropTypes.string,
  dispatch: PropTypes.any,
  push: PropTypes.any,
  basePath: PropTypes.any,
};
export default enhance(TaskboardCreate);
