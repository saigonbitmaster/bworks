import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, Grid, Typography, withStyles } from '@material-ui/core';
import Chart from 'react-google-charts';
import { round } from 'lodash';
import { compose } from 'recompose';
import { translate } from 'ra-loopback3';

const factoryExample = {
  id: 'factory1',
  name: 'Factory1',
  capacityDesign: 150000, // m3 24h
  pressureDesign: 4, // Bar
  electricRateDesign: 100, // Kw/h
};

class OverviewFactoryMonitor extends Component {
  state = {
    flowRate: 6500, // m3/h
    pressure: 3.3, // Bar
    electricRate: 80, // kw/h
  };

  getFlowRateChart = () => {
    const { factory, translate } = this.props;
    const capacityHour = round(factory.capacityDesign / 24);
    return {
      data: [
        ['Label', 'Value'],
        [translate('generic.units.flowRate'), this.state.flowRate],
      ],
      name: factory.name,
      options: this.getOptions(capacityHour),
    };
  };

  getPressureChart = () => {
    const { factory, translate } = this.props;
    const capacityHour = round(factory.pressureDesign, 1);
    return {
      data: [
        ['Label', 'Value'],
        [translate('generic.units.pressure'), this.state.pressure],
      ],
      name: factory.name,
      options: this.getOptions(capacityHour),
    };
  };

  getElectricChart = () => {
    const { factory, translate } = this.props;
    const capacityHour = round(factory.electricRateDesign, 1);
    return {
      data: [
        ['Label', 'Value'],
        [translate('generic.units.electricRate'), this.state.electricRate],
      ],
      name: factory.name,
      options: this.getOptions(capacityHour),
    };
  };

  getOptions = (designValue, currentOptions = {}, roundFactor = 0) => {
    return {
      max: round(designValue * 1.2, roundFactor),
      yellowFrom: round(designValue * 0.8, roundFactor),
      yellowTo: round(designValue, roundFactor),
      redFrom: round(designValue, roundFactor),
      redTo: round(designValue * 1.2, roundFactor),
      ...currentOptions,
    };
  };

  render() {
    const { classes, translate } = this.props;
    const flowRateChartData = this.getFlowRateChart();
    const pressureChartData = this.getPressureChart();
    const electricChartData = this.getElectricChart();
    return (
      <Card>
        <CardHeader title={flowRateChartData.name} />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item sm={4} className={classes.chart}>
              <Chart chartType="Gauge" data={flowRateChartData.data} options={flowRateChartData.options} />
              <Typography variant="h6">{translate('generic.nameWithUnits.flowRate')}</Typography>
            </Grid>
            <Grid item sm={4} className={classes.chart}>
              <Chart chartType="Gauge" data={pressureChartData.data} options={pressureChartData.options} />
              <Typography variant="h6">{translate('generic.nameWithUnits.pressure')}</Typography>
            </Grid>
            <Grid item sm={4} className={classes.chart}>
              <Chart chartType="Gauge" data={electricChartData.data} options={electricChartData.options} />
              <Typography variant="h6">{translate('generic.nameWithUnits.electricRate')}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}
OverviewFactoryMonitor.propTypes = {
  factory: PropTypes.object,
  translate: PropTypes.func,
  classes: PropTypes.object,
};

OverviewFactoryMonitor.defaultProps = {
  factory: factoryExample,
};

const styles = () => ({
  chart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartTitle: {
    textAlign: 'center',
    display: 'flex',
  },
  chartGauge: {
    textAlign: 'center',
  },
});

export default compose(translate, withStyles(styles))(OverviewFactoryMonitor);
