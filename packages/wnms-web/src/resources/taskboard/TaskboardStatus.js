import React, { Component } from 'react';
import { translate } from 'ra-loopback3';
import { Droppable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Card, CardHeader, CardContent, Grid } from '@material-ui/core';
import TaskboardStatusTag from './TaskboardStatusTag';
class TaskboardStatus extends Component {
  static defaultProps = {
    ids: [],
    data: [],
  };
  static propTypes = {
    classes: PropTypes.any,
    ids: PropTypes.any,
    data: PropTypes.any,
    translate: PropTypes.any,
    status: PropTypes.string,
  };
  getListStyle = /*isDraggingOver*/ () => ({
    margin: '.5em',
  });
  render() {
    const { ids, data, classes, status, translate } = this.props;
    return (
      <Grid className={classes.frame} middle="true" item md={4} sm={4} xs={12} key={status}>
        <Card className={classes.card}>
          <CardHeader title={translate(`resources.tasks.fields.statuses.${status}`)} className={classes.headerCard} />
          <Droppable droppableId={status}>
            {(provided, snapshot) => (
              <div ref={provided.innerRef} style={this.getListStyle(snapshot.isDraggingOver)}>
                <CardContent className={classes.contentCard}>
                  {ids.map(id => {
                    return data && data[id] && data[id].status === status ? (
                      <TaskboardStatusTag key={id} status={status} id={id} record={data[id]} classes={classes} />
                    ) : (
                      ''
                    );
                  })}
                </CardContent>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Card>
      </Grid>
    );
  }
}

const enhance = compose(translate);
export default enhance(TaskboardStatus);
