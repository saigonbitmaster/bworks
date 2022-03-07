import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  translate,
  FlexFormFilter,
  List,
  Datagrid,
  TextField,
  Button,
  CUSTOM,
  withDataProvider,
  SelectInput,
  DateField,
  NumberField,
  FunctionField,
} from 'ra-loopback3';
import { Grid, Paper } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, Legend, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { StatisticButtonIcon } from '../../styles/Icons';
import DmaOneLevelSelectInput from '../../components/commons/DmaOneLevelSelectInput';
import config from '../../Config';
const styles = theme => {
  return {
    paper: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    relative: {
      position: 'relative',
    },
  };
};

let choices = [
  { id: 1, name: 'resources.customwaterflowpressures.level1' },
  { id: 2, name: 'resources.customwaterflowpressures.level2' },
];
class ShowInfoLevel1 extends Component {
  refController = React.createRef();
  formRefFilter = React.createRef();
  state = {
    filter: {
      typeStatistic: 'flow',
      typeTime: 'month',
      valueTimeFrom: moment(new Date())
        .subtract(6, 'month')
        .format('YYYY-MM'),
      valueTimeTo: moment(new Date()).format('YYYY-MM'),
      dmaId: 'AllDma',
      level: 1,
    },
    dataCollect: [],
    dmaNames: [],
  };
  componentDidMount() {
    this.getData(this.state.filter);
  }
  onChangeLevel = (e, val) => {
    this.props.onChangeLevel(val);
  };
  onChangeDma = val => {
    this.props.onChangeDmaLevel1(val);
  };
  onClickStatistic = () => {
    let filter = Object.assign({}, this.props.filtercommon);
    let { level1, dmaLevel1 } = this.formRefFilter.current.props.values;
    if (
      !filter.typeStatistic ||
      !filter.typeTime ||
      !filter.valueTimeFrom ||
      !filter.valueTimeTo ||
      !level1 ||
      !dmaLevel1
    ) {
      return;
    }
    filter.level = level1;
    filter.dmaId = dmaLevel1;
    // console.log(filter);
    this.setState({ filter });
    let refController = this.refController;
    refController.current.updateFilter();
    this.getData(filter);
  };
  getData = filter => {
    let tmp = {};
    tmp.where = filter;
    this.props
      .dataProvider(CUSTOM, 'logflowloggerdays/reportWaterFlowPressureGeneral', {
        query: { filter: JSON.stringify(tmp) },
      })
      .then(res => {
        // console.log('res', res);
        if (res && res.data && res.data.records && res.data.dmaNames) {
          let dataCollect = [];
          let key;
          switch (this.state.filter.typeTime) {
            case 'hour': {
              key = 'H:mm';
              break;
            }
            case 'day': {
              key = 'DD/MM/YYYY';
              break;
            }
            case 'month': {
              key = 'MM/YYYY';
              break;
            }
            case 'year': {
              key = 'YYYY';
              break;
            }
          }
          // format time
          for (let i = 0; i < res.data.records.length; i++) {
            let tmp = Object.assign({}, res.data.records[i]);
            tmp.time = moment(tmp.time).format(key);
            dataCollect.push(tmp);
          }

          this.setState({ dataCollect, dmaNames: res.data.dmaNames });
        }
      });
  };

