import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import get from 'lodash/get';
import { connect } from 'react-redux';
import {
  SelectInput,
  ToolbarButton,
  withDataProvider,
  showNotification,
  CUSTOM,
  Create,
  FlexForm,
  Toolbar,
  translate,
  ReferenceInput,
  MonthInput,
} from 'ra-loopback3';
import moment from 'moment-timezone';
import { ExportIcon } from '../../styles/Icons';

class ReportMeterNumberByGeo extends Component {
  state = { inprogress: false };

  save = record => {
    this.setState({ inprogress: true });
    this.props
      .dataProvider(CUSTOM, 'clientmeternumbers', {
        stream: 'file',
        method: 'get',
        subUrl: `customReport`,
        query: { ...record, month: JSON.stringify(record.month) },
      })
      .then(() => this.setState({ inprogress: false }))
      .catch(err => showNotification(err ? 'ok' : 'error.INTERNAL_SERVER_ERROR', 'warning'))
      .finally(() => {
        this.setState({ inprogress: false });
      });
  };

  render() {
    const { dataProvider, translate, ...rest } = this.props;
    return (
      <Create
        {...rest}
        resource="customReport"
        save={this.save}
        actions={null}
        hasList
        title={'generic.pages.reportCustom'}
      >
        <FlexForm
          formRef={this.formRef}
          onChange={this.onFormChange}
          defaultValue={{
            month: moment()
              .startOf('month')
              .toDate(),
            reportType: 'reportByStaff',
          }}
          toolbar={
            <Toolbar>
              <ToolbarButton inprogress={this.state.inprogress} label="generic.exportExcel">
                <ExportIcon />
              </ToolbarButton>
            </Toolbar>
          }
        >
          <ReferenceInput
            reference="geogroups"
            source="geoGroupId"
            label="resources.reportcustom.waterStation"
            allowEmpty
          >
            <SelectInput optionText="name" />
          </ReferenceInput>
          <SelectInput
            label="resources.reportcustom.reportType"
            source="reportType"
            choices={[
              { id: 'reportByStaff', name: 'Báo cáo doanh thu theo NV' },
              { id: 'reportByFormula', name: 'Báo cáo doanh thu theo giá' },
              { id: 'reportInvoice', name: 'Tổng hợp hóa đơn' },
            ]}
          />

          <MonthInput source="month" date label="generic.typeTime.month" />
        </FlexForm>
      </Create>
    );
  }
}

ReportMeterNumberByGeo.propTypes = {
  dataProvider: PropTypes.func,
  translate: PropTypes.func,
  showNotification: PropTypes.func,
};

const enhance = compose(withDataProvider, translate, connect(null, { showNotification }));
export default enhance(ReportMeterNumberByGeo);