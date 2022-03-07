import React, { Component } from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import mapKeys from 'lodash/mapKeys';
import { CardActions } from 'react-admin';
import { URL_ONLY } from '../data/LoopbackRest';
import withDataProvider from '../data/withDataProvider';
import SFCreateButton from '../layout/SFCreateButton';
import CustomPage from '../layout/CustomPage';
import IssueBoardController from './IssueBoardController';

const TaskCreateAction = ({ basePath, permission }) => (
  <CardActions>
    <SFCreateButton style={{ margin: '8px' }} basePath={basePath} permission={permission} />
  </CardActions>
);

TaskCreateAction.propTypes = {
  basePath: PropTypes.string,
  permission: PropTypes.object,
};

@withDataProvider
class TaskboardList extends Component {
  state = {
    columnData: [],
  };

  componentDidMount() {
    const { dataProvider, projectKey } = this.props;
    dataProvider(URL_ONLY, 'Tasks', {
      filter: {
        where: { projectKey },
      },
    })
      .then(({ data: { url } }) => fetch(url))
      .then(res => res.json())
      .then(tasks => this.setState({ columnData: this.categorizeTask(tasks) }));
  }

  categorizeTask = tasks => {
    // Input: [{...name, status}, {...name, status}, {...name, status}, ...]
    // Output: [{issue: [{content, assignee, status}], columnTitle: }]
    const tasksByStatus = Object.entries(groupBy(tasks, 'status'));
    const categorizedTasks = [];
    for (let [status, tasks] of tasksByStatus) {
      const column = { columnTitle: status, issues: [] };
      const processedTasks = tasks.map(task =>
        mapKeys(task, (_, key) => {
          switch (key) {
            case 'name':
              return 'content';
            default:
              return key;
          }
        }),
      );
      column.issues = processedTasks;
      categorizedTasks.push(column);
    }
    return categorizedTasks;
  };

  render() {
    const { columnData } = this.state;
    const { title, basePath, screenName, ...rest } = this.props;
    return (
      <CustomPage
        rawTitle={title}
        header
        card
        actions={<TaskCreateAction basePath={basePath} permission={{ name: screenName, action: 'create' }} />}
        {...rest}
      >
        <IssueBoardController columnData={columnData} />
      </CustomPage>
    );
  }
}

TaskboardList.propTypes = {
  basePath: PropTypes.string,
  dataProvider: PropTypes.func,
  title: PropTypes.string,
  projectKey: PropTypes.string,
  screenName: PropTypes.string,
};

export default TaskboardList;
