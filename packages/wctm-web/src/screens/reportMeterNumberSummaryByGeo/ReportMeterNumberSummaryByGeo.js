import React, { Component } from 'react';
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
  MonthInput,
  ReferenceInput,
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
        subUrl: `exportExcelTermNumberSummaryGroupByGeo`,
        query: record,
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
        title={'generic.pages.reportTermNumberSummaryGroupByGeo'}
      >
        <FlexForm
          formRef={this.formRef}
          onChange={this.onFormChange}
          toolbar={
            <Toolbar>
              <ToolbarButton inprogress={this.state.inprogress} label="generic.exportExcel">
                <ExportIcon />
              </ToolbarButton>
            </Toolbar>
          }
        >
          <MonthInput
            source="month"
            date
            label="generic.typeTime.month"
            defaultValue={moment()
              .startOf('month')
              .toDate()}
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

const enhance = compose(withDataProvider, translate);
export default enhance(ReportMeterNumberByGeo);
