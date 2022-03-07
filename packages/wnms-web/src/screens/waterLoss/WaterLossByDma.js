import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  translate,
  DmaSelectInput,
  FlexFormFilter,
  Button,
  CUSTOM,
  withDataProvider,
  TimeRangeInput,
  CustomPage,
  ListView,
  Datagrid,
  NumberField,
  TextField,
  BooleanInput,
} from 'ra-loopback3';
import keyBy from 'lodash/keyBy';
import { Grid } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import _ from 'lodash';
import { StatisticButtonIcon } from '../../styles/Icons';
import format from '../../util/format';
import { COLORS as COLORS_TEMPLATE, pieRenderCustomizedLabel, pieRenderActiveShape } from '../../util/chart';
const COLORS = [COLORS_TEMPLATE.subConsumption, COLORS_TEMPLATE.mainternance, COLORS_TEMPLATE.leak];
const styles = () => {
  return {
    paper: {
      height: 'auto',
    },
    widthFormGroup: { float: 'left', paddingRight: '8px' },
  };
};
class WaterLossByDma extends Component {
  // refController = React.createRef();
  formRefFilter = React.createRef();
  state = {
    dataCollect: [],
    dataSum: [],
    pieActiveIndex: 0,
  };

  componentDidMount() {
    this.onClickStatistic();
  }
  onClickStatistic = () => {
    const { sendFilter } = this.props;
    const { dmaId, timeRange, flgIncludeChild = false } = this.formRefFilter.current.props.values;
    const filter = {
      dmaId: dmaId,
      timeRange: timeRange,
      flgIncludeChild,
    };
    sendFilter(filter);
    this.getData(filter);
  };

  getData = filter => {
    const { dmaId, timeRange, flgIncludeChild } = filter;
    // console.log('filter', filter);
    this.props
      .dataProvider(CUSTOM, 'dmas/statisticQuantityByMonth', {
        query: { dmaId, timeRange: JSON.stringify(timeRange), flgIncludeChild },
      })
      .then(res => {
        let dataCollect = [];
        let key = timeRange.type === 'month' ? 'MM/YYYY' : 'YYYY';
        // format time
        for (let i = 0; i < res.data.length; i++) {
          let tmp = Object.assign({}, res.data[i]);
          tmp.time = moment(tmp.time).format(key);

          // format
          tmp.leak = format.formatWithDec(tmp.leak);
          tmp.mainConsumption = format.formatWithDec(tmp.mainConsumption);
          tmp.mainternance = format.formatWithDec(tmp.mainternance);
          tmp.subConsumption = format.formatWithDec(tmp.subConsumption);

          dataCollect.push(tmp);
        }
        // su dung cho circle char
        let totalWaterOuput = format.formatWithDec(_.sumBy(res.data, 'subConsumption')); // dau ra
        let totalMainternance = format.formatWithDec(_.sumBy(res.data, 'mainternance')); // suc xa
        let totalLeak = format.formatWithDec(_.sumBy(res.data, 'leak')); // that thoat
        let dataSum = [
          {
            name: this.props.translate('resources.dmas.statistic.totalWaterOuput').replace(' (m³)', ''),
            value: totalWaterOuput,
          },
          {
            name: this.props.translate('resources.dmas.statistic.totalMainternance').replace(' (m³)', ''),
            value: totalMainternance,
          },
          {
            name: this.props.translate('resources.dmas.statistic.totalLeak').replace(' (m³)', ''),
            value: totalLeak,
          },
        ];
        this.setState({ dataCollect, dataSum });
      });
  };

  onChangeTime = dataTime => {
    let tmp = Object.assign({}, dataTime);
    tmp.dmaId = this.state.filter.dmaId;
    this.setState({ filter: tmp });
  };

