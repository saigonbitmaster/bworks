import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import {
  List,
  TextField,
  Datagrid,

  ReferenceField,
  translate,
  FunctionField,
  NumberField,
  Filter,
  DateInput,
  SelectArrayInput,
  ReferenceArrayInput,
} from 'ra-loopback3';
import { connect} from 'react-redux';
import { push } from 'react-router-redux'
import Button from '@material-ui/core/Button';
import ImageEye from '@material-ui/icons/RemoveRedEye';
const defaultFilter = {
  startDay: moment('2020-01-01')
    .startOf('day')
    .toDate(),
  endDay: moment('2021-12-12')
    .startOf('day')
    .toDate(),
};

class PaymentCollectionList extends Component {

  refList = React.createRef();
  render() {
    const { record, id, resource, translate, showNotification, basePath, dataProvider, push, ...rest } = this.props;
    const ListFilter = props => (
      <Filter {...props}>
        <DateInput label={translate('resources.paymentcollection.timeTo')} source="endDay" alwaysOn onBlur={e => e.preventDefault()} />
        <DateInput label={translate('resources.paymentcollection.timeFrom')} source="startDay" alwaysOn onBlur={e => e.preventDefault()} />
        <ReferenceArrayInput
          style={{ minWidth: 100 }}
          label={'resources.paymentcollection.appUser'}
          source="id"
          reference="appusers"
          alwaysOn>
          <SelectArrayInput optionText="username" />
        </ReferenceArrayInput>
      </Filter>
    );
    return (
      <List
        {...rest}
        resource="sumpaymentcollections"
        fixUrl="clientmeternumbers/paymentcollection"
        filterDefaultValues={defaultFilter}
        hasCreate
        refController={this.refList}
        bulkActionButtons={false}
        filters={<ListFilter />}
         >
        <Datagrid >
          <ReferenceField  sortBy="username" label={translate('resources.paymentcollection.appUser')} source="id" reference="appusers" linkType={false}>
            <TextField source="username" />
          </ReferenceField>
          <NumberField source="totalClients" label={translate('resources.paymentcollection.totalClients')} />
          <NumberField source="paidClients" label={translate('resources.paymentcollection.paidClients')} />
          <NumberField source="totalCollect" label={translate('resources.paymentcollection.totalCollection')} />
          <NumberField source="totalUnCollect" label={translate('resources.paymentcollection.totalUnCollect')} />
          <NumberField source="totalPaidOff" label={translate('resources.paymentcollection.totalPaidOff')} />
          <NumberField source="totalUnPaidOff" label={translate('resources.paymentcollection.totalUnPaidOff')} />
          <FunctionField render={record => 
          (<Button color="primary" onClick={() => push(`${basePath}/clientpaymenthistory/${record.id}?startDay=${this.refList.current.getCurrentFilter().startDay}&endDay=${this.refList.current.getCurrentFilter().endDay}`)}>      
         {translate('resources.paymentcollection.paymentHistory')}
          <ImageEye />
          </Button>)
          }>
           </FunctionField>
          <FunctionField render={record => 
          (<Button color="primary" onClick={() => push(`${basePath}/history/${record.id}?startDay=${this.refList.current.getCurrentFilter().startDay}&endDay=${this.refList.current.getCurrentFilter().endDay}`)}> 
          {translate('resources.paymentcollection.paidOffHistory' )} 
          <ImageEye />
          </Button>)
          } />
        </Datagrid>
      </List>
    );
  }
}

PaymentCollectionList.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  record: PropTypes.any,
  id: PropTypes.string,
  resource: PropTypes.string,
  dataProvider: PropTypes.func,
  showNotification: PropTypes.func,
  push: PropTypes.func,
};

PaymentCollectionList.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
const mapDispatchToProps = dispatch => {
  return {
    push: (abc) => dispatch(push(abc))
  }
}

const enhance = compose(translate, connect(null, mapDispatchToProps));
export default enhance(PaymentCollectionList);
