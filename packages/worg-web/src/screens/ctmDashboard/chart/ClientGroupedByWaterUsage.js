'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import compose from 'recompose/compose';
import { Paper, Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { CUSTOM, SimpleForm, MonthInput } from 'ra-loopback3';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(1),
    height: '100%',
  },
  header: {
    paddingTop: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
  },
});

class ClientGroupedByWaterUsage extends Component {
  static propTypes = {
    dataProvider: PropTypes.func,
    classes: PropTypes.object,
  };
  state = {
    data: [],
  };

  componentDidMount = () => {
    const { change } = this.props;
    this.getData();
    change(
      'client-grouped-by-water-usage-form',
      'month',
      moment()
        .startOf('month')
        .toDate(),
    );
  };

  handleChangeMonth = (_, value) => this.getData(value);

  getData = month => {
    const { dataProvider } = this.props;
    const queryObject = {
      subUrl: 'getClientGroupedByWaterUsage',
      fullUrl: true,
      method: 'get',
    };

    if (month) {
      queryObject.query = { month: moment(month).toDate() };
    }

    dataProvider(CUSTOM, 'Clients', queryObject).then(({ data: { result, interval, lastBoundary } }) => {
      this.setState({ data: result, interval, lastBoundary });
    });
  };

  render() {
    const { classes, translate } = this.props;
    const { data, interval, lastBoundary } = this.state;

    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom className={classes.header}>
          {translate('resources.clients.statistic.clientGroupedByWaterUsage')}
        </Typography>
        <SimpleForm form={'client-grouped-by-water-usage-form'} toolbar={null}>
          <MonthInput
            label="resources.clients.fields.termMeterNumber"
            allowEmpty={false}
            source="month"
            date
            alwaysOn
            onChange={this.handleChangeMonth}
          />
        </SimpleForm>
        <Grid container>
          <Grid item style={{ margin: 'auto', marginBottom: '15px' }}>
            {data.length > 0 ? (
              <BarChart
                width={500}
                height={300}
                layout="vertical"
                data={data}
                margin={{ top: 5, right: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" domain={['dataMin', 'dataMax']} dataKey="waterUsed" />
                <Tooltip
                  formatter={value => [value, 'Số KH']}
                  labelFormatter={value => (
                    <span>
                      {value === lastBoundary ? `${value} ~ ` : `${value} ~ ${value + interval}`} m<sup>3</sup>
                    </span>
                  )}
                />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            ) : (
              'Không có dữ liệu'
            )}
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default compose(withStyles(styles), connect(null, { change }))(ClientGroupedByWaterUsage);
