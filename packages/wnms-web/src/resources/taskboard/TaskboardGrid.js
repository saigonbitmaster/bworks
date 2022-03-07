import React, { Component } from 'react';
import { CUSTOM } from 'ra-loopback3';
import { DragDropContext } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import TaskboardStatus from './TaskboardStatus';
class TaskboardGrid extends Component {
  static defaultProps = {
    ids: [],
    data: [],
  };
  static propTypes = {
    ids: PropTypes.any,
    data: PropTypes.any,
  };
  constructor(props) {
    super(props);
    this.state = this.props;
  }
  async componentDidMount() {
    const {
      data: { status },
    } = await this.state.dataProvider(CUSTOM, 'Tasks', { subUrl: 'getAllEnum' });
    this.setState({ statusCore: status });
  }
  componentDidUpdate(/*preProps*/) {
    if (this.props.ids !== this.state.ids || !this.state.ids) {
      this.setState({ data: this.props.data, ids: this.props.ids });
    }
  }
  updateStatus = (id, status) => {
    const requirement = {
      id: id,
      status: status,
    };
    status === 'finish' ? Object.assign(requirement, { finishDate: new Date() }) : '';
    this.state.dataProvider(CUSTOM, 'Tasks', {
      method: 'PATCH',
      subUrl: 'updateStatus',
      body: requirement,
    });
  };
  onDragEnd = result => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;
    else {
      let data = {};
      data[draggableId] = this.state.data[draggableId];
      data[draggableId].status = destination.droppableId;
      let status = data[draggableId].status;
      this.updateStatus(draggableId, status);
      this.setState({ data: { ...this.state.data, ...data } });
    }
  };
  render() {
    const { ids, data, classes, statusCore } = this.state;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Grid className={classes.container} middle="true" container>
          {statusCore &&
            statusCore.map(status => {
              return <TaskboardStatus key={status} classes={classes} status={status} ids={ids} data={data} />;
            })}
        </Grid>
      </DragDropContext>
    );
  }
}

export default TaskboardGrid;
