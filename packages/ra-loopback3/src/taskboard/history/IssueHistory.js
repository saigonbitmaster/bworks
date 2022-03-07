import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, List, Card, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { CREATE } from 'ra-loopback3';
import capitalize from 'lodash/capitalize';
import moment from 'moment-timezone';
import { translate } from 'react-admin';
import withDataProvider from '../../data/withDataProvider';
import IssueHistoryBlock from './IssueHistoryBlock';
import IssueCommentInput from './IssueCommentInput';
import { groupByDay } from './groupActivitiesByDate';

const styles = theme => ({
  hr: {
    borderTop: '1px solid #B7ACA5',
  },
  day: {
    marginBottom: '1em',
  },
  daySubheading: {
    marginTop: '.5em',
  },
  card: {
    backgroundColor: theme.palette.background.default,
  },
});

const getDayString = date => capitalize(moment(date).format('dddd, DD/MM/YYYY'));

@translate
@withDataProvider
class IssueHistory extends Component {
  postComment = async description => {
    const {
      record: { id },
      dataProvider,
      updateHistories,
    } = this.props;
    if (!description) return;
    dataProvider(CREATE, 'taskhistories', { data: { taskId: id, description: description } }).then(() =>
      updateHistories(),
    );
  };

  render() {
    const { classes, histories, dataProvider, deleteComment, translate, ...rest } = this.props;
    const { days, historiesByDay } = groupByDay(histories);
    return (
      <Grid className={classes.hr} container spacing={0}>
        <IssueCommentInput postComment={this.postComment} {...rest} />
        <Grid item sm={12} xs={12}>
          {days &&
            histories &&
            days.map(day => (
              <div key={day} className={classes.day}>
                <Typography variant="subheading" gutterBottom className={classes.daySubheading}>
                  {getDayString(day)}
                </Typography>
                <Card className={classes.card}>
                  <List>
                    <IssueHistoryBlock histories={historiesByDay[day]} {...rest} />
                  </List>
                </Card>
              </div>
            ))}
        </Grid>
      </Grid>
    );
  }
}

IssueHistory.propTypes = {
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

export default withStyles(styles)(IssueHistory);