  onPieEnter = (data, index) => {
    if (index === 0 || (index && index.constructor === Number)) {
      this.setState({
        pieActiveIndex: index,
      });
    }
  };
  format = val => {
    return format.number(val) + ' ' + 'm³';
  };
  render() {
    const { translate, classes, title, defaultValue, setFilters } = this.props;
    const { dataCollect } = this.state;
    const showMainConsumption = false; // dataCollect.some(item => !item.subConsumption);
    // console.log('WaterLossByDma props', defaultValue);
    // console.log('WaterLossByDma state', this.state);
    // console.log('WaterLossByDma showMainConsumption', showMainConsumption);
    return (
      <CustomPage header card title={title}>
        <Grid container>
          <Grid item xs={12} sm={12}>
            <FlexFormFilter
              formName="statistic-waterloss"
              formRef={this.formRefFilter}
              destroyOnUnmount={true}
              submitButton
              defaultValue={defaultValue}
              setFilters={setFilters}
            >
              <DmaSelectInput
                source={'dmaId'}
                label={translate('generic.dma').toUpperCase()}
                style={{ marginLeft: '5px' }}
                alldma={'true'}
                formClassName={classes.widthFormGroup}
              />
              <BooleanInput
                label={translate('generic.includeChildDma')}
                source="flgIncludeChild"
                formClassName={classes.widthFormGroup}
                style={{ marginTop: '30px', marginLeft: '10px', width: '200px' }}
              />
              <TimeRangeInput
                fullWidth
                label={''}
                types={['month']}
                source={'timeRange'}
                defaultType={'month'}
                formClassName={classes.widthFormGroup}
              />
              <Button
                decorate="true"
                label={translate('generic.statistic.labelButtonStatistic')}
                style={{ marginTop: '30px', float: 'left' }}
                onClick={this.onClickStatistic}
                type="submit"
              >
                <StatisticButtonIcon />
              </Button>
            </FlexFormFilter>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Grid container>
              <Grid item xs={12} sm={showMainConsumption ? 12 : 6}>
                <ResponsiveContainer width="100%" minHeight={200}>
                  <ComposedChart data={dataCollect} margin={{ top: 20, right: 0, left: 10, bottom: 5 }}>
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis
                      dataKey="time"
                      label={{
                        value: translate('resources.dmas.statistic.time'),
                        position: 'insideBottomRight',
                        fontSize: '0.8em',
                        offset: 0,
                      }}
                      tick={{ fontSize: '0.8em' }}
                    />
                    <YAxis
                      padding={{ top: 10 }}
                      label={{ value: translate('generic.units.meter3'), position: 'top', fontSize: '0.8em' }}
                      tick={{ fontSize: '0.8em' }}
                      tickFormatter={value => format.number(value)}
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip
                      labelStyle={{ fontSize: '0.8em' }}
                      itemStyle={{ fontSize: '0.8em' }}
                      formatter={this.format}
                    />
                    <Legend wrapperStyle={{ fontSize: '0.8em' }} />
                    {showMainConsumption && (
                      <Bar
                        dataKey="mainConsumption"
                        stackId="b"
                        fill={COLORS_TEMPLATE.mainConsumption}
                        name={this.props.translate('resources.dmas.statistic.totalWaterInput').replace(' (m³)', '')}
                        formatter={this.format}
                      />
                    )}
                    <Bar
                      dataKey="subConsumption"
                      stackId="b"
                      fill={COLORS_TEMPLATE.subConsumption}
                      name={this.props.translate('resources.dmas.statistic.totalWaterOuput').replace(' (m³)', '')}
                      formatter={this.format}
                    />
                    <Bar
                      dataKey="mainternance"
                      stackId="b"
                      fill={COLORS_TEMPLATE.mainternance}
                      name={translate('resources.dmas.statistic.totalMainternance').replace(' (m³)', '')}
                      formatter={this.format}
                    />
                    <Bar
                      dataKey="leak"
                      stackId="b"
                      fill={COLORS_TEMPLATE.leak}
                      name={translate('resources.dmas.statistic.totalLeak').replace(' (m³)', '')}
                      formatter={this.format}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Grid>
              {!showMainConsumption && (
                <Grid item xs={12} sm={6}>
                  <ResponsiveContainer width="100%" aspect={1.6}>
                    <PieChart>
                      <Pie
                        data={this.state.dataSum}
                        dataKey="value"
                        nameKey="name"
                        labelLine={false}
                        activeIndex={this.state.pieActiveIndex || 0}
                        onMouseEnter={this.onPieEnter}
                        activeShape={pieRenderActiveShape}
                        label={pieRenderCustomizedLabel}
                        fill="#8884d8"
                        outerRadius={'60%'}
                        innerRadius={'0%'}
                      >
                        {this.state.dataSum.map((entry, index) => {
                          return <Cell key={entry} fill={COLORS[index % COLORS.length]} />;
                        })}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <ListView
              data={keyBy(dataCollect, 'id')}
              translate={translate}
              ids={dataCollect.map(item => item.id)}
              resource="dmas"
              total={dataCollect.length}
              defaultTitle={translate('generic.details')}
              bulkActions={false}
              page={1}
              onUnselectItems={() => {}}
              perPage={dataCollect.length}
              currentSort={{ field: 'id' }}
            >
              <Datagrid>
                <TextField source="time" label="resources.dmas.statistic.time" />
                <NumberField
                  source="mainConsumption"
                  label="resources.dmas.statistic.totalWaterInput"
                  style={{ color: COLORS_TEMPLATE.mainConsumption }}
                />
                <NumberField
                  source="subConsumption"
                  label="resources.dmas.statistic.totalWaterOuput"
                  style={{ color: COLORS_TEMPLATE.mainternance }}
                />
                <NumberField
                  source="mainternance"
                  label="resources.dmas.statistic.totalMainternance"
                  style={{ color: COLORS_TEMPLATE.mainternance }}
                />
                <NumberField
                  source="leak"
                  label="resources.dmas.statistic.totalLeak"
                  style={{ color: COLORS_TEMPLATE.leak }}
                />
              </Datagrid>
            </ListView>
          </Grid>
        </Grid>
      </CustomPage>
    );
  }
}
WaterLossByDma.propTypes = {
  translate: PropTypes.func,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
  title: PropTypes.string,
  sendFilter: PropTypes.func,
  defaultValue: PropTypes.object,
  setFilters: PropTypes.func,
};
WaterLossByDma.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(withDataProvider, connect(null, {}), withTheme, withStyles(styles), translate);

export default enhance(WaterLossByDma);
