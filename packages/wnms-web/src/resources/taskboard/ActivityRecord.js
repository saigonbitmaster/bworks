import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Typography, withStyles } from '@material-ui/core';
import { ReferenceField, TextField, DateField, HtmlField } from 'ra-loopback3';

const styles = theme => {
  return {
    changed: {
      color: theme.palette.grey['A700'],
    },
    commentStatus: {
      width: 'max-content',
      display: 'inline-flex',
    },
  };
};
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
        act.value.old = translate(`resources.tasks.fields.statuses.${activity.value.old}`);
        act.value.new = translate(`resources.tasks.fields.statuses.${activity.value.new}`);
        oldValue = <TextField className={classes.commentStatus} source="old" record={act.value} />;
        newValue = <TextField className={classes.commentStatus} source="new" record={act.value} />;
        break;
      case 'type':
        act.value.old = translate(`resources.tasks.fields.types.${activity.value.old}`);
        act.value.new = translate(`resources.tasks.fields.types.${activity.value.new}`);
        oldValue = <TextField className={classes.commentStatus} source="old" record={act.value} />;
        newValue = <TextField className={classes.commentStatus} source="new" record={act.value} />;
        break;
      case 'priority':
        act.value.old = translate(`resources.tasks.fields.priorities.${activity.value.old}`);
        act.value.new = translate(`resources.tasks.fields.priorities.${activity.value.new}`);
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
      <Typography component="div">
        <span className={classes.changed}>{translate('resources.taskhistories.fields.changed')} &nbsp;</span>
        {translate(`resources.tasks.fields.${activity.field}`)}
        <span className={classes.changed}>&nbsp; {translate('resources.taskhistories.fields.from')} &nbsp;</span>
        {oldValue}
        <span className={classes.changed}>&nbsp; {translate('resources.taskhistories.fields.toBe')} &nbsp;</span>
        {newValue}
      </Typography>
    );
  }
}
ActivityRecord.propTypes = {
  activity: PropTypes.object,
  translate: PropTypes.func,
  classes: PropTypes.object,
};
const enhance = compose(withStyles(styles));
export default enhance(ActivityRecord);
