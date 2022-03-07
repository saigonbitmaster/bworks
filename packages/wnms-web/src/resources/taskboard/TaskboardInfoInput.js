import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  SelectInput,
  translate,
  FlexItemForward,
  TextInput,
  LongTextInput,
  ReferenceInput,
  DateField,
  DateInput,
  EditorInput,
  withDataProvider,
  CUSTOM,
  CustomFileInput,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';

class TaskboardInfoInput extends Component {
  constructor(props) {
    super(props);
    this.state = this.props;
  }

  async componentDidMount() {
    const {
      data: { priority, status, type },
    } = await this.props.dataProvider(CUSTOM, 'Tasks', { subUrl: 'getAllEnum' });
    const statusChoices = status.map(i => {
      return { id: i, name: this.props.translate(`resources.tasks.fields.statuses.${i}`) };
    });
    const typeChoices = type.map(i => {
      return { id: i, name: this.props.translate(`resources.tasks.fields.types.${i}`) };
    });
    const priorityChoices = priority.map(i => {
      return { id: i, name: this.props.translate(`resources.tasks.fields.priorities.${i}`) };
    });
    const choices = {
      statusChoices: statusChoices,
      typeChoices: typeChoices,
      priorityChoices: priorityChoices,
    };
    this.setState(choices);
  }
  nowDate = () => {
    let now = Date.now();
    let nowString = new Date(now);
    let nowISO = nowString.toISOString();
    return nowISO;
  };
  render() {
    const { translate } = this.state;
    const { dataProvider } = this.props;
    return (
      <FlexItemForward {...this.state}>
        <Grid middle container spacing={2}>
          <Grid middle item sm={12}>
            <LongTextInput label={translate('resources.tasks.fields.name')} source="name" />
          </Grid>
          <Grid middle item sm={6}>
            <SelectInput
              label={translate('resources.tasks.fields.status')}
              source="status"
              choices={this.state.statusChoices}
            />
          </Grid>
          <Grid middle item sm={6}>
            <SelectInput
              label={translate('resources.tasks.fields.type')}
              source="type"
              choices={this.state.typeChoices}
            />
          </Grid>
          <Grid middle item sm={6}>
            <SelectInput
              label={translate('resources.tasks.fields.priority')}
              source="priority"
              choices={this.state.priorityChoices}
            />
          </Grid>
          <Grid middle item sm={6}>
            <ReferenceInput
              resource="Tasks"
              record={this.state.record}
              label={translate('resources.tasks.fields.assigneeId')}
              source="assigneeId"
              reference="appusers"
            >
              <SelectInput optionText="fullName" />
            </ReferenceInput>
          </Grid>
          <Grid middle item sm={6}>
            <DateInput
              defaultValue={this.nowDate()}
              label={translate('resources.tasks.fields.startDate')}
              source="startDate"
            />
          </Grid>
          <Grid middle item sm={6}>
            <DateInput
              defaultValue={this.nowDate()}
              label={translate('resources.tasks.fields.dueDate')}
              source="dueDate"
            />
          </Grid>
          <Grid middle item sm={6}>
            <TextInput label={translate('resources.tasks.fields.estimateTime')} source="estimateTime" />
          </Grid>
          <Grid middle item sm={6} xs={12}>
            {this.state.record.status === 'finish' && (
              <DateField
                record={this.state.record}
                label={translate('resources.tasks.fields.finishDate')}
                source="finishDate"
                addLabel
              />
            )}
          </Grid>
          <Grid middle item sm={12} xs={12}>
            <CustomFileInput
              storage="nmsfiles"
              source="attachedFiles"
              translate={translate}
              dataProvider={dataProvider}
            />
          </Grid>
          <Grid middle item sm={12}>
            <EditorInput fullWidth label={translate('resources.tasks.fields.description')} source="description" />
          </Grid>
        </Grid>
      </FlexItemForward>
    );
  }
}

TaskboardInfoInput.propTypes = {
  dataProvider: PropTypes.func,
  translate: PropTypes.any,
};

let enhance = compose(withDataProvider, translate);
export default enhance(TaskboardInfoInput);
