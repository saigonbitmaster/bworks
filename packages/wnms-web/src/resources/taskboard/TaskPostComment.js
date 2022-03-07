import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, Avatar, Button, CardContent } from '@material-ui/core';
import { ReferenceField, TextField, RawEditorInput } from 'ra-loopback3';

class TaskPostComment extends Component {
  editDataLocal = description => {
    this.setState({ editDataLocal: description });
  };
  createDataLocal = description => {
    this.setState({ createDataLocal: description });
  };
  handlePostComment = data => {
    this.props.postComment(data);
  };
  render() {
    const { classes, editId, history, editComment, cancelEditComment } = this.props;
    return (
      <Fragment>
        <Card className={classes.card}>
          <CardHeader
            avatar={<Avatar aria-label="Recipe">S</Avatar>}
            title={
              <ReferenceField
                label="user"
                source={editId ? 'creatorId' : 'userId'}
                record={editId ? history : this.props}
                basePath="/appusers"
                reference="appusers"
              >
                <TextField source="fullName" />
              </ReferenceField>
            }
            className={classes.header}
          />
          <CardContent className={classes.postContent}>
            {editId ? (
              <RawEditorInput
                value={history.description}
                className={classes.editorInput}
                label=""
                onChange={this.editDataLocal}
              />
            ) : (
              <RawEditorInput value="" className={classes.editorInput} label="" onChange={this.createDataLocal} />
            )}
            <Button
              color="primary"
              variant="contained"
              onClick={() =>
                editId
                  ? editComment(editId, this.state.editDataLocal)
                  : this.handlePostComment(this.state.createDataLocal)
              }
            >
              Comment
            </Button>
            {editId && (
              <Button
                style={{ margin: '0 0 0 .5em' }}
                color="primary"
                variant="contained"
                onClick={() => cancelEditComment()}
              >
                Cancel
              </Button>
            )}
          </CardContent>
        </Card>
      </Fragment>
    );
  }
}
TaskPostComment.propTypes = {
  editComment: PropTypes.func,
  pushEditComment: PropTypes.func,
  cancelEditComment: PropTypes.func,
  classes: PropTypes.object,
  translate: PropTypes.any,
  dispatch: PropTypes.any,
  dataProvider: PropTypes.func,
  basePath: PropTypes.any,
  postComment: PropTypes.func,
  editId: PropTypes.string,
  history: PropTypes.object,
};

export default TaskPostComment;
