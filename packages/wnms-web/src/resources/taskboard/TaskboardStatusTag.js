import React, { Component } from 'react';
import { TextField, translate, DateField, ReferenceField } from 'ra-loopback3';
import { connect } from 'react-redux';
import { push as pushAction } from 'react-router-redux';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Chip, Tooltip, Avatar, Grid } from '@material-ui/core';
class TaskboardStatusTag extends Component {
  static propTypes = {
    classes: PropTypes.any,
    id: PropTypes.string,
    record: PropTypes.any,
    index: PropTypes.any,
    push: PropTypes.any,
    status: PropTypes.string,
  };
  getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    borderRadius: '.3em',
    ...draggableStyle,
  });
  editTask = id => {
    this.props.push(`/taskboard/${id}/show`);
  };
  render() {
    const { id, index, record, classes, status } = this.props;
    return (
      <Draggable key={id} draggableId={id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={this.getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
            className={classes.itemCard}
            onClick={() => this.editTask(id)}
          >
            <Grid middle="true" container>
              <Grid middle="true" item sm={10}>
                <div>{record.name}</div>
                <Chip label={record.status} className={classes[`chip${status}`]} />
                <Chip label={<DateField source="dueDate" record={record} />} className={classes.dueDate} />
              </Grid>
              {record && record.assigneeId && (
                <div className={classes.creator}>
                  <Tooltip
                    title={
                      <ReferenceField
                        basePath="Tasks"
                        resource="Tasks"
                        className={classes.fullName}
                        record={record}
                        source="assigneeId"
                        reference="appusers"
                      >
                        <TextField source="fullName" />
                      </ReferenceField>
                    }
                    placement="left"
                  >
                    <Avatar className={classes.avatar}>S</Avatar>
                  </Tooltip>
                </div>
              )}
            </Grid>
          </div>
        )}
      </Draggable>
    );
  }
}

const enhance = compose(translate, connect(null, { push: pushAction }));
export default enhance(TaskboardStatusTag);
