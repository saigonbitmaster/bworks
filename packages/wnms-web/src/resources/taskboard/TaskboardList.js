import React, { Component } from 'react';
import { List, withDataProvider } from 'ra-loopback3';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import TaskboardGrid from './TaskboardGrid';
class TaskboardList extends Component {
  render() {
    const { dataProvider, classes, dispatch, basePath, ...rest } = this.props;
    return (
      <List title="Task" {...rest} perPage={1000}>
        <TaskboardGrid dataProvider={dataProvider} classes={classes} />
      </List>
    );
  }
}
TaskboardList.propTypes = {
  dataProvider: PropTypes.func,
  classes: PropTypes.object,
  dispatch: PropTypes.any,
  basePath: PropTypes.any,
};
const enhance = compose(withDataProvider, withStyles(styles));
export default enhance(TaskboardList);
