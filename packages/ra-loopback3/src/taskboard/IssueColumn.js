import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { Droppable } from 'react-beautiful-dnd';

import IssueCard from './IssueCard';

const styles = theme => ({
  root: {
    flexBasis: 'calc(100% / 3)',
    backgroundColor: theme.palette.grey[200],
    paddingBlockStart: `${theme.spacing(1) + 2}px`,
    margin: theme.spacing(1),
    flexGrow: 1,
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
  },
  todo: {
    borderTop: '5px solid skyblue',
  },
  doing: {
    borderTop: '5px solid limegreen',
  },
  finish: {
    borderTop: '5px solid indianred',
  },
  header: {
    marginLeft: theme.spacing(2),
  },
  list: {
    maxHeight: '60vh',
    overflow: 'auto',
  },
  droppable: {
    minHeight: '200px',
  },
  listItem: {
    paddingLeft: theme.spacing(1) - 1,
    paddingRight: theme.spacing(1) - 1,
    paddingTop: 0,
  },
});

const translateTitle = status => {
  switch (status) {
    case 'todo':
      return 'Cần làm';
    case 'doing':
      return 'Đang làm';
    case 'finish':
      return 'Hoàn thành';
    default:
      return status;
  }
};

const IssueColumn = ({ columnTitle, issues, classes }) => {
  const translatedColumnTitle = translateTitle(columnTitle);
  return (
    <div className={classnames(classes.root, classes[columnTitle])}>
      <Typography className={classes.header} variant="headline">
        {translatedColumnTitle}
      </Typography>
      <List className={classes.list}>
        <Droppable droppableId={columnTitle}>
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps} className={classes.droppable}>
              {issues.map(({ content, status, assigneeId, id }, index) => {
                const translatedStatus = translateTitle(status);
                return (
                  <ListItem className={classes.listItem} key={id}>
                    <IssueCard
                      content={content}
                      status={status}
                      translatedStatus={translatedStatus}
                      assigneeId={assigneeId}
                      id={id}
                      index={index}
                    />
                  </ListItem>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </List>
    </div>
  );
};

IssueColumn.propTypes = {
  columnTitle: PropTypes.string,
  issues: PropTypes.arrayOf(PropTypes.object),
  classes: PropTypes.object,
};

export default withStyles(styles)(IssueColumn);
