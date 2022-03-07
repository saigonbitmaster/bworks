import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import { ReferenceField } from 'react-admin';

const styles = theme => ({
  avatar: {
    margin: theme.spacing(1),
  },
});

const ChildIssueAvatar = ({ record, source, classes }) =>
  record[source] ? (
    <Tooltip title={`Thực hiện bởi ${record[source]}`}>
      <Avatar className={classes.avatar}>{record[source][0]}</Avatar>
    </Tooltip>
  ) : null;

ChildIssueAvatar.propTypes = {
  record: PropTypes.object,
  source: PropTypes.string,
  classes: PropTypes.object,
};

const IssueAvatar = ({ assigneeId, classes }) => {
  return (
    <ReferenceField
      basePath="Tasks"
      resource="Tasks"
      className={classes.fullName}
      record={{ assigneeId }}
      source="assigneeId"
      reference="appusers"
    >
      <ChildIssueAvatar record={{}} classes={classes} source="username" />
    </ReferenceField>
  );
};

IssueAvatar.propTypes = {
  assigneeId: PropTypes.string,
  classes: PropTypes.object,
};

export default withStyles(styles)(IssueAvatar);
