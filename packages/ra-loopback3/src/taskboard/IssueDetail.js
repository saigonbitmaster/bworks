import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import {
  TextField,
  ReferenceField,
  RichTextField,
  DateField,
  FunctionField,
  CUSTOM,
  translate,
  GET_LIST,
  CardActions,
  linkToRecord,
} from 'react-admin';
import { Link } from 'react-router-dom';
// import moment from 'moment-timezone';
import TabbedFlexForm from '../form/TabbedFlexForm';
import FlexFormTab from '../form/FlexFormTab';
import Show from '../detail/Show';
import SFEditButton from '../layout/SFEditButton';
import Button from '../layout/Button';
import withDataProvider from '../data/withDataProvider';
import List from '@material-ui/icons/List';
import { Storage } from '../data/Storage';
import SFDeleteButton from '../layout/SFDeleteButton';
import IssueHistory from './history/IssueHistory';

const IssueDetailActions = ({ basePath, translate, screenName, data, permissions, hasEdit, hasList, ...rest }) => (
  <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
    {data && (
      <SFEditButton
        permission={screenName && permissions.includes('edit') ? { name: screenName, action: 'edit' } : {}}
        component={Link}
        to={linkToRecord(basePath, data.id, 'edit')}
      />
    )}
    {data && (
      <SFDeleteButton
        record={data}
        permission={screenName && permissions.includes('delete') ? { name: screenName, action: 'delete' } : {}}
        basePath={basePath}
        undoable={false}
        {...rest}
      />
    )}
    <Button
      label={translate('ra.action.list')}
      permission={screenName && permissions.includes('list') ? { name: screenName, action: 'view' } : {}}
      component={Link}
      to={basePath}
    >
      <List />
    </Button>
  </CardActions>
);

IssueDetailActions.propTypes = {
  basePath: PropTypes.string,
  translate: PropTypes.func,
  screenName: PropTypes.string,
  data: PropTypes.object,
  permissions: PropTypes.array,
  hasEdit: PropTypes.bool,
  hasList: PropTypes.bool,
};

@withDataProvider
class IssueDetail extends Component {
  state = {
    userId: '',
    hasEdit: true,
    enumField: [],
    histories: [],
  };

  async componentDidMount() {
    const { userId } = Storage.getUser();
    this.setState({ userId });
    this.enumField();
    this.updateHistories();
  }

  translateStatus = (field, value) => {
    return this.props.translate(`ra.tasks.fields.${field}.${value}`);
  };

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

  enumField = () => {
    this.props.dataProvider(CUSTOM, 'Tasks', { subUrl: 'getAllEnum' }).then(({ data }) => {
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
    });
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
    const { enumField, histories } = this.state;
    const {
      redirect,
      translate,
      dataProvider,
      updateHistories,
      classes,
      dispatch,
      screenName,
      permissions,
      hasList,
      hasEdit,
      hasShow,
      hasCreate,
      ...rest
    } = this.props;
    const { basePath } = this.props;
    return (
      <Fragment>
        <Show
          title={translate('ra.tasks.show')}
          actions={
            <IssueDetailActions
              basePath={basePath}
              screenName={screenName}
              permissions={permissions}
              translate={translate}
              {...rest}
            />
          }
          {...rest}
        >
          <TabbedFlexForm redirect="list" {...rest} disabletoolbar>
            <FlexFormTab key={1} label={'Thông tin công việc'} redirect="list">
              <Grid middle container spacing={2}>
                <Grid middle item sm={12} xs={12}>
                  <TextField source="name" label={translate('ra.tasks.fields.name')} />
                </Grid>
                <Grid middle item sm={6} xs={12}>
                  <FunctionField
                    source="status"
                    label={translate('ra.tasks.fields.status')}
                    render={record => translate(`ra.tasks.statuses.${record.status}`)}
                  />
                </Grid>
                <Grid middle item sm={6} xs={12}>
                  <FunctionField
                    source="type"
                    label={translate('ra.tasks.fields.type')}
                    render={record => translate(`ra.tasks.types.${record.type}`)}
                  />
                </Grid>
                <Grid middle item sm={6} xs={12}>
                  <FunctionField
                    source="priority"
                    label={translate('ra.tasks.fields.priority')}
                    render={record => translate(`ra.tasks.priorities.${record.priority}`)}
                  />
                </Grid>
                <Grid middle item sm={6} xs={12}>
                  <ReferenceField
                    source="assigneeId"
                    resource="tasks"
                    reference="appusers"
                    label={translate('ra.tasks.fields.assigneeId')}
                  >
                    <TextField source="fullName" />
                  </ReferenceField>
                </Grid>
                <Grid middle item sm={6} xs={12}>
                  <DateField source="startDate" label={translate('ra.tasks.fields.startDate')} />
                </Grid>
                <Grid middle item sm={6} xs={12}>
                  <DateField source="dueDate" label={translate('ra.tasks.fields.dueDate')} />
                </Grid>
                <Grid middle item sm={6} xs={12}>
                  <TextField source="estimateTime" label={translate('ra.tasks.fields.estimateTime')} />
                </Grid>
                <Grid middle item sm={6} xs={12}>
                  <DateField source="finishDate" label={translate('ra.tasks.fields.finishDate')} />
                </Grid>
                <Grid middle item sm={12} xs={12}>
                  <RichTextField source="description" label={translate('ra.tasks.fields.description')} />
                </Grid>
                <Grid middle item sm={12} xs={12}>
                  <ReferenceField
                    label={translate(`ra.tasks.fields.attachedFiles`)}
                    source="id"
                    reference="tasks"
                    linkType={false}
                  >
                    <FunctionField source="attachedFiles" render={record => this.renderFiles(record)} />
                  </ReferenceField>
                </Grid>
              </Grid>
            </FlexFormTab>
            <FlexFormTab key={2} label="Lịch sử">
              <IssueHistory
                dispatch=""
                histories={histories}
                enumField={enumField}
                updateHistories={this.updateHistories}
              />
            </FlexFormTab>
          </TabbedFlexForm>
        </Show>
      </Fragment>
    );
  }
}

IssueDetail.propTypes = {
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
  basePath: PropTypes.string,
  screenName: PropTypes.string,
  permissions: PropTypes.array,
};

const enhance = compose(translate, withDataProvider);

export default enhance(IssueDetail);
