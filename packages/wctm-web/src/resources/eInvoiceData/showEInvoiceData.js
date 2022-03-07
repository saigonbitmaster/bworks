import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import {
  NumberField,
  // HtmlField,
  TextField,
  translate,
  // ReferenceField,
  DateField,
  BooleanField,
  FlexForm,
  Edit,
  // ShowButton,
  withDataProvider,
  showDialog,
} from 'ra-loopback3';
// import PrintInvoiceButton from './PrintInvoiceButton';

class ShowEInvoiceData extends Component {
  // handleClick = async record => {
  //   const { dataProvider, showDialog } = this.props;

  //   const invoice = await dataProvider(CUSTOM, 'EInvoiceData', {
  //     subUrl: 'printEInvoice',
  //     query: {
  //       invoiceNo: record.eInvoiceNo,
  //     },
  //   });
  //   // debugger;
  //   showDialog(<PdfView name="Invoice" url={`data:application/pdf;base64,${invoice.data}`} />);
  // };

  // componentWillUnmount() {
  //   this.unmount = true;
  // }

  render() {
    const { translate, dispatch, dataProvider, showDialog, ...rest } = this.props;
    // console.log(this.props.id);
    return (
      <Edit title={translate('resources.geocountries.show')} {...rest}>
        <FlexForm toolbar={null} style={{ flexGrow: 1 }} spacing={2} redirect="list">
          <Grid middle="true" container spacing={2}>
            <Grid middle="true" item sm={6} xs={12}>
              <TextField source="clientName" />
            </Grid>
            <Grid middle="true" item sm={6} xs={12}>
              <DateField source="termInvoice" />
            </Grid>
            <Grid middle="true" item sm={6} xs={12}>
              <TextField source="eInvoiceNo" />
            </Grid>
            <Grid middle="true" item sm={6} xs={12}>
              <DateField source="eInvoiceDate" showTime />
            </Grid>
            <Grid middle="true" item sm={6} xs={12}>
              <TextField source="eInvoiceReservationCode" />
            </Grid>
            <Grid middle="true" item sm={6} xs={12}>
              <BooleanField source="eInvoiceStatus" />
            </Grid>
            <Grid middle="true" item sm={6} xs={12}>
              <TextField source="rawResult.result.transactionID" />
            </Grid>
            <Grid middle="true" item sm={6} xs={12}>
              <NumberField source="clientMeterNumberItem.invoiceData.totalFee" />
            </Grid>
            <Grid middle="true" item sm={6} xs={12}>
              <NumberField source="clientMeterNumberItem.invoiceData.totalWaterUsed" />
            </Grid>
            <Grid middle="true" item sm={6} xs={12}>
              <NumberField source="clientMeterNumberItem.invoiceData.taxFee" />
            </Grid>
            <Grid middle="true" item sm={6} xs={12}>
              <NumberField source="clientMeterNumberItem.invoiceData.sewageFee" />
            </Grid>
          </Grid>
        </FlexForm>
      </Edit>
    );
  }
}

ShowEInvoiceData.propTypes = {
  translate: PropTypes.any,
  dispatch: PropTypes.any,
  showDialog: PropTypes.func,
  dataProvider: PropTypes.func,
};

const enhance = compose(translate, withDataProvider, connect(null, { showDialog }));
export default enhance(ShowEInvoiceData);
