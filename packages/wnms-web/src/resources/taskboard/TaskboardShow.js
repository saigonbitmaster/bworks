import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import {
  Show,
  translate,
  FlexForm,
  TextField,
  ReferenceField,
  RichTextField,
  DateField,
  FunctionField,
  withDataProvider,
  GET_LIST,
  Storage,
  CUSTOM,
} from 'ra-loopback3';
import TaskHistory from './TaskHistory';
class TaskboardShow extends Component {
  // formRef = React.createRef();
  state = { histories: [] };
  constructor(props) {
    super(props);
    const { userId } = Storage.getUser();
    this.state['userId'] = userId;
  }
  translateStatus = (field, value) => {
    return this.props.translate(`resources.tasks.fields.${field}.${value}`);
  };
  // postComment = editId => {
  //   if (editId) {
  //     const { description } = this.formRef.current.props.values;
  //     const { dataProvider } = this.props;
  //     dataProvider(CUSTOM, 'taskhistories', {
  //       method: 'POST',
  //       subUrl: 'updateComment',
  //       body: { id: editId, description },
  //     }).then(() => {
  //       let stopEdit = editId;
  //       this.updateHistories(stopEdit);
  //     });
  //   } else {
  //     const props = this.formRef.current.props;
  //     const { id, comment } = props.values || {};
  //     // call api post a comment to task
  //     const { dataProvider } = this.props;
  //     dataProvider(CREATE, 'taskhistories', { data: { taskId: id, description: comment } }).then(() => {
  //       // let current = this.formRef.current;
  //       this.formRef.current.props.change('comment', '');
  //       this.updateHistories();
  //     });
  //   }
  // };
  enumField = async () => {
    const { data } = await this.props.dataProvider(CUSTOM, 'Tasks', { subUrl: 'getAllEnum' });
    const status = data.status.map(i => {
      return { id: i, name: this.props.translate(`resources.tasks.fields.statuses.${i}`) };
    });
    const type = data.type.map(i => {
      return { id: i, name: this.props.translate(`resources.tasks.fields.types.${i}`) };
    });
    const priority = data.priority.map(i => {
      return { id: i, name: this.props.translate(`resources.tasks.fields.priorities.${i}`) };
    });
    const enumField = { status, type, priority };
    this.setState({ enumField });
  };
  componentDidMount() {
    this.enumField();
    this.updateHistories();
  }

  updateHistories = () => {
    const { id, dataProvider } = this.props;
    dataProvider(GET_LIST, 'taskhistories', { filter: { taskId: id }, pagination: { page: 1, perPage: 1000 } }).then(
      res => {
        if (res.data && res.data.length >= 0) {
          this.setState({ histories: res.data });
        }
      },
    );
  };
  renderFiles = record => {
    const style = { textDecoration: 'none' };
    return (
      record &&
      record.attachedFiles &&
      record.attachedFiles.map(file => {
        return (
          <Grid middle="true" item sm={12} xs={12} key={file.url}>
            <a style={style} href={file.url} download>
              {file.name}
            </a>
          </Grid>
        );
      })
    );
  };
  render() {
    const { redirect, translate, dataProvider, updateHistories, classes, dispatch, ...rest } = this.props;
    return (
      <Fragment>
        <Show title={translate('resources.tasks.show')} {...rest}>
          <FlexForm toolbar={null} redirect="list">
            <Grid middle container spacing={2}>
              <Grid middle item sm={12} xs={12}>
                <TextField source="name" />
                {/* <RichTextField source="description" /> */}
              </Grid>
              <Grid middle item sm={6} xs={12}>
                <FunctionField source="status" render={record => this.translateStatus('statuses', record.status)} />
              </Grid>
              <Grid middle item sm={6} xs={12}>
                <FunctionField source="type" render={record => this.translateStatus('types', record.type)} />
              </Grid>
              <Grid middle item sm={6} xs={12}>
                <FunctionField
                  source="priority"
                  render={record => this.translateStatus('priorities', record.priority)}
                />
              </Grid>
              <Grid middle item sm={6} xs={12}>
                <ReferenceField source="assigneeId" resource="tasks" reference="appusers">
                  <TextField source="fullName" />
                </ReferenceField>
              </Grid>
              <Grid middle item sm={6} xs={12}>
                <DateField source="startDate" addLabel />
              </Grid>
              <Grid middle item sm={6} xs={12}>
                <DateField source="dueDate" addLabel />
              </Grid>
              <Grid middle item sm={6} xs={12}>
                <TextField source="estimateTime" />
              </Grid>
              <Grid middle item sm={6} xs={12}>
                <DateField source="finishDate" addLabel />
              </Grid>
              <Grid middle item sm={12} xs={12}>
                <RichTextField source="description" />
              </Grid>
              <Grid middle item sm={12} xs={12}>
                <ReferenceField
                  label={translate(`resources.tasks.fields.attachedFiles`)}
                  source="id"
                  reference="tasks"
                  linkType={false}
                >
                  <FunctionField source="attachedFiles" render={record => this.renderFiles(record)} />
                </ReferenceField>
              </Grid>
            </Grid>
            <TaskHistory
              dispatch=""
              histories={this.state.histories}
              dataProvider={dataProvider}
              classes={classes}
              userId={this.state.userId}
              enumField={this.state.enumField}
            />
          </FlexForm>
        </Show>
      </Fragment>
    );
  }
}

TaskboardShow.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  dataProvider: PropTypes.func,
  classes: PropTypes.any,
  dispatch: PropTypes.any,
  redirect: PropTypes.any,
  id: PropTypes.any,
  updateHistories: PropTypes.func,
};

TaskboardShow.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
let enhance = compose(translate, withDataProvider);
export default enhance(TaskboardShow);
