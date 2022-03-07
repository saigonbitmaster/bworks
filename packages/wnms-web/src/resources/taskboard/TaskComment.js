import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { /* Menu, */ Card, CardHeader, Avatar, CardContent, IconButton, Grid } from '@material-ui/core';
import { ReferenceField, FunctionField, HtmlField, CUSTOM, DELETE } from 'ra-loopback3';
import { /* MoreVert as MoreVertIcon ,*/ Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import TaskPostComment from './TaskPostComment';
import ActivityRecord from './ActivityRecord';

class TaskComment extends Component {
  constructor(props) {
    super(props);
    this.state = this.props;
  }
  editId = history => {
    this.setState({ editId: history.id });
  };
  editComment = (editId, description) => {
    const { dataProvider } = this.props;
    dataProvider(CUSTOM, 'taskhistories', {
      method: 'POST',
      subUrl: 'updateComment',
      body: { id: editId, description: description },
    }).then(() => {
      const history = this.props.history;
      history['description'] = description;
      this.setState({ editId: '', history });
    });
  };
  deleteComment = id => {
    const { dataProvider } = this.props;
    dataProvider(DELETE, 'TaskHistories', { id: id }).then(() => {
      this.setState({ history: '' });
    });
  };
  cancelEditComment = () => {
    this.setState({ editId: '' });
  };
  optionMenuClose = () => {
    this.setState({ anchorEl: null });
  };
  optionMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };
  render() {
    const { classes, history, userId, translate, ...rest } = this.state;
    const { activities } = history;
    return (
      <Fragment>
        {history && this.state.editId && this.state.editId === history.id ? (
          <TaskPostComment
            classes={classes}
            editId={this.state.editId}
            editComment={this.editComment}
            cancelEditComment={this.cancelEditComment}
            key={history.id}
            history={history}
            {...rest}
          />
        ) : history ? (
          <Card className={classes.card}>
            <CardHeader
              avatar={<Avatar aria-label="Recipe">S</Avatar>}
              title={
                <Grid middle="true" container>
                  <Grid middle="true" item>
                    <ReferenceField
                      label="user"
                      source="creatorId"
                      reference="appusers"
                      record={history}
                      basePath="/appusers"
                    >
                      <FunctionField
                        render={({ fullName }) => {
                          let result = `${fullName} `;
                          return result;
                        }}
                      />
                    </ReferenceField>
                  </Grid>
                  <Grid middle="true" item>
                    <FunctionField
                      className={classes.timeCreate}
                      render={() => {
                        let time = moment(history.createdDate).fromNow();
                        return time;
                      }}
                    />
                  </Grid>
                </Grid>
              }
              className={classes.header}
              action={
                <div className={classes.action}>
                  {/* <Chip label="Admin" /> */}
                  {userId === history.creatorId && !activities && (
                    <IconButton onClick={() => this.editId(history)}>
                      <EditIcon />
                    </IconButton>
                  )}
                  {/* // user for more than one opt (example report, delete, share)
                  <IconButton onClick={this.optionMenu} aria-owns={anchorEl ? editId : null} aria-haspopup="true">
                    <MoreVertIcon>
                      <DeleteIcon />
                    </MoreVertIcon>
                  </IconButton>
                  {!activities &&
                    userId === history.creatorId && (
                      <Menu id={editId} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.optionMenuClose}>
                        <IconButton onClick={() => deleteComment(history.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Menu>
                    )} */}
                  {!activities && userId === history.creatorId && (
                    <IconButton onClick={() => this.deleteComment(history.id)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </div>
              }
            />
            <CardContent className={classes.content}>
              {history.description.length > 0 ? (
                <HtmlField /* className={classes.description}  */ source="description" record={history} />
              ) : (
                <Grid /* className={classes.statusTask} */>
                  {activities &&
                    activities.map(activity => {
                      return <ActivityRecord translate={translate} key={activity.field} activity={activity} />;
                    })}
                </Grid>
              )}
              {history.createdDate !== history.updatedDate && (
                <ReferenceField
                  label="Author"
                  source="updaterId"
                  reference="appusers"
                  record={history}
                  basePath="/appusers"
                  linkType={false}
                >
                  <FunctionField
                    className={classes.editor}
                    render={record => {
                      let result = 'Edited by ' + record.fullName + ' ';
                      result += moment(history.updatedDate).fromNow();
                      return result;
                    }}
                  />
                </ReferenceField>
              )}
            </CardContent>
          </Card>
        ) : (
          ''
        )}
      </Fragment>
    );
  }
}

TaskComment.propTypes = {
  histories: PropTypes.array,
  classes: PropTypes.object,
  postComment: PropTypes.func,
  stopEdit: PropTypes.string,
  userId: PropTypes.string,
  formRef: PropTypes.any,
  values: PropTypes.any,
  dataProvider: PropTypes.func,
  updateHistories: PropTypes.func,
  history: PropTypes.any,
  editId: PropTypes.string,
  cancelEditComment: PropTypes.func,
  pushEditComment: PropTypes.func,
  deleteComment: PropTypes.func,
  refresh: PropTypes.func,
  translate: PropTypes.func,
  enumField: PropTypes.object,
};

export default TaskComment;
