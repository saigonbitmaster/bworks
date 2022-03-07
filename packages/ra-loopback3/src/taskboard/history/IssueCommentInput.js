import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Button, TextField as MuiTextField, Grid, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Storage } from '../../data/Storage';
import { ReferenceField } from 'react-admin';
import Send from '@material-ui/icons/Send';

const styles = () => ({
  commentBox: {
    marginTop: '1em',
    marginBottom: '1em',
    padding: '1.5em',
    backgroundColor: '#EFE8E4',
    flexGrow: 1,
  },
  submitButton: {
    paddingLeft: '0',
  },
});

const ReferredTooltip = ({ record }) =>
  record && record.fullName ? (
    <Tooltip title={record.fullName} placement="left">
      <Avatar>S</Avatar>
    </Tooltip>
  ) : null;

ReferredTooltip.propTypes = {
  record: PropTypes.object,
};

class IssueCommentInput extends Component {
  state = {
    createDataLocal: '',
    editDataLocal: '',
  };

  editDataLocal = event => {
    event.preventDefault();
    this.setState({ editDataLocal: event.target.value });
  };

  createDataLocal = event => {
    event.preventDefault();
    this.setState({ createDataLocal: event.target.value });
  };

  render() {
    const { classes, record, editId, history, editComment, postComment } = this.props;
    const { editDataLocal, createDataLocal } = this.state;
    const { userId: userId } = Storage.getUser();
    const placeholder = 'Bình luận của bạn';

    return (
      <Fragment>
        <Grid container spacing={1} className={classes.commentBox}>
          <Grid item>
            <ReferenceField
              label="user"
              source={editId ? 'creatorId' : 'userId'}
              record={editId ? history : { ...history, userId }}
              basePath="/appusers"
              reference="appusers"
            >
              <ReferredTooltip record={record} />
            </ReferenceField>
          </Grid>
          <Grid item xs={7}>
            {editId ? (
              <MuiTextField value={editDataLocal} fullWidth onChange={this.editDataLocal} placeholder={placeholder} />
            ) : (
              <MuiTextField
                value={createDataLocal}
                fullWidth
                onChange={this.createDataLocal}
                placeholder={placeholder}
              />
            )}
          </Grid>
          <Grid item className={classes.submitButton}>
            <Button
              onClick={() => (editId ? editComment(editId, editDataLocal) : postComment(createDataLocal))}
              className={classes.submitButton}
            >
              <Send />
            </Button>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}
IssueCommentInput.propTypes = {
  editComment: PropTypes.func,
  pushEditComment: PropTypes.func,
  cancelEditComment: PropTypes.func,
  classes: PropTypes.object,
  translate: PropTypes.func,
  dataProvider: PropTypes.func,
  basePath: PropTypes.any,
  postComment: PropTypes.func,
  editId: PropTypes.string,
  history: PropTypes.object,
  record: PropTypes.object,
};

export default withStyles(styles)(IssueCommentInput);
