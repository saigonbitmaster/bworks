import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import get from 'lodash/get';
import {
  FormDataConsumer,
  SelectInput,
  ToolbarButton,
  withDataProvider,
  CUSTOM,
  Create,
  FlexForm,
  Toolbar,
  translate,
  ReferenceInput,
  TimeRangeInput,
} from 'ra-loopback3';
import moment from 'moment-timezone';
import { ExportIcon } from '../../styles/Icons';

class ReportMeterNumberByGeo extends Component {
  formRef = React.createRef();
  state = { inprogress: false };

  save = record => {
    this.setState({ inprogress: true });
    this.props
      .dataProvider(CUSTOM, 'clientmeternumbers', {
        stream: 'file',
        method: 'get',
        subUrl: `exportExcelTermNumberGroupByGeo`,
        query: { ...record, timeRange: JSON.stringify(record.timeRange) },
      })
      .finally(() => {
        this.setState({ inprogress: false });
      });
  };

  onFormChange = formData => {
    const values = get(this, 'formRef.current.props.values');
    if (values.wardId !== formData.wardId) {
      formData.quarterId = null;
    }
  };

  render() {
    const { dataProvider, translate, ...rest } = this.props;
    return (
      <Create
        {...rest}
        resource="clientmeternumbers"
        save={this.save}
        actions={null}
        hasList
        title={'generic.pages.reportTermNumberGroupByGeo'}
      >
        <FlexForm
          formRef={this.formRef}
          onChange={this.onFormChange}
          defaultValue={{
            timeRange: {
              type: 'month',
              from: moment()
                .startOf('month')
                .toDate(),
              to: moment()
                .startOf('month')
                .toDate(),
            },
          }}
          toolbar={
            <Toolbar>
              <ToolbarButton inprogress={this.state.inprogress} label="generic.exportExcel">
                <ExportIcon />
              </ToolbarButton>
            </Toolbar>
          }
        >
          <TimeRangeInput
            fullWidth
            style={{ marginLeft: '6px' }}
            label={''}
            types={['month']}
            source={'timeRange'}
            defaultValue={{
              type: 'month',
              from: moment()
                .startOf('month')
                .toDate(),
              to: moment()
                .startOf('month')
                .toDate(),
            }}
          />
          <ReferenceInput reference="geowards" source="wardId" label="resources.clients.fields.wardId" allowEmpty>
            <SelectInput optionText="name" />
          </ReferenceInput>
          <FormDataConsumer>
            {({ formData, ...subRest }) => (
              <ReferenceInput
                {...subRest}
                allowEmpty
                label="resources.clients.fields.quarterId"
                source="quarterId"
                filter={{ wardId: formData.wardId }}
                reference="geoquarters"
              >
                <SelectInput optionText="name" />
              </ReferenceInput>
            )}
          </FormDataConsumer>
        </FlexForm>
      </Create>
    );
  }
}

ReportMeterNumberByGeo.propTypes = {
  dataProvider: PropTypes.func,
  translate: PropTypes.func,
};

const enhance = compose(withDataProvider, translate);
export default enhance(ReportMeterNumberByGeo);
