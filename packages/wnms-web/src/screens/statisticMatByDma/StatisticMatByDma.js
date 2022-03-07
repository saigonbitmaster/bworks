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
class StatisticMatByDma extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: isEmpty(this.propsvalueformfilter)
        ? {
            typeMat: 'AllMat',
            typeTime: 'month',
            valueTime: moment().format('YYYY-MM'),
            dmaId: 'AllDma',
            flgIncludeChild: false,
          }
        : {
            // get from redux when press TRO VE button
            typeMat: get(this.propsvalueformfilter, 'typeMat'),
            typeTime: get(this.propsvalueformfilter, 'typeTime'),
            valueTime:
              get(this.propsvalueformfilter, 'typeTime') === 'month'
                ? moment(get(this.propsvalueformfilter, 'month')).format('YYYY-MM')
                : get(this.propsvalueformfilter, 'year'),
            dmaId: get(this.propsvalueformfilter, 'dmaId'),
            flgIncludeChild: get(this.propsvalueformfilter, 'flgIncludeChild'),
          },
    };
  }
  refController = React.createRef();
  onStatistic = filter => {
    // console.log('onStatistic', filter);
    let { typeTime, valueTime, typeMat, dmaId } = filter;
    if (!typeMat || !typeTime || !valueTime || !dmaId) {
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
      <CustomPage title={'generic.pages.statisticMatByDma'}>
        <List
          refController={this.refController}
          {...this.props}
          resource="customstatisticmatbydmas"
          fixUrl="materialstocks/statisticMatByDma"
          actions={<ConditionStatistic translate={translate} onStatistic={this.onStatistic} />}
          title={translate('resources.customstatisticmatbydmas.title')}
          filter={this.state.filter || {}}
          bulkActions={false}
        >
          <Datagrid>
            <TextField source="typeMatName" />
            <NumberWithUnitField textAlign={'left'} source="totalInitValue" unitKey={'unit'} translate={translate} />
            <NumberWithUnitField textAlign={'left'} source="totalExportValue" unitKey={'unit'} translate={translate} />
            <NumberWithUnitField textAlign={'left'} source="totalUseValue" unitKey={'unit'} translate={translate} />
            <NumberWithUnitField textAlign={'left'} source="adjustValue" unitKey={'unit'} translate={translate} />
            <NumberWithUnitField textAlign={'left'} source="totalCurrentValue" unitKey={'unit'} translate={translate} />
            <TextField source="rate" />
            <FunctionField
              label={translate('resources.customstatisticmatbydmas.fields.statusStock')}
              render={record => `${translate(record.statusStock)}`}
            />
            <CustomEditButton icon={<DetailIcon />} subUrl={'viewDetailMatDma'} text={translate('generic.detail')} />
          </Datagrid>
        </List>
      </CustomPage>
    );
  }
}

StatisticMatByDma.propTypes = {
  translate: PropTypes.func,
  hasList: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  valueformfilter: PropTypes.object,
};

StatisticMatByDma.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
function mapStateToProps(state) {
  return {
    formname: 'filter-form-statistic-mat-dma',
    valueformfilter: getFormValues('filter-form-statistic-mat-stock')(state),
  };
}
const enhance = compose(
  translate,
  connect(mapStateToProps, {
    push: pushAction,
  }),
);

export default enhance(StatisticMatByDma);
