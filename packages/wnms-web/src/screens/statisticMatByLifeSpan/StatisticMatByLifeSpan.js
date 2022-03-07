import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Datagrid,
  TextField,
  translate,
  DateField,
  NumberWithUnitField,
  CustomPage,
  FunctionField,
} from 'ra-loopback3';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push as pushAction } from 'react-router-redux';
import moment from 'moment-timezone';
import ConditionStatistic from './ConditionStatistic';

class StatisticMatByLifeSpan extends Component {
  refController = React.createRef();
  state = {
    filter: {
      typeMat: 'AllMat',
      typeTime: 'month',
      valueTime: moment().format('YYYY-MM'),
      statisticWhere: 'MaterialUse',
    },
  };
  onStatistic = filter => {
    let { typeTime, valueTime, typeMat, statisticWhere } = filter;
    if (!statisticWhere || !typeMat || !typeTime || !valueTime) {
      return;
    }

    this.setState({ filter });
    let refController = this.refController;
    if (refController.current) {
      refController.current.updateFilter();
    }
  };
  render() {
    let { translate } = this.props;
    return (
      <CustomPage title={'generic.pages.statisticMatByLifeSpan'}>
        <List
          refController={this.refController}
          {...this.props}
          resource="customstatisticmatbylifespans"
          fixUrl="materialstocks/statisticMatByLifeSpan"
          actions={<ConditionStatistic translate={translate} onStatistic={this.onStatistic} />}
          title={translate('resources.customstatisticmatbylifespans.title')}
          filter={this.state.filter || {}}
          bulkActions={false}
        >
          <Datagrid>
            <TextField source="name" />
            <DateField source="dom" />
            <TextField source="egeTime" />
            <TextField source="usedTime" />
            <DateField source="useStartDate" />
            <NumberWithUnitField
              source="quantityUsed"
              unitKey={'unitQuantityUsed'}
              translate={translate}
              textAlign="left"
            />
            <TextField source="totalRealTimeUsed" />
            <TextField source="remainTime" />
            <FunctionField
              label={translate('resources.customstatisticmatbylifespans.fields.conclusion')}
              render={record => `${translate(record.conclusion)}`}
            />
          </Datagrid>
        </List>
      </CustomPage>
    );
  }
}

StatisticMatByLifeSpan.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
};

StatisticMatByLifeSpan.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(
  translate,
  connect(null, {
    push: pushAction,
  }),
);

export default enhance(StatisticMatByLifeSpan);
