import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import get from 'lodash/get';
import { connect } from 'react-redux';
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
  showNotification,
  MonthInput
} from 'ra-loopback3';
import moment from 'moment-timezone';
import { PrintIcon } from '../../styles/Icons';
class ReportMeterNumberByGeo extends Component {
 
  formRef = React.createRef();
  state = { inprogress: false };
  save = record => {
    this.setState({ inprogress: true });
    this.props
      .dataProvider(CUSTOM, 'clientmeternumbers', {
        stream: 'file',
        method: 'get',
        subUrl: `exportInvoiceNoticeGroupByGeo`,
        query: { ...record },
      })
      .finally(() => {
        this.setState({ inprogress: false });
      });
  };
  onFormChange = formData => {
    let wardId = formData.wardId || null
    this.setState({ wardId: wardId });
    const values = get(this, 'formRef.current.props.values');
    if (values.wardId !== formData.wardId) {
      formData.quarterId = null;
    }
  };
  render() {
    const { dataProvider, translate, ...rest } = this.props;
    let currentMonth = moment().endOf('month');
    return (
      <Create
        {...rest}
        resource="clientmeternumbers"
        save={this.save}
        actions={null}
        hasList
        title={'generic.printInvoiceNotice'}
      >
        <FlexForm
          formRef={this.formRef}
          onChange={this.onFormChange}
          defaultValue={{
            month: currentMonth.toDate(),
          }}
          toolbar={
            <Toolbar>
              <ToolbarButton inprogress={this.state.inprogress} label="generic.printInvoiceNotice" disabled={!this.state.wardId}>
                <PrintIcon />
              </ToolbarButton>
            </Toolbar>
          }
        >
          <MonthInput label="generic.typeTime.month" source="month" alwaysOn date allowEmpty={false} />
          <ReferenceInput reference="geowards" source="wardId" label="resources.clients.fields.wardId" isRequired={true}>
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
  showNotification: PropTypes.func,
  translate: PropTypes.func,
};
const enhance = compose(withDataProvider, translate, connect(null, { showNotification }),);
export default enhance(ReportMeterNumberByGeo);
