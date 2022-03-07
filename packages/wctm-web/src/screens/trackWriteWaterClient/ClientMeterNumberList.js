import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import { List, TextField, Datagrid, DateField, translate, FunctionField, NumberField } from 'ra-loopback3';
import { isEqual } from 'lodash';
import ClientMeterNumberFilters from './ClientMeterNumberFilters';

class ClientMeterNumberList extends Component {
  refFilter = React.createRef();
  state = {
    defaultFilters: {
      termMeterNumber: {
        lt: moment()
          // .subtract(1, 'month')
          .startOf('month')
          .toDate(),
      },
    },
  };
  onFiltersChange = values => {
    if (!isEqual(values, this.state.currentFilters)) {
      this.setState({ currentFilters: values });
    }
  };

  handleDistrictChange = filterValues => {
    if (filterValues.wardId || filterValues.quarterId) {
      this.refFilter.current.props.change('wardId', '');
      this.refFilter.current.props.change('quarterId', '');
    }
  };
  handleWardChange = filterValues => {
    if (filterValues.quarterId) {
      this.refFilter.current.props.change('quarterId', '');
    }
  };

  render() {
    const { record, id, resource, translate, ...rest } = this.props;
    return (
      <List
        {...rest}
        resource="clients"
        filters={
          <ClientMeterNumberFilters
            handleDistrictChange={this.handleDistrictChange}
            handleWardChange={this.handleWardChange}
          />
        }
        refFilter={this.refFilter}
        bulkActionButtons={false}
        filterDefaultValues={this.state.defaultFilters}
        sort={{ field: 'code', order: 'ASC' }}
      >
        <Datagrid>
          <TextField source="code" label={'resources.clients.fields.code'} />
          <TextField source="name" label={'resources.clients.fields.name'} />
          <TextField source="formattedAddress" label={'resources.clients.fields.formattedAddress'} />
          <DateField source="contractDate" label={'resources.clients.fields.contractDate'} />
          <FunctionField
            label={'resources.clients.fields.status'}
            render={record => translate(`resources.clients.clientStatus.${record.status}`)}
          />
          <NumberField source="lastMeterNumber" label={'resources.clients.fields.lastMeterNumber'} />
          <DateField source="lastTimeMeterNumberUpdate" label={'resources.clients.fields.lastTimeMeterNumberUpdate'} />
          <FunctionField
            render={record => moment(record.termInvoice).format('MM/YYYY')}
            label={'resources.clients.fields.lastTermInvoice'}
          />
        </Datagrid>
      </List>
    );
  }
}
ClientMeterNumberList.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  record: PropTypes.any,
  id: PropTypes.string,
  resource: PropTypes.string,
};

ClientMeterNumberList.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const enhance = compose(translate);
export default enhance(ClientMeterNumberList);
