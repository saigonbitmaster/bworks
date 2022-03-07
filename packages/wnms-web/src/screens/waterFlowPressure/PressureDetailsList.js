import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LocalList, Datagrid, FunctionField } from 'ra-loopback3';
import { sortBy, get } from 'lodash';
import { compose } from 'recompose';
import { translate } from 'ra-core';
import { createSelector } from 'reselect';
import { withTheme } from '@material-ui/core';
import moment from 'moment-timezone';

class PressureDetailsList extends Component {
  static propTypes = {
    chartData: PropTypes.any,
    update: PropTypes.number,
    perPage: PropTypes.number,
    basePath: PropTypes.string,
    theme: PropTypes.object,
    translate: PropTypes.func,
    type: PropTypes.string,
  };

  constructor(props) {
    super(props);
    const defaultState = {
      fullIds: [],
      pageIds: [],
      data: {},
      page: 1,
      total: 1,
      perPage: 25,
      update: -1,
    };
    this.state = {
      ...defaultState,
      ...PressureDetailsList.updateStateFromProps(props),
    };
  }

  static getPagingData(p) {
    const dmaSelector = props => props.chartData;
    const perPageSelector = props => props.perPage || 25;

    let loggerDataSelector = createSelector(dmaSelector, perPageSelector, (dmas, perPage) => {
      let dataArr = [];
      dmas.map((dmaItem, dmaIndex) => {
        if (dmaItem.loggers && dmaItem.loggers.length) {
          dmaItem.loggers.map((dataLoggers, dataLoggerIndex) => {
            if (dataLoggers.data.length > 0) {
              dataLoggers.data.map((log, logIndex) => {
                dataArr.push({ ...log, logPath: `[${dmaIndex}].loggers[${dataLoggerIndex}].data[${logIndex}]` });
              });
            }
          });
        }
      });
      const data = {};
      const fullIds = [];
      dataArr.map((item, index) => {
        item.id = item._id + '-' + index;
      });
      // sort
      sortBy(dataArr, 'logTime');
      dataArr.map(item => {
        if (!data[item.id]) {
          data[item.id] = item;
          fullIds.push(item.id);
        }
      });
      const pageIds = fullIds.splice(0, perPage);
      return { pageIds, data, fullIds };
    });
    let result = loggerDataSelector(p);
    return result;
  }

  static updateStateFromProps(props) {
    const { update, perPage = 50 } = props;
    const { pageIds, fullIds, data } = PressureDetailsList.getPagingData(props);
    return { page: 1, perPage, update, pageIds, fullIds, data, total: fullIds.length || 0 };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.update > state.update) {
      return PressureDetailsList.updateStateFromProps(props);
    }
    return state;
  }

  setPage = page => {
    const { fullIds, perPage } = this.state;
    const pageIds = fullIds.splice(perPage * page, perPage * (page + 1));
    this.setState({ page, pageIds });
  };

  getLoggerName = record => {
    const { chartData } = this.props;
    const logPathSplit = record.logPath.split('.');
    const dmaName = get(chartData, `${logPathSplit[0]}.name`, '');
    const loggerName = get(chartData, `${logPathSplit[0]}.${logPathSplit[1]}.name`, '');
    return dmaName ? `${dmaName} > ${loggerName}` : loggerName;
  };

  getCode = record => {
    const { chartData } = this.props;
    const logPathSplit = record.logPath.split('.');
    return get(chartData, `${logPathSplit[0]}.${logPathSplit[1]}.optionKey`, '');
  };

  getStatusLabel = record => {
    const { theme, chartData, translate } = this.props;
    const logPathSplit = record.logPath.split('.');
    // get logger Config
    const pressureConfig = get(chartData, `${logPathSplit[0]}.${logPathSplit[1]}.meta.pressure`, {});
    let status = 'normal';
    if (record.pressure > pressureConfig.high) {
      status = 'high';
    } else if (record.pressure < pressureConfig.loss) {
      status = 'loss';
    } else if (record.pressure < pressureConfig.low) {
      status = 'low';
    }
    return <label style={{ color: theme.status[status] }}>{translate(`generic.conclusionPressure.${status}`)}</label>;
  };

  rednerPressure = record => {
    const { type } = this.props;
    if (type === 'hour') {
      return record.pressure;
    }
    return get(record, 'pressure[0]') + ' - ' + get(record, 'pressure[1]');
  };

  renderTime = record => {
    const { type } = this.props;
    if (type === 'hour') {
      return moment(record.logTime).format('L LT');
    }
    return `${moment(record.logTime).format('L LT')} - ${moment(record.logTime)
      .add(1, 'hours')
      .format('LT')}`;
  };

  renderFlowrate = record => {
    const { type } = this.props;
    if (type === 'hour') {
      return record.flowRate;
    }
    return get(record, 'flowRate[0]') + ' - ' + get(record, 'flowRate[1]');
  };

  render() {
    const { basePath } = this.props;
    const { pageIds, data, perPage, page, total } = this.state;
    return (
      <LocalList
        basePath={basePath}
        ids={pageIds}
        page={page}
        setPage={this.setPage}
        perPage={perPage}
        data={data}
        total={total}
        hideHeader
        resource="flowloggerhours"
      >
        <Datagrid>
          <FunctionField label="generic.dataLogger" source="name" render={this.getLoggerName} />
          <FunctionField label="generic.code" source="name" render={this.getCode} />
          <FunctionField label="generic.time" render={this.renderTime} />
          <FunctionField label="generic.nameWithUnits.flowRate" render={this.renderFlowrate} />
          <FunctionField label="generic.pressure" render={this.rednerPressure} />
          <FunctionField label="generic.status" render={this.getStatusLabel} />
        </Datagrid>
      </LocalList>
    );
  }
}

const EnhancePressureDetailsList = compose(translate, withTheme)(PressureDetailsList);
export default EnhancePressureDetailsList;
