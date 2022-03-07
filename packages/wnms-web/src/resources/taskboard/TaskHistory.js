import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { translate, CREATE, GET_ONE } from 'ra-loopback3';
import { taskHistoryStyles } from './styles';
import TaskComment from './TaskComment';
import TaskPostComment from './TaskPostComment';
class TaskHistory extends Component {
  constructor(props) {
    super(props);
    this.state = this.props;
  }
  componentDidUpdate() {
    if (this.state.histories !== this.props.histories) {
      const histories = this.props.histories;
      this.setState({ histories });
    }
  }
  postComment = async description => {
    const { id } = this.props.record;
    const { dataProvider } = this.props;
    let { data } = await dataProvider(CREATE, 'taskhistories', { data: { taskId: id, description: description } });
    let { data: res } = await dataProvider(GET_ONE, 'taskhistories', { id: data.id });
    const histories = this.props.histories;
    histories.push(res);
    this.setState({ histories });
  };
  render() {
    const { classes, histories, dataProvider, deleteComment, translate, ...rest } = this.state;
    return (
      <Grid className={classes.hr} container spacing={0}>
        <Grid item sm={12} xs={12}>
          {histories &&
            histories.map(history => (
              <TaskComment
                history={history}
                classes={classes}
                dataProvider={dataProvider}
                translate={translate}
                {...rest}
                key={history.id}
              />
            ))}
          <TaskPostComment postComment={this.postComment} classes={classes} {...rest} />
        </Grid>
      </Grid>
    );
  }
}

TaskHistory.propTypes = {
  histories: PropTypes.array,
  classes: PropTypes.object,
  translate: PropTypes.any,
  dispatch: PropTypes.any,
  dataProvider: PropTypes.any,
  push: PropTypes.any,
  basePath: PropTypes.any,
  formRef: PropTypes.any,
  postComment: PropTypes.func,
  values: PropTypes.any,
  updateHistories: PropTypes.func,
  deleteComment: PropTypes.func,
  refresh: PropTypes.func,
  record: PropTypes.object,
};
const enhance = compose(translate, withStyles(taskHistoryStyles));

export default enhance(TaskHistory);
