import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate, Header, CUSTOM, withDataProvider } from 'ra-loopback3';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Paper, Grid } from '@material-ui/core';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ComposedChart, ResponsiveContainer } from 'recharts';
import FilterFromToTime from '../../../components/common/filter/FilterFromToTime';
import format from '../../../util/format';
const styles = theme => {
  return {
    paper: {
      marginTop: theme.spacing(1),
    },
  };
};
// thong ke khoi luong nuoc
class StatisticQuantityWater extends Component {
  state = {
    filter: {
      fromTime: moment()
        .subtract(6, 'month')
        .toDate(),
      toTime: moment().toDate(),
    },
  };
  UNSAFE_componentWillMount() {
    this.getData(this.state.filter);
  }

  onChangeFilter = filter => {
    this.setState({ filter });
    this.getData(filter);
  };

  getData = filter => {
    let tmp = {};
    tmp.where = filter;
    this.props
      .dataProvider(CUSTOM, 'clients/statisticQuantityWater', {
        query: { filter: JSON.stringify(tmp) },
      })
      .then(res => {
        if (res && res.data && res.data.length) {
          this.setState({ dataCollect: res.data });
        }
      });
  };
  format = val => {
    return format.number(val) + ' ' + this.props.translate('generic.units.meter3');
  };
  render() {
    const { translate, theme } = this.props;
    const { filter, dataCollect } = this.state;
    const { fromTime, toTime } = filter;
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <Paper>
            <Header title="resources.clients.statistic.statisticQuantityWater" />
            <Grid container>
              <Grid item xs={12} sm={12}>
                <FilterFromToTime
                  formName="formFilterStatisticQuantityWater"
                  getFilter={this.onChangeFilter}
                  defautFromTime={fromTime}
                  defautToTime={toTime}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <ResponsiveContainer width="100%" aspect={2}>
                  <ComposedChart data={dataCollect} margin={{ top: 20, right: 10, left: 30, bottom: 5 }}>
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis
                      dataKey="time"
                      label={{
                        value: translate('generic.time'),
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
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip labelStyle={{ fontSize: '0.8em' }} itemStyle={{ fontSize: '0.8em' }} />
                    <Legend wrapperStyle={{ fontSize: '0.8em' }} />
                    <Bar
                      dataKey="sumWaterUsage"
                      stackId="a"
                      fill={'#4dbd74'}
                      name={translate('resources.clients.statistic.sumWaterUsage')}
                      formatter={this.format}
                    />
                    <Bar
                      dataKey="sumLoss"
                      stackId="b"
                      fill={'#ff5454'}
                      name={translate('resources.clients.statistic.sumLoss')}
                      formatter={this.format}
                    />
                    <Bar
                      dataKey="sumSupply"
                      stackId="c"
                      fill={'#2962FF'}
                      name={translate('resources.clients.statistic.sumSupply')}
                      formatter={this.format}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}
StatisticQuantityWater.propTypes = {
  theme: PropTypes.object,
  translate: PropTypes.func,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
};
StatisticQuantityWater.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};
// eslint-disable-next-line
const mapStateToProps = state => {
  return {};
};
const enhance = compose(withDataProvider, connect(mapStateToProps, {}), withTheme, translate, withStyles(styles));

export default enhance(StatisticQuantityWater);
