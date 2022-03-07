import React, { Component } from 'react';
import { Grid, withTheme } from '@material-ui/core';
import { compose } from 'recompose';
import { AuthView, withDataProvider, withTranslate } from 'ra-loopback3';
import PropTypes from 'prop-types';
import ClientGroupedByType from './ClientGroupedByType';
import ClientGroupedByGeo from './ClientGroupedByGeo';
import ClientGroupedByWaterUsage from './ClientGroupedByWaterUsage';
import IncomeGroupedByClientType from './IncomeGroupedByClientType';
import IncomeGroupedByGeo from './IncomeGroupedByGeo';
import TopDebtOverdueClientList from './TopDebtOverdueClientList';
import StatisticRevenue from './statisticRevenue';

class Chart extends Component {
  render() {
    const { theme, dataProvider, translate, ...rest } = this.props;
    return (
      <Grid middle container spacing={2}>
        <Grid item xs={12} sm={4}>
          <AuthView permission={{ name: 'Dashboard', action: 'clientGroupedByType' }}>
            <ClientGroupedByType dataProvider={dataProvider} translate={translate} />
          </AuthView>
        </Grid>
        <Grid item xs={12} sm={4}>
          <AuthView permission={{ name: 'Dashboard', action: 'clientGroupedByGeo' }}>
            <ClientGroupedByGeo dataProvider={dataProvider} translate={translate} />
          </AuthView>
        </Grid>
        <Grid item xs={12} sm={4}>
          <AuthView permission={{ name: 'Dashboard', action: 'clientGroupedByWaterUsage' }}>
            <ClientGroupedByWaterUsage dataProvider={dataProvider} translate={translate} />
          </AuthView>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AuthView permission={{ name: 'Dashboard', action: 'statisticRevenue' }}>
            <StatisticRevenue />
          </AuthView>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AuthView permission={{ name: 'Dashboard', action: 'topDebtOverdueClientList' }}>
            <TopDebtOverdueClientList dataProvider={dataProvider} translate={translate} {...rest} />
          </AuthView>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AuthView permission={{ name: 'Dashboard', action: 'incomeGroupedByClientType' }}>
            <IncomeGroupedByClientType dataProvider={dataProvider} translate={translate} />
          </AuthView>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AuthView permission={{ name: 'Dashboard', action: 'incomeGroupedByGeo' }}>
            <IncomeGroupedByGeo dataProvider={dataProvider} translate={translate} />
          </AuthView>
        </Grid>
      </Grid>
    );
  }
}

Chart.propTypes = {
  dataProvider: PropTypes.func,
  theme: PropTypes.object,
};

export default compose(withTheme, withDataProvider, withTranslate)(Chart);
