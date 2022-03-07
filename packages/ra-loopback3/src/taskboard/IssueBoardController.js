import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withDataProvider from '../data/withDataProvider';
import { CUSTOM } from '../data/LoopbackRest';
import IssueBoard from './IssueBoard';

@withDataProvider
class IssueBoardController extends Component {
  state = {
    columnData: [],
  };

  translateTitle = status => {
    switch (status) {
      case 'Cần làm':
        return 'todo';
      case 'Đang làm':
        return 'doing';
      case 'Hoàn thành':
        return 'finish';
      default:
        return status;
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.columnData !== prevProps.columnData) {
      this.setState({ columnData: this.props.columnData });
    }
  }
  updateStatus = (id, status) => {
    const { dataProvider } = this.props;
    const requirement = {
      id: id,
      status: status,
    };
    if (status === 'finish') {
      requirement.finishDate = new Date();
    }
    dataProvider(CUSTOM, 'Tasks', {
      method: 'PATCH',
      subUrl: 'updateStatus',
      body: requirement,
    });
  };

  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const { columnData } = this.state;
    const begin = columnData[columnData.findIndex(({ columnTitle }) => columnTitle === source.droppableId)];
    const end = columnData[columnData.findIndex(({ columnTitle }) => columnTitle === destination.droppableId)];

    if (begin === end) {
      const newIssues = Array.from(begin.issues);
      const movedIssue = newIssues[newIssues.findIndex(({ id }) => id === draggableId)];
      newIssues.splice(source.index, 1);
      newIssues.splice(destination.index, 0, movedIssue);
      const newColumn = {
        ...begin,
        issues: newIssues,
      };
      columnData[columnData.findIndex(({ columnTitle }) => columnTitle === source.droppableId)] = newColumn;
    } else {
      const beginIssues = Array.from(begin.issues);
      const movedIssue = beginIssues[beginIssues.findIndex(({ id }) => id === draggableId)];

      beginIssues.splice(source.index, 1);
      const newBegin = {
        ...begin,
        issues: beginIssues,
      };
      const endIssues = Array.from(end.issues);
      const newStatus = this.translateTitle(destination.droppableId);
      movedIssue.status = newStatus;
      endIssues.splice(destination.index, 0, movedIssue);
      const newEnd = {
        ...end,
        issues: endIssues,
      };
      columnData[columnData.findIndex(({ columnTitle }) => columnTitle === source.droppableId)] = newBegin;
      columnData[columnData.findIndex(({ columnTitle }) => columnTitle === destination.droppableId)] = newEnd;

      this.updateStatus(draggableId, newStatus);
    }

    this.setState({ columnData });
  };

  render() {
    const { columnData } = this.state;
    return <IssueBoard columnData={columnData} onDragEnd={this.onDragEnd} />;
  }
}

IssueBoardController.propTypes = {
  columnData: PropTypes.arrayOf(PropTypes.object),
  dataProvider: PropTypes.func,
};

export default IssueBoardController;