  render() {
    // console.log('this.state.dataCollect', config.color.flowPressureChart);
    const { classes, translate } = this.props;
    let optionFormat;
    switch (this.state.filter.typeTime) {
      case 'hour': {
        optionFormat = { hour: 'numeric', minute: 'numeric' };
        break;
      }
      case 'day': {
        optionFormat = { year: 'numeric', month: 'numeric', day: 'numeric' };
        break;
      }
      case 'month': {
        optionFormat = { year: 'numeric', month: 'numeric' };
        break;
      }
      case 'year': {
        optionFormat = { year: 'numeric' };
        break;
      }
    }
    let renderArea = [];
    let renderLinearGradient = [];

    for (let i = 0; i < this.state.dmaNames.length; i++) {
      renderArea.push(
        <Area
          key={i}
          type="monotone"
          dataKey={this.state.dmaNames[i]}
          stroke={config.color.flowPressureChart[i]}
          fillOpacity={1}
          fill={`url(#color${i})`}
        />,
      );
      renderLinearGradient.push(
        <linearGradient key={i} id={`color${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={config.color.flowPressureChart[i]} stopOpacity={0.8} />
          <stop offset="95%" stopColor={config.color.flowPressureChart[i]} stopOpacity={0} />
        </linearGradient>,
      );
    }

    return (
      <Paper className={classes.paper}>
        <Grid item xs={12} sm={12} {...this.rest}>
          <FlexFormFilter formRef={this.formRefFilter}>
            <Grid middle container>
              <SelectInput
                source="level1"
                label={translate('resources.customwaterflowpressures.selectLevel')}
                choices={choices}
                style={{ marginLeft: '5px' }}
                defaultValue={1}
                onChange={this.onChangeLevel}
              />
              <DmaOneLevelSelectInput source={'dmaLevel1'} level={1} onChange={this.onChangeDma} />
              <Button
                label={translate('generic.statistic.labelButtonStatistic')}
                style={{ marginTop: '30px', marginLeft: '0px', width: '120px', align: 'right' }}
                onClick={this.onClickStatistic}
              >
                <StatisticButtonIcon />
              </Button>
            </Grid>
          </FlexFormFilter>
        </Grid>
        <Grid item xs={12} sm={12}>
          <ResponsiveContainer width="100%" aspect={2}>
            <AreaChart data={this.state.dataCollect} margin={{ top: 20, right: 10, left: 5, bottom: 10 }}>
              <defs>{renderLinearGradient}</defs>
              <XAxis
                dataKey="time"
                label={{
                  value: translate('resources.customwaterflowpressures.time'),
                  position: 'insideBottomRight',
                  fontSize: '0.8em',
                  offset: 0,
                }}
                tick={{ fontSize: '0.8em' }}
              />

              {this.state.filter.typeStatistic === 'flow' && (
                <YAxis
                  padding={{ top: 10 }}
                  tick={{ fontSize: '0.8em' }}
                  label={{ value: translate('generic.units.meter3'), position: 'top', fontSize: '0.8em' }}
                />
              )}
              {this.state.filter.typeStatistic === 'pressure' && (
                <YAxis
                  padding={{ top: 10 }}
                  tick={{ fontSize: '0.8em' }}
                  label={{ value: translate('generic.units.bar'), position: 'top', fontSize: '0.8em' }}
                />
              )}
              <Legend wrapperStyle={{ fontSize: '0.8em' }} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip labelStyle={{ fontSize: '0.8em' }} itemStyle={{ fontSize: '0.8em' }} />
              {renderArea}
            </AreaChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} sm={12}>
          <List
            refController={this.refController}
            {...this.props}
            className="subheader"
            resource="customwaterflowpressurelevel1s"
            fixUrl="logflowloggerdays/reportWaterFlowPressureOverLimit"
            title={translate('resources.customwaterflowpressures.titleListLevel1')}
            filter={this.state.filter || {}}
            bulkActions={false}
          >
            <Datagrid>
              <DateField
                source="time"
                options={optionFormat}
                label={translate('resources.customwaterflowpressures.time')}
              />
              <TextField source="dmaName" label={translate('resources.customwaterflowpressures.dmaName')} />
              <TextField
                source="dataLoggerName"
                label={translate('resources.customwaterflowpressures.dataLoggerName')}
              />
              {this.state.filter.typeStatistic === 'flow' && (
                <NumberField source="totalFlow" label={translate('resources.customwaterflowpressures.totalFlow')} />
              )}
              {this.state.filter.typeStatistic === 'pressure' && (
                <NumberField
                  source="totalPressure"
                  label={translate('resources.customwaterflowpressures.totalPressure')}
                />
              )}
              <FunctionField
                label={translate('resources.customwaterflowpressures.status')}
                render={record => `${translate(record.status)}`}
              />
            </Datagrid>
          </List>
        </Grid>
      </Paper>
    );
  }
}

ShowInfoLevel1.propTypes = {
  translate: PropTypes.func,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
  onChangeLevel: PropTypes.func.isRequired,
  filtercommon: PropTypes.object.isRequired,
  onChangeDmaLevel1: PropTypes.func.isRequired,
};

const enhance = compose(withDataProvider, connect(null, {}), withTheme, withStyles(styles), translate);

export default enhance(ShowInfoLevel1);
