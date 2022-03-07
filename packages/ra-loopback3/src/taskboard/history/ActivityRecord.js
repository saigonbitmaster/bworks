import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { ReferenceField, TextField, DateField, HtmlField } from 'ra-loopback3';
import { translate } from 'react-admin';

const styles = theme => {
  return {
    changed: {
      color: theme.palette.grey['A700'],
      textTransform: 'lowercase',
    },
    commentStatus: {
      width: 'max-content',
      display: 'inline-flex',
    },
  };
};

@translate
class ActivityRecord extends Component {
  render() {
    const { activity, translate, classes } = this.props;
    let oldValue, newValue;
    if (!activity && !activity.field) return <div>no field</div>;
    const act = { value: { old: '', new: '' } };
    switch (activity.field) {
      case 'name':
        oldValue = <TextField className={classes.commentStatus} source="old" record={activity.value} />;
        newValue = <TextField className={classes.commentStatus} source="new" record={activity.value} />;
        break;
      case 'description':
        oldValue = <HtmlField source="old" record={activity.value} />;
        newValue = <HtmlField source="new" record={activity.value} />;
        break;
      case 'status':
        act.value.old = translate(`ra.tasks.statuses.${activity.value.old}`);
        act.value.new = translate(`ra.tasks.statuses.${activity.value.new}`);
        oldValue = <TextField className={classes.commentStatus} source="old" record={act.value} />;
        newValue = <TextField className={classes.commentStatus} source="new" record={act.value} />;
        break;
      case 'type':
        act.value.old = translate(`ra.tasks.types.${activity.value.old}`);
        act.value.new = translate(`ra.tasks.types.${activity.value.new}`);
        oldValue = <TextField className={classes.commentStatus} source="old" record={act.value} />;
        newValue = <TextField className={classes.commentStatus} source="new" record={act.value} />;
        break;
      case 'priority':
        act.value.old = translate(`ra.tasks.priorities.${activity.value.old}`);
        act.value.new = translate(`ra.tasks.priorities.${activity.value.new}`);
        oldValue = <TextField className={classes.commentStatus} source="old" record={act.value} />;
        newValue = <TextField className={classes.commentStatus} source="new" record={act.value} />;
        break;
      case 'startDate':
      case 'dueDate':
        oldValue = <DateField className={classes.commentStatus} source="old" record={activity.value} />;
        newValue = <DateField className={classes.commentStatus} source="new" record={activity.value} />;
        break;
      case 'estimateTime':
        oldValue = <TextField className={classes.commentStatus} source="old" record={activity.value} />;
        newValue = <TextField className={classes.commentStatus} source="new" record={activity.value} />;
        break;
      case 'attachedFiles':
        oldValue =
          activity.value.old.length > 0
            ? activity.value.old.map(item => {
                return (
                  <a style={{ textDecoration: 'none' }} key={item.url} href={item.url || ''}>
                    {item.name || translate(`resources.taskhistories.fields.blank`)} &nbsp;
                  </a>
                );
              })
            : translate(`resources.taskhistories.fields.blank`);
        newValue =
          activity.value.new.length > 0
            ? activity.value.new.map(item => {
                return (
                  <a style={{ textDecoration: 'none' }} key={item.url} href={item.url || ''}>
                    {item.name || translate(`resources.taskhistories.fields.blank`)} &nbsp;
                  </a>
                );
              })
            : translate(`resources.taskhistories.fields.blank`);
        break;
      case 'assigneeId':
        oldValue = (
          <ReferenceField
            className={classes.commentStatus}
            source="old"
            reference="appusers"
            record={activity.value}
            basePath="/appusers"
          >
            <TextField source="fullName" />
          </ReferenceField>
        );
        newValue = (
          <ReferenceField
            className={classes.commentStatus}
            source="new"
            reference="appusers"
            record={activity.value}
            basePath="/appusers"
          >
            <TextField source="fullName" />
          </ReferenceField>
        );
        break;
      default:
        oldValue = activity.value.old;
        newValue = activity.value.new;
    }
    return (
      <span>
        <span className={classes.changed}>{translate('ra.taskhistories.changed')} &nbsp;</span>
        {translate(`ra.tasks.fields.${activity.field}`)}
        <span className={classes.changed}>&nbsp; {translate('ra.taskhistories.from')} &nbsp;</span>
        {oldValue}
        <span className={classes.changed}>&nbsp; {translate('ra.taskhistories.tobe')} &nbsp;</span>
        {newValue}
      </span>
    );
  }
}
ActivityRecord.propTypes = {
  activity: PropTypes.object,
  translate: PropTypes.func,
  classes: PropTypes.object,
};

export default withStyles(styles)(ActivityRecord);
