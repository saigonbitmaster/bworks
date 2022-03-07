import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { DragDropContext } from 'react-beautiful-dnd';
import difference from 'lodash/difference';

import IssueColumn from './IssueColumn';

const styles = theme => ({
  root: {
    display: 'flex',
    marginLeft: theme.spacing(1),
  },
});

class IssueBoard extends Component {
  state = {
    columnOrder: {
      todo: 0,
      doing: 1,
      finish: 2,
    },
  };

  sortByDefinedOrder = columnData => {
    const { columnOrder } = this.state;
    columnData.sort((a, b) => columnOrder[a.columnTitle] - columnOrder[b.columnTitle]);
    return columnData;
  };

  createEmptyColumnForMissingOne = columnData => {
    const { columnOrder } = this.state;
    const requiredColumns = Object.keys(columnOrder);
    const availableColumns = columnData.map(({ columnTitle }) => columnTitle);
    const differences = difference(requiredColumns, availableColumns);
    if (differences.length > 0) {
      for (let missingColumn of differences) {
        columnData.push({ issues: [], columnTitle: missingColumn });
      }
    }
    return columnData;
  };

  render() {
    const { columnData, classes, onDragEnd } = this.props;
    const sortedColumnData = this.sortByDefinedOrder(this.createEmptyColumnForMissingOne(columnData));
    return (
      <Paper className={classes.root} elevation={0} square>
        <DragDropContext onDragEnd={onDragEnd}>
          {sortedColumnData.map(({ issues, columnTitle }) => (
            <IssueColumn issues={issues} columnTitle={columnTitle} key={columnTitle} />
          ))}
        </DragDropContext>
      </Paper>
    );
  }
}

IssueBoard.propTypes = {
  columnData: PropTypes.arrayOf(PropTypes.object),
  classes: PropTypes.object,
  onDragEnd: PropTypes.func,
};

export default withStyles(styles)(IssueBoard);
