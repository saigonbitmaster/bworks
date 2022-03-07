import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Edit, TabbedFlexForm, FlexFormTab, translate } from 'ra-loopback3';
import TaskboardInfoInput from './TaskboardInfoInput';
class TaskboardEdit extends Component {
  static propTypes = {
    basePath: PropTypes.string,
    model: PropTypes.string,
    changeFieldValue: PropTypes.any,
    redirect: PropTypes.string,
    translate: PropTypes.any,
  };

  constructor(props) {
    super(props);
  }
  // undoable make new data in TaskComment ComponentDidMount
  render() {
    const { redirect, translate, ...rest } = this.props;
    return (
      <Edit resource="Tasks" title={translate('resources.tasks.edit')} undoable={false} {...rest}>
        <TabbedFlexForm redirect={'show'}>
          <FlexFormTab key={1} label={translate('generic.info')}>
            <TaskboardInfoInput {...this.props} />
          </FlexFormTab>
        </TabbedFlexForm>
      </Edit>
    );
  }
}

let enhance = compose(translate);
export default enhance(TaskboardEdit);
