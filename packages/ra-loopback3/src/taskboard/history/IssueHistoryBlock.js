import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import { ReferenceField, FunctionField, CUSTOM, DELETE, translate } from 'react-admin';
import { withStyles } from '@material-ui/core/styles';
import flatMap from 'lodash/flatMap';
import ActivityRecord from './ActivityRecord';
import { sortByDate } from './groupActivitiesByDate';

const styles = () => ({
  timeCreate: {
    color: '#8B8989',
  },
  modifier: {
    display: 'inline',
  },
});

@translate
class IssueHistoryBlock extends Component {
  state = {};

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
    const { classes, histories } = this.props;
    const flattenedHistories = flatMap(histories, ({ activities, ...rest }) =>
      activities ? activities.map(activity => ({ activity, ...rest })) : { ...rest },
    );
    const sortedHistories = flattenedHistories.sort(
      ({ createdDate: prevCreatedDate }, { createdDate: curCreatedDate }) =>
        sortByDate(prevCreatedDate, curCreatedDate),
    );
    return sortedHistories.map(history => (
      <Fragment key={history.id}>
        <ListItem alignitems="flex-start">
          <ListItemAvatar>
            <Avatar aria-label="Recipe">S</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <span>
                <ReferenceField
                  label="user"
                  source="creatorId"
                  reference="appusers"
                  record={history}
                  basePath="/appusers"
                >
                  <FunctionField
                    className={classes.modifier}
                    render={({ fullName }) => {
                      let result = `${fullName} `;
                      return result;
                    }}
                  />
                </ReferenceField>
                {history.description.length > 0 ? (
                  <span>
                    {this.props.translate('ra.taskhistories.commented') + ' '}
                    {history.description}
                  </span>
                ) : (
                  history.activity && <ActivityRecord key={history.activity.field} activity={history.activity} />
                )}
              </span>
            }
            secondary={
              <FunctionField
                className={classes.timeCreate}
                render={() => new Date(history.createdDate).toLocaleTimeString()}
              />
            }
          />
        </ListItem>
      </Fragment>
    ));
  }
}

IssueHistoryBlock.propTypes = {
  histories: PropTypes.array,
  classes: PropTypes.object,
  postComment: PropTypes.func,
  stopEdit: PropTypes.string,
  userId: PropTypes.string,
  formRef: PropTypes.any,
  values: PropTypes.any,
  dataProvider: PropTypes.func,
  updateHistories: PropTypes.func,
  editId: PropTypes.string,
  cancelEditComment: PropTypes.func,
  pushEditComment: PropTypes.func,
  deleteComment: PropTypes.func,
  refresh: PropTypes.func,
  translate: PropTypes.func,
  enumField: PropTypes.any,
  history: PropTypes.array,
};

export default withStyles(styles)(IssueHistoryBlock);
