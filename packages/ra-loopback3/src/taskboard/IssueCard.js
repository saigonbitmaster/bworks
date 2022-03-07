import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Chip from '@material-ui/core/Chip';
import { Draggable } from 'react-beautiful-dnd';
import classnames from 'classnames';
import { linkToRecord } from 'ra-core';

import Button from '../layout/Button';
import IssueAvatar from './IssueAvatar';

const styles = theme => ({
  draggable: {
    width: '100%',
  },
  root: {
    width: '100%',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  contentContainer: {
    paddingBottom: 0,
    fontWeight: 'bold',
    overflowWrap: 'word-break',
  },
  content: {
    fontWeight: 'bold',
    color: '#2E2E2E',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  },
  chip: {
    margin: theme.spacing(1),
    width: '82px',
    height: '28px',
  },
  todo: {
    background: 'skyblue',
  },
  doing: {
    background: 'limegreen',
  },
  finish: {
    background: '#cd5c5c94',
  },
  assignee: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  avatar: {
    margin: theme.spacing(1),
  },
});

const IssueCard = ({ content, status, translatedStatus, assigneeId, id, index, classes }) => {
  if (content && status && assigneeId) {
    return (
      <Draggable draggableId={id} index={index}>
        {provided => (
          <div
            className={classes.draggable}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Card className={classes.root}>
              <CardContent className={classes.contentContainer}>
                <Button
                  isLink={true}
                  innerClass={classes.content}
                  permission={{ name: 'Taskboard', action: 'show' }}
                  linkTo={linkToRecord('/taskboards', id, 'show')}
                >
                  {content}
                </Button>
              </CardContent>
              <CardActions className={classes.actions} disableSpacing>
                <Chip className={classnames(classes.chip, classes[status])} label={translatedStatus} />
                <div className={classes.assignee}>
                  <IssueAvatar key={assigneeId} assigneeId={assigneeId} />
                </div>
              </CardActions>
            </Card>
          </div>
        )}
      </Draggable>
    );
  }
  return null;
};

IssueCard.propTypes = {
  content: PropTypes.string,
  status: PropTypes.string,
  translatedStatus: PropTypes.string,
  assigneeId: PropTypes.string,
  id: PropTypes.string,
  index: PropTypes.number,
  classes: PropTypes.object,
};

export default withStyles(styles)(IssueCard);
