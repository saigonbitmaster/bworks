import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Datagrid, TextField, translate, NumberWithUnitField, CustomPage, FunctionField } from 'ra-loopback3';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push as pushAction } from 'react-router-redux';
import moment from 'moment-timezone';
import ConditionStatistic from './ConditionStatistic';
import { DetailIcon } from '../../styles/Icons';
import CustomEditButton from '../../components/buttons/CustomEditButton';
import { getFormValues } from 'redux-form';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
class StatisticMatInStk extends Component {
  refController = React.createRef();
  state = {
    filter: isEmpty(this.props.valueformfilter)
      ? { typeMat: 'AllMat', typeTime: 'month', valueTime: moment().format('YYYY-MM') }
      : {
          // get from redux when press TRO VE button
          typeMat: get(this.props.valueformfilter, 'typeMat'),
          typeTime: get(this.props.valueformfilter, 'typeTime'),
          valueTime:
            get(this.props.valueformfilter, 'typeTime') === 'month'
              ? moment(get(this.props.valueformfilter, 'month')).format('YYYY-MM')
              : get(this.props.valueformfilter, 'year'),
        },
  };
  onStatistic = filter => {
    if (!filter.typeMat || !filter.typeTime || !filter.valueTime) {
      return;
    }
    // console.log('on statistic', filter);
    this.setState({ filter });
    let refController = this.refController;
    if (refController.current) {
      refController.current.updateFilter();
    }
  };

  render() {
    let { translate } = this.props;
    // console.log(this.state.filter);
    // console.log(this.props.valueFormFilter);
    return (
      <CustomPage title={translate('resources.customstatisticmatstocks.title')}>
        <List
          refController={this.refController}
          {...this.props}
          resource="customstatisticmatstocks"
          fixUrl="materialstocks/statisticMatStock"
          actions={<ConditionStatistic translate={translate} onStatistic={this.onStatistic} />}
          title={translate('resources.customstatisticmatstocks.title')}
          filter={this.state.filter || {}}
          bulkActions={false}
        >
          <Datagrid>
            <TextField source="typeMatName" />
            <NumberWithUnitField source="totalInitValue" unitKey={'unit'} translate={translate} textAlign={'left'} />
            <NumberWithUnitField source="totalExportValue" unitKey={'unit'} translate={translate} textAlign={'left'} />
            <NumberWithUnitField source="totalUseValue" unitKey={'unit'} translate={translate} textAlign={'left'} />
            <NumberWithUnitField source="adjustValue" unitKey={'unit'} translate={translate} textAlign={'left'} />
            <NumberWithUnitField source="totalCurrentValue" unitKey={'unit'} translate={translate} textAlign={'left'} />
            <TextField source="rate" />
            <FunctionField
              label={this.props.translate('resources.customstatisticmatstocks.fields.statusStock')}
              render={record => (get(record, 'statusStock') ? `${this.props.translate(record.statusStock)}` : '')}
            />
            <CustomEditButton icon={<DetailIcon />} subUrl={'viewDetailMatStock'} text={translate('generic.detail')} />
          </Datagrid>
        </List>
      </CustomPage>
    );
  }
}

StatisticMatInStk.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  valueformfilter: PropTypes.object,
};

StatisticMatInStk.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
function mapStateToProps(state) {
  return {
    formname: 'filter-form-statistic-mat-stock',
    valueformfilter: getFormValues('filter-form-statistic-mat-stock')(state),
  };
}
const enhance = compose(
  translate,
  connect(mapStateToProps, {
    push: pushAction,
  }),
);

export default enhance(StatisticMatInStk);
