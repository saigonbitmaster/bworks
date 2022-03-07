import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import { List, TextField, Datagrid, withDataProvider, translate, ReferenceField, NumberField } from 'ra-loopback3';
import PrintInvoiceFilters from './PrintInvoiceFilters';
import ExportPdfButton from './ExportPdfButton';

class PrintInvoiceList extends Component {
  refFilter = React.createRef();
  render() {
    const { dataProvider, dispatch, translate, ...rest } = this.props;
    let currentMonth = moment().startOf('month');
    return (
      <List
        refFilter={this.refFilter}
        filters={<PrintInvoiceFilters />}
        filterDefaultValues={{ termInvoice: currentMonth.toDate() }}
        {...rest}
        resource="storeinvoices"
        bulkActionButtons={false}
      >
        <Datagrid>
          <TextField source="nameQuarter" />
          <ReferenceField source="wardId" reference="geowards" linkType={false}>
            <TextField source="name" />
          </ReferenceField>
          <ReferenceField source="districtId" reference="geodistricts" linkType={false}>
            <TextField source="name" />
          </ReferenceField>
          <ReferenceField source="provinceId" reference="geoprovinces" linkType={false}>
            <TextField source="name" />
          </ReferenceField>
          <NumberField source="countExportedInvoice" />
          <ExportPdfButton permission={{ name: 'printInvoiceByGeo', action: 'printInvoice' }} />
        </Datagrid>
      </List>
    );
  }
}

PrintInvoiceList.propTypes = {
  dataProvider: PropTypes.func,
  dispatch: PropTypes.func,
  translate: PropTypes.func,
  history: PropTypes.any,
};

const enhance = compose(withDataProvider, translate, connect(null, {}));
export default enhance(PrintInvoiceList);
